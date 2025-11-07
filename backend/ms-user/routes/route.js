import express from "express";
const router = express.Router();
import { index, createPost, editPost, updatePost, destroy } from "../controllers/crudController.js";
import { getDashboardData, getUsers } from "../controllers/userController.js";
import authMiddlewre from '../middlewares/auth.js';
import { toDataURL } from "qrcode";

router.get('/getData', authMiddlewre, index);
router.post('/add', authMiddlewre, createPost);
router.get('/edit/:id', authMiddlewre, editPost);
router.post('/update', authMiddlewre, updatePost);
router.delete('/destroy', authMiddlewre, destroy);

router.get('/getDashboardData', authMiddlewre, getDashboardData);
// router.get('/get-users', authMiddlewre, getUsers);

router.post("/generate-qr", async (req, res) => {
  try {
    const { name, email, userId } = req.body;

    if (!name || !email || !userId) {
      return res.status(400).json({ error: "name, email, and userId required" });
    }

    // Prepare data to encode into QR
    const userData = { name, email, userId };
    const stringData = JSON.stringify(userData);

    // Generate QR code (Base64 Data URL)
    const qrDataURL = await toDataURL(stringData, {
      errorCorrectionLevel: "H",
      width: 300,
    });
    

    // Send QR image as response✅ 
    res.json({
      message: "QR Code generated successfully",
      qrCode: qrDataURL,
    });
  } catch (error) {
    console.error("QR generation error:", error);
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

export default router;