var express = require('express');
var path = require('path');
require('colors');
var logger = require('morgan');
require('dotenv').config()
const mongoose = require('mongoose')
const passport = require('passport');
const userRoutes = require('./routes/userRoutes.js');
const connectDB = require('./config/db.js');
const formData = require('express-form-data');
const morgan = require('morgan');
var app = express();
const socket = require('socket.io');
const PORT = process.env.PORT || 5001;
let server = app.listen(PORT, async (req, res) => {
  try {
    await connectDB();
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Listening on ${PORT}`);
});
const io = socket(server, {
  pingTimeout: 6000,
  cors: {
    "Access-Control-Allow-Origin": "*",
    origin: "*",
    // credentials: true,
  },
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
  });
  app.use(passport.initialize())
  require('./security/passport')(passport)
  // connectDB();
  app.use(formData.parse());

  if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
  }

app.use(express.json());
app.use(express.urlencoded({extended: false}));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// connect to db =
mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("connected to db"))
.catch(err=>console.log(err))
// app.use('/api', indexRouter);
app.use('/api/users', userRoutes);
// app.use('/api/basicInfo', BasicInfoRoutes);
// app.use('/api/profile', profileRoutes);


module.exports = app;