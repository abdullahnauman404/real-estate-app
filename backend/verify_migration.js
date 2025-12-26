import dotenv from "dotenv";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

async function testConnection() {
    console.log("Testing MongoDB Connection...");
    try {
        const uri = process.env.MONGODB_URI;
        if (!uri) throw new Error("MONGODB_URI is undefined");
        await mongoose.connect(uri);
        console.log("✅ MongoDB Connection Successful!");
        await mongoose.disconnect();
    } catch (error) {
        console.error("❌ MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

async function testCloudinary() {
    console.log("Testing Cloudinary Credentials...");
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const result = await cloudinary.api.ping();
        console.log("✅ Cloudinary Ping Successful! Status:", result.status);
    } catch (error) {
        console.error("❌ Cloudinary Connection Failed:", error.message);
        process.exit(1);
    }
}

async function run() {
    await testConnection();
    await testCloudinary();
    console.log("All verifications passed.");
}

run();
