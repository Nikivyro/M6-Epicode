const express = require('express')
const UserModel = require('../models/user')
const user = express.Router()

// GET USERS
user.get('/users', async (req, res) => {
    try {
        const users = await UserModel.find()

        res.status(200).send({
            statusCode: 200,
            users
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

// GET USER ID - DA FARE

// CREATE USER
user.post('/users/create', async (req, res) => {

    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
    })

    try {
        const user = await newUser.save()
        res.status(200).send({
            statusCode: 200,
            message: 'utente salvato con successo',
            user
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        })
    }
})

// PATCH USER ID - DA FARE

// DELETE USER ID - DA FARE

module.exports = user