import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sequelize, { connectDB } from "../db.js";
import multer from "multer";
import path from "path";
import express from 'express';
const app = express();
import log from "console";

app.use('/uploads', express.static('C:/xampp/htdocs/node-auth/api/uploads'));

export const index = async (req, res) => {
    const { title } = req.query;

    let query = "SELECT * FROM posts";
    let params = [];

    if (title) {
        query += " WHERE title = ?";
        params.push(title);
    }

    db.query(query, params, (err, result) => {
        if (err) {
            return res.status(500).json({ msg: "Database error", error: err });
        }

        if (result.length === 0) {
            return res.status(404).json({ msg: title ? "Title not found!" : "No data available." });
        }

        const baseUrl = `${req.protocol}://${req.get('host')}/`;
        const finalresult = result.map(item => ({
                    ...item,
                    imageUrl: baseUrl+item.image
                }));
        // console.log('resultresult', finalresult);
        
        
        return res.status(200).json({  data: finalresult });
    });
};

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Make sure this folder exists
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + '-' + file.originalname);
    }
});

const upload = multer({ storage: storage });

export const createPost = [
    upload.single('file'), // <-- "file" is the field name in Postman
    (req, res) => {
        const { title, description, created_by, created_date } = req.body;
        const file = req.file; // Uploaded file info

        if (!title || !description || !created_by || !created_date || !file) {
            return res.status(400).json({ msg: 'All fields are required including file.' });
        }

        let query = "INSERT INTO posts (title, description, created_by, created_date, image) VALUES (?, ?, ?, ?, ?)";
        
        let params = [title, description, created_by, created_date, file.path];

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(400).json({ msg: 'Data not inserted', err: err });
            }
            return res.status(200).json({
                msg: 'Data added successfully.',
                file: file.filename
            });
        });
    }
];



export const editPost = async (req, res) => {
    const { id } = req.params;

    if(!id){
        return res.status(400).json({msg: 'Please select any record.'});
    }

    let query = "SELECT * FROM posts WHERE id = ?";
    let params = [id];

    db.query(query, params, (err, result) => {
        if(err){
            return res.status(500).json({msg: err});
        }

        if(result.length === 0){
            return res.status(404).json({msg: 'Data not found.'});
        }

        return res.status(200).json({msg: 'Data fetched successfully.', data: result});
    });
}

export const updatePost = async (req, res) => {
    const {title, description, created_date, created_by, id} = req.body;

    if(!id){
        return res.status(404).json({msg: 'Post id is required.'});
    }

    if(!title || !description || !created_date || !created_by){
        return res.status(404).json({msg: 'All fields are required.'});
    }

    db.query("SELECT * FROM posts WHERE id = ?", [id], async (err, result) => {
        if(err){
            return res.status(500).json({msg: err});
        }

        if(result.length === 0){
            return res.status(404).json({msg: 'Data not found'});
        }

        db.query("UPDATE posts SET title = ?, description = ?, created_date = ?, created_by = ? WHERE id = ?", [title, description, created_date, created_by, id], (err, result) => {
            if(err){
                return res.status(500).json({msg: err});
            }

            if(result.length === 0){
                return res.status(404).json({msg: 'Data not found'});
            }

            return res.status(200).json({msg: 'Data updated successfully.'});
        });
    });
}   

export const destroy = async (req, res) => {
    const { id } = req.body;

    if(!id){
        return res.status(500).json({msg: 'Data not found.'});
    }

    db.query("SELECT * FROM posts WHERE id = ?", [id], (err, result) => {
        if(err){
            return res.status(404).json({msg: err});
        }

        if(result.length === 0){
            return res.status(404).json({msg: 'Post not found.'});
        }

        db.query("DELETE FROM posts WHERE id = ?", [id], (err, result) => {
            return res.status(400).json({msg: 'Post deleted successfully.'});
        });
    });
}