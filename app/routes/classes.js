const express = require('express');
const { v4: uuidv4 } = require('uuid');

let router = express.Router();
let classes = [];

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  console.log('Time: ', Date.now());
  next();

})
.post('/', (req, res) => {
  const {name} = req.body;

  let classe = {
    id: uuidv4(),
    name: name
    //ou --> name
  };

  classes.push(classe);

  res.status(200).json(classe);
})
.get('/', (req, res) => {
  res.status(200).json(classes);
})
.get('/:id', (req, res) => {
  const {id} = req.params;

  let classe = classes.find(el => el.id === id);

  res.status(200).json(classe.name);
})
.delete('/:id', (req, res) => {
  const {id} = req.params;

  classes = classes.filter(el => el.id !== id);

  res.status(200).json(classes);
})
.put('/:id', (req, res) => {
  const {id} = req.params;
  const {name} = req.body;

  let classe = classes.find(el => el.id === id);
  classe.name = name;

  res.status(200).json(classes);
})

module.exports = router;