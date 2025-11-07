import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../db.js';
import Users from '../models/users.js';

export const getDashboardData = (req, res) => {
    let data = [];
    // db.query("SELECT count(*) as total_user FROM users WHERE status = 1", (err, result) => {
    //     if(err){
    //         return res.status(400).json({err: err});
    //     }

    //     const totalUsers = result[0].total_user;
    //     data.push({ label: 'users', value: totalUsers });
    //     return res.json({ data });
    // });

    Users.getAllUser((err, result) => {
        if(err) res.status(500).json({error: err});
        const totalUsers = result[0].total_user;
        data.push({ label: 'users', value: totalUsers });
        return res.json({ data });
    });
} ;

export const getUsers = async (req, res) => {
    try{
        const users = await Users.findAll({
            attributes: ["id", "name", "email", "role", "created_at"]
        });
        return res.status(200).json({users});
    }catch(err){
        return res.status(500).json({message: err.message});
    }
}