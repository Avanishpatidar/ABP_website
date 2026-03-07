import 'dotenv/config';
import {
    FunctionResponse,
    GoogleGenAI,
    LiveServerMessage,
    MediaResolution,
    Modality,
    Session,
} from '@google/genai';
import mime from 'mime';
import { writeFile } from 'fs';
import * as readline from 'readline';
import * as path from 'path';

// --- Configuration ---
const MODEL_NAME = 'gemini-2.5-flash-native-audio-preview-12-2025';
const API_KEY = process.env.GEMINI_API_KEY;
const SYSTEM_INSTRUCTION = `You are Avanish Patidar, a passionate software engineer and creator.
You are helpful, friendly, and knowledgeable about web development, AI, and technology.
You are currently talking to a user via a voice interface.
Keep your responses concise and natural, suitable for speech.`;

// --- Tool Definitions ---
// Example tool: Get current weather (mocked)
const tools = [
    {
        functionDeclarations: [
            {
                name: 'get_current_weather',
                description: 'Get the current weather in a given location',
                parameters: {
                    type: 'OBJECT' as any,
                    properties: {
                        location: {
                            type: 'STRING' as any,
                            description: 'The city and state, e.g. San Francisco, CA',
                        },
                    },
                    required: ['location'],
                },
            },
        ],
    },
];

// --- State ---
const responseQueue: LiveServerMessage[] = [];
let session: Session | undefined = undefined;
const audioParts: string[] = [];
let currentTurnAudioParts: string[] = []; // Buffer for the current turn's audio

// --- Main Logic ---

async function main() {
    if (!API_KEY) {
        console.error('Error: GEMINI_API_KEY environment variable is not set.');
        process.exit(1);
    }

    const ai = new GoogleGenAI({
        apiKey: API_KEY,
    });

    const config = {
        responseModalities: [Modality.AUDIO],
        mediaResolution: MediaResolution.MEDIA_RESOLUTION_MEDIUM,
        speechConfig: {
            voiceConfig: {
                prebuiltVoiceConfig: {
                    voiceName: 'Zephyr',
                },
            },
        },
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: tools,
    };

    console.log('Connecting to Gemini...');

    try {
        session = await ai.live.connect({
            model: MODEL_NAME,
            callbacks: {
                onopen: () => {
                    console.log('Connected! You can start typing. Type "exit" to quit.');
                    promptUser();
                },
                onmessage: (message: LiveServerMessage) => {
                    responseQueue.push(message);
                    processQueue(); // Trigger processing whenever a message arrives
                },
                onerror: (e: any) => {
                    console.error('Session Error:', e.message);
                },
                onclose: (e: CloseEvent) => {
                    console.log('Session Closed:', e.reason);
                },
            },
            config,
        });
    } catch (error) {
        console.error("Failed to connect:", error);
    }
}

// --- Queue Processing ---
let isProcessing = false;

async function processQueue() {
    if (isProcessing) return;
    isProcessing = true;

    while (responseQueue.length > 0) {
        const message = responseQueue.shift();
        if (message) {
            await handleMessage(message);
        }
    }

    isProcessing = false;
}

async function handleMessage(message: LiveServerMessage) {
    // Handle Tool Call
    if (message.toolCall) {
        console.log(`\n[Tool Call] Request: ${JSON.stringify(message.toolCall)}`);
        const responses: FunctionResponse[] = [];
        if (message.toolCall.functionCalls) {
            for (const call of message.toolCall.functionCalls) {
                if (call.name === 'get_current_weather') {
                    // Mock response
                    const location = (call.args as any).location;
                    console.log(`[Tool Call] Executing get_current_weather for ${location}`);
                    responses.push({
                        id: call.id,
                        name: call.name,
                        response: { result: `The weather in ${location} is Sunny and 25°C.` }
                    });
                }
            }
        }

        if (responses.length > 0) {
            console.log(`[Tool Call] Sending Response: ${JSON.stringify(responses)}`);
            await session?.sendToolResponse({
                functionResponses: responses
            });
        }
        return;
    }

    // Handle Model Turn (Content)
    if (message.serverContent?.modelTurn?.parts) {
        const parts = message.serverContent.modelTurn.parts;
        for (const part of parts) {
            if (part.text) {
                process.stdout.write(part.text); // Stream text to console
            }

            if (part.inlineData) {
                // Accumulate audio data
                const data = part.inlineData.data;
                if (data) {
                    currentTurnAudioParts.push(data);
                }
            }
        }
    }

    if (message.serverContent?.turnComplete) {
        console.log('\n[Turn Complete]');
        if (currentTurnAudioParts.length > 0) {
            saveAudio(currentTurnAudioParts);
            currentTurnAudioParts = []; // Reset for next turn
        }
        promptUser(); // Ready for next input
    }
}

// --- Input Handling ---
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

function promptUser() {
    rl.question('\n> ', async (input) => {
        if (input.toLowerCase() === 'exit') {
            console.log('Closing session...');
            session?.close();
            rl.close();
            process.exit(0);
        }

        if (input.trim() === '') {
            promptUser();
            return;
        }

        try {
            await session?.sendClientContent({
                turns: [input],
                turnComplete: true
            });
        } catch (e) {
            console.error("Error sending message:", e);
            promptUser();
        }
    });
}

// --- Audio Saving ---
function saveAudio(parts: string[]) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const fileName = path.join('audio_output', `response_${timestamp}.wav`);

    // Assuming standard PCM format from Gemini (1 channel, 24kHz usually, but let's use the header logic)

    const buffer = convertToWav(parts, 'audio/pcm; rate=24000'); // Hardcoded for now as it's standard for this model

    writeFile(fileName, buffer, (err) => {
        if (err) {
            console.error(`Error writing audio file ${fileName}:`, err);
        } else {
            console.log(`Saved audio to ${fileName}`);
        }
    });
}


// --- WAV Helper Functions (Adapted from snippet) ---

interface WavConversionOptions {
    numChannels: number,
    sampleRate: number,
    bitsPerSample: number
}

function convertToWav(rawData: string[], mimeType: string) {
    const options = parseMimeType(mimeType);
    // rawData is base64 strings. We need to convert to buffers first to get true length.
    const buffers = rawData.map(data => Buffer.from(data, 'base64'));
    const totalByteLength = buffers.reduce((a, b) => a + b.length, 0);

    const wavHeader = createWavHeader(totalByteLength, options);
    return Buffer.concat([wavHeader, ...buffers]);
}

function parseMimeType(mimeType: string) {
    // Default to 24kHz, 1 channel, 16 bit if parsing fails or is simple
    const options: WavConversionOptions = {
        numChannels: 1,
        bitsPerSample: 16,
        sampleRate: 24000, // Default for Gemini Live
    };

    // Simple parser if needed, but 24000 is the standard for the model.
    if (mimeType.includes('rate=')) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        if (rateMatch) {
            options.sampleRate = parseInt(rateMatch[1], 10);
        }
    }

    return options;
}

function createWavHeader(dataLength: number, options: WavConversionOptions) {
    const {
        numChannels,
        sampleRate,
        bitsPerSample,
    } = options;

    const byteRate = sampleRate * numChannels * bitsPerSample / 8;
    const blockAlign = numChannels * bitsPerSample / 8;
    const buffer = Buffer.alloc(44);

    buffer.write('RIFF', 0);                      // ChunkID
    buffer.writeUInt32LE(36 + dataLength, 4);     // ChunkSize
    buffer.write('WAVE', 8);                      // Format
    buffer.write('fmt ', 12);                     // Subchunk1ID
    buffer.writeUInt32LE(16, 16);                 // Subchunk1Size (PCM)
    buffer.writeUInt16LE(1, 20);                  // AudioFormat (1 = PCM)
    buffer.writeUInt16LE(numChannels, 22);        // NumChannels
    buffer.writeUInt32LE(sampleRate, 24);         // SampleRate
    buffer.writeUInt32LE(byteRate, 28);           // ByteRate
    buffer.writeUInt16LE(blockAlign, 32);         // BlockAlign
    buffer.writeUInt16LE(bitsPerSample, 34);      // BitsPerSample
    buffer.write('data', 36);                     // Subchunk2ID
    buffer.writeUInt32LE(dataLength, 40);         // Subchunk2Size

    return buffer;
}

main();
