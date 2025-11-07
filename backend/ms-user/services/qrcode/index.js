import express from "express";
import { json } from "body-parser";
import { toDataURL } from "qrcode";

const app = express();
app.use(json());

// Generate QR Code with user details
app.post("/generate-qr", async (req, res) => {
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

    // Send QR image as response
    res.json({
      message: "✅ QR Code generated successfully",
      qrCode: qrDataURL, // you can directly render this in <img src="...">
    });
  } catch (error) {
    console.error("QR generation error:", error);
    res.status(500).json({ error: "Failed to generate QR" });
  }
});

app.listen(4000, () => console.log("🚀 Server running on port 4000"));
