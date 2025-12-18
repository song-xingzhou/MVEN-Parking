const express = require('express');

const {
  createData,
  readData,
  updateData,
  deleteData,
  checkDbConnection,
} = require('../controllers/user_controller');

const router = express.Router();

router
  .get('/test-db', checkDbConnection)
  .post('/', createData)
  .get('/', readData)
  .put('/:id', updateData)
  .delete('/:id', deleteData);

module.exports = router;
