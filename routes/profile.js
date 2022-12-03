const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const saltRounds = 10;
const { isLoggedIn } = require('../helpers/util')

module.exports = (db) => {

    return router;
}