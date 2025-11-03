import express from "express";
const router = express.Router();
import { index, createPost, editPost, updatePost, destroy } from "../controllers/crudController.js";
import { getDashboardData, getUsers } from "../controllers/userController.js";
import authMiddlewre from '../middlewares/auth.js';

router.get('/getData', authMiddlewre, index);
router.post('/add', authMiddlewre, createPost);
router.get('/edit/:id', authMiddlewre, editPost);
router.post('/update', authMiddlewre, updatePost);
router.delete('/destroy', authMiddlewre, destroy);

router.get('/getDashboardData', authMiddlewre, getDashboardData);
router.get('/get-users', authMiddlewre, getUsers);

export default router;