const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
require('./src/db/mongoose');
const createError = require('http-errors');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const cors = require('cors');

const userRouter = require('./src/routers/user');

const app = express();
const server = createServer(app);

app.use(cors());
app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(userRouter);

const io = new Server(server, {
  cors: {
    origin: 'http://localhost:8080',
    methods: ['GET', 'POST'],
  },
});

app.use((req, res, next) => {
  next(createError(404));
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on('join_room', (data) => {
    console.log(data);
  });

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data);
  });
});

server.listen(3000, () => {
  console.log('server is running on port 3000');
});
