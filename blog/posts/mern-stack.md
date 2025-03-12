# Building Full Stack Applications with MERN

The MERN stack is a popular choice for building full-stack web applications. It consists of MongoDB, Express.js, React.js, and Node.js - all JavaScript-based technologies that work seamlessly together.

## What is the MERN Stack?

- **MongoDB**: A NoSQL database that stores data in flexible, JSON-like documents
- **Express.js**: A web application framework for Node.js
- **React.js**: A JavaScript library for building user interfaces
- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine

## Why Choose MERN?

1. **JavaScript Everywhere**: Use the same language for both frontend and backend
2. **JSON Data Flow**: Seamless data transfer between all parts of the application
3. **Flexible & Scalable**: NoSQL database and component-based UI
4. **Huge Community**: Abundant resources, libraries, and support

## Setting Up a MERN Project

### 1. Backend Setup

First, let's set up our Node.js and Express.js server:

```javascript
// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.