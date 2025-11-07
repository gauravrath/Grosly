import sequelize from "../db.js";
import { DataTypes } from "sequelize";

const User = sequelize.define("User", 
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // unique: true
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        role: {
            type: DataTypes.STRING,
            defaultValue: "user"
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: true
        }
    },
    {
        tableName: "users",
    });

export default User; 

// const db = require('../db');

// const Users = {
//     getAllUser : (callback) => {
//         const query = "SELECT count(*) as total_user FROM users WHERE status = 1";
//         db.query(query, (err, result) => {
//             callback(err, result);
//         });
//     }
// }

// module.exports = Users;