const express = require('express');
const path = require('path');
const colors = require('colors');
const logger = require('morgan');
require('dotenv').config();
const mongoose = require('mongoose');
const passport = require('passport');
const userRoutes = require('./routes/userRoutes.js');
const connectDB = require('./config/db.js');
const formData = require('express-form-data');
const morgan = require('morgan');
const cors = require('cors');
const consultantRoutes = require('./routes/consultantRoutes.js');
const AdminRoutes = require('./routes/Admin.route.js');
const missionRoutes = require('./routes/missionRoutes.js');

const app = express();
const socket = require('socket.io');
const notificationModel = require('./models/notificationModel.js');
const userModel = require('./models/userModel.js');
const PORT = process.env.PORT || 5001;


// Apply CORS middleware at the beginning
app.use(cors());

// Additional CORS headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
  res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to the database"))
  .catch(err => console.error("Error connecting to the database:", err));

// Initialize Passport
app.use(passport.initialize());
require('./security/passport')(passport);

// FormData middleware
app.use(formData.parse());

// Morgan middleware for development
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logger middleware
app.use(logger('dev'));

// Static files middleware
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/consultant', consultantRoutes);
app.use('/api/mission', missionRoutes);
app.use('/api/admin', AdminRoutes);

// Start the server
const server = app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (err) {
    console.error("Error starting the server:", err.message);
  }
});

// Socket.io setup
const io = socket(server, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "*",
    // credentials: true,
  },
});
io.on("connection", (socket) => {
  console.log(`a user connected ${socket}`);
  global.chatSocket = socket;

  socket.on("newMission", async (data) => {
    try {
        // Fetch users with roles RH or ADMIN
        console.log("newMission event data:", data)
        const users = await userModel.find({
            role: { $in: ['RH', 'ADMIN'] }
        });

        // Iterate over each user and create a notification
        users.forEach(async (user) => {
            const newNotification = new notificationModel({
                userId: user._id,
                action: "Une nouvelle mission",
                details: data.details,
                pathurl: data.pathurl,
                idToPath: data.idToPath, // Assuming this is related to the mission
                consultanName: data.consultanName,
                consultantEmail: data.consultantEmail,
            });

            await newNotification.save();

            // Emit a notification event to the frontend (if needed)
            // This requires mapping users to their socket IDs, which is not covered here
            // Example: io.to(userSocketId).emit("notification", newNotification);
        });

        console.log(`Notifications created for users with roles RH and ADMIN.`);
    } catch (error) {
        console.error("Error handling newMission event:", error);
    }
});
socket.on("NewCRA", async (data) => {
  try {
      // Fetch users with roles RH or ADMIN
      console.log("newCRA event data:", data)
      const users = await userModel.find({
          role: { $in: ['RH', 'ADMIN'] }
      });

      // Iterate over each user and create a notification
      users.forEach(async (user) => {
          const newNotification = new notificationModel({
              userId: user._id,
              action: "Une nouvelle CRA",
              details: data.details,
              pathurl: data.pathurl,
              idToPath: data.idToPath, // Assuming this is related to the mission
              consultanName: data.consultanName,
              consultantEmail: data.consultantEmail,
          });

          await newNotification.save();

          // Emit a notification event to the frontend (if needed)
          // This requires mapping users to their socket IDs, which is not covered here
          // Example: io.to(userSocketId).emit("notification", newNotification);
      });

      console.log(`Notifications created for users with roles RH and ADMIN.`);
  } catch (error) {
      console.error("Error handling newMission event:", error);
  }
});












  socket.on('error', (error) => {
    console.error('Socket error:', error);
});






});

// Additional socket.io configuration if needed

module.exports = app;
