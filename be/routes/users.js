const express = require('express')
const UserModel = require('../models/user')
const user = express.Router()
const bcrypt = require('bcrypt')

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
user.get('/users/:userId', async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const user = await UserModel.findById(userId);
        console.log(user)
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "User not found"
            });
        }

        res.status(200).send({
            statusCode: 200,
            payload: user
        });
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Internal server error"
        });
    }
});

// CREATE USER
user.post('/users/create', async (req, res) => {

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)

    const newUser = new UserModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword,
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