const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect('mongodb://root:root@mongo:27017/b3?authSource=admin', {
  useNewUrlParser: true
}, (error) => {
  if (error) {
    console.log(error);
  } else {
    console.log('DB connect');
  }
});

let classesRouter = require('./routes/classes');
let studentsRouter = require('./routes/students');

app
.get('/', (req, res) => {
  res.status(200).send('<h1>Hello World</h1>');
})
.use('/classes', classesRouter)
.use('/students', studentsRouter)
.listen(4500, () => {
  console.log(`Running on http://127.0.0.1:4500`);
});