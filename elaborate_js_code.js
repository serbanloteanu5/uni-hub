/* elaborate_js_code.js */

// This code demonstrates a complex implementation of a real-time chat application using Node.js and Socket.io
// It includes functionalities such as user authentication, chat rooms, private messaging, and typing indicators.

// Import necessary libraries
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const bcrypt = require('bcrypt');

// Create an instance of express app and configure it
const app = express();
const server = http.createServer(app);
const io = socketio(server);
app.use(express.static(__dirname + '/public'));

// Define routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// Mocked data for user authentication
const users = [
    { id: 1, username: 'user1', password: 'pass1' },
    { id: 2, username: 'user2', password: 'pass2' },
    { id: 3, username: 'user3', password: 'pass3' }
];

// Handle authentication request
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Find user in mocked data
    const user = users.find((u) => u.username === username);

    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Compare passwords using bcrypt
    bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
            // User authenticated successfully
            return res.status(200).json({ message: 'Authentication successful' });
        } else {
            return res.status(401).json({ message: 'Incorrect password' });
        }
    });
});

// Chat room logic
const chatRooms = {};

// Listen for socket connections
io.on('connection', (socket) => {
    console.log(`New user connected: ${socket.id}`);

    // Handle user joining a chat room
    socket.on('joinChatRoom', (data) => {
        const { room, username } = data;

        // Create room if it doesn't exist
        if (!chatRooms[room]) {
            chatRooms[room] = [];
        }

        // Store username and socket in the room
        chatRooms[room].push({ username, socket });

        // Broadcast the user joining to everyone in the room
        socket.broadcast.to(room).emit('userJoined', username);

        // Join the room
        socket.join(room);

        // Retrieve existing chat history for the room (if any) and send to the user
        const chatHistory = chatRooms[room].map((msg) => msg.username + ': ' + msg.message);
        socket.emit('chatHistory', chatHistory);
    });

    // Handle incoming messages
    socket.on('chatMessage', (data) => {
        const { room, message } = data;

        // Store the message in the room
        chatRooms[room].push({ username: 'system', message });

        // Broadcast the message to everyone in the room
        socket.broadcast.to(room).emit('newMessage', { username: 'system', message });
    });

    // Handle private messaging
    socket.on('privateMessage', (data) => {
        const { recipient, message } = data;
        const sender = getUsernameBySocket(socket);

        // Find recipient's socket
        const recipientSocket = getSocketByUsername(recipient);

        if (recipientSocket) {
            // Send the private message to the recipient
            recipientSocket.emit('newPrivateMessage', { sender, message });

            // Send a notification to the sender
            socket.emit('privateMessageSent', recipient);
        } else {
            // Send a notification to the sender that recipient is offline
            socket.emit('offlineRecipient', recipient);
        }
    });

    // Handle typing indicators
    socket.on('typing', (data) => {
        const { room, isTyping } = data;

        // Broadcast typing indicator to everyone in the room except the sender
        socket.broadcast.to(room).emit('typingIndicator', { username: getUsernameBySocket(socket), isTyping });
    });

    // Handle user disconnections
    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);

        // Remove the user from all rooms
        Object.keys(chatRooms).forEach((room) => {
            chatRooms[room] = chatRooms[room].filter((u) => u.socket.id !== socket.id);
        });
    });

    // Helper function to get username by socket instance
    const getUsernameBySocket = (socket) => {
        const room = Object.keys(chatRooms).find((room) =>
            chatRooms[room].find((u) => u.socket.id === socket.id)
        );
        const user = chatRooms[room].find((u) => u.socket.id === socket.id);
        return user ? user.username : '';
    };

    // Helper function to get socket instance by username
    const getSocketByUsername = (username) => {
        const room = Object.keys(chatRooms).find((room) =>
            chatRooms[room].find((u) => u.username === username)
        );
        const user = chatRooms[room].find((u) => u.username === username);
        return user ? user.socket : null;
    };
});

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});