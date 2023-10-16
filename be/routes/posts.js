const express = require('express')
const PostModel = require('../models/post')
const commentModel = require('../models/comment')
const posts = express.Router()

const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')

require('dotenv').config
const crypto = require('crypto')

// GET ALL
posts.get('/posts', async (req, res)=> {
    const { page= 1, pageSize = 3 } = req.query
    try {
        const posts = await PostModel.find()
            .populate('author')
            .populate('comments')
            .limit(pageSize)
            .skip((page -1) * pageSize)
        
        const totalPosts = await  PostModel.countDocuments()

        console.log('Query eseguita con successo');
        res.status(200)
            .send({
                statusCode: 200,
                currentPage: Number(page),
                totalPages: Math.ceil(totalPosts / pageSize),
                totalPosts,
                posts
            })
    } catch (error) {
        console.error('Errore nella rotta /posts:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// GET ONLY BY ID
posts.get('/posts/:postId', async (req, res)=> {
    const { postId } = req.params
    const postExist = await PostModel.findById(postId)

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }
    try {
        const posts = await PostModel.findById(postId)

        res.status(200).send({
            statusCode: 200,
            message: "Post finded successfully",
            posts
        })

    } catch (error) {
        console.error('Errore nella rotta /posts:', error);
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// POST
posts.post('/posts/create', async (req, res) => {

    const newPost = new PostModel({
        title: req.body.title,
        category: req.body.category,
        cover: req.body.cover,
        content: req.body.content,
        readTime: {
            value: req.body.readTime.value,
            unit: req.body.readTime.unit,
        },
        author: req.body.author 
    })

    try {
        const post = await newPost.save()

        res.status(201).send({
            statusCode: 201,
            message: "Post saved successfully",
            payload: post
        })
    } catch (e) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// PATCH
posts.patch('/posts/update/:postId', async (req, res) => {
    const { postId } = req.params
    const postExist = await PostModel.findById(postId)

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }    

    try {
        const dataToUpdate = req.body
        const options = {new: true}
        const result = await PostModel.findByIdAndUpdate(postId, dataToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Post edited successfully",
            result
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// DELETE
posts.delete('/posts/delete/:postId', async (req, res) => {
    const { postId } = req.params
       
    try {
        const post = await PostModel.findByIdAndDelete(postId)
        if (!post) {
            return res.status(404).send({
                statusCode: 404,
                message: "Post not found or already deleted!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Post deleted successfully",
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})


// COMMENTS
posts.get('/posts/:postId/comments', async (req, res) =>{
    const { postId } = req.params
    const postExist = await PostModel.findById(postId)

    if(!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    try {
        const result = await commentModel.find()
        res.status(200).send({
            statusCode: 200,
            message:"Comments loaded successfully",
            result
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// GET SPECIFIC COMMENT
posts.get('/posts/:postId/comments/:commentId', async (req, res) =>{
    const { postId, commentId } = req.params
    const postExist = await PostModel.findById(postId)

    if(!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        })
    }

    try {

        const commentExist= await commentModel.findById(commentId)
        if(!commentExist) {
            return res.status(404).send({
                statusCode: 404,
                message: "This comment does not exist!"
            })
        }

        res.status(200).send({
            statusCode: 200,
            message:"Comments loaded successfully",
            commentExist
        })
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        })
    }
})

// POST A COMMENT
posts.post('/posts/:postId/comments/create', async (req, res) => {
    const { postId } = req.params;
    const postExist = await PostModel.findById(postId);

    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        });
    }

    const newComment = new commentModel({
        comment: req.body.comment,
        rate: req.body.rate,
        author: req.body.author,
        refPost: postId
    });

    try {
        const comment = await newComment.save();

        postExist.comments.push(comment);
        await postExist.save();

        res.status(201).send({
            statusCode: 201,
            message: "Comment saved successfully",
            payload: comment
        });
    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        });
    }
});

// PATCH A COMMENT
posts.patch('/posts/:postId/comments/update/:commentId', async(req, res) => {
    const { postId, commentId } = req.params
    const postExist = PostModel.findById(postId)
    
    if (!postExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "This post does not exist!"
        });
    }

    try {
        const commentToUpdate = req.body
        const options = {new: true}
        const result = await commentModel.findByIdAndUpdate(commentId, commentToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "Comment updated successfully",
            result
        })

    } catch (error) {
        res.status(500).send({
            statusCode: 500,
            message: "Errore interno del server"
        }); 
    }
})

// MANCA LA DELETE

module.exports = posts