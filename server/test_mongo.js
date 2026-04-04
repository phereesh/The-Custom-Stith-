import mongoose from 'mongoose';

async function test() {
  try {
    await mongoose.connect('mongodb+srv://phereeshkhyaju_db_user:0tCpcyqIe4byaBWk@cluster0.ucsibfi.mongodb.net/test', {
      serverSelectionTimeoutMS: 5000
    });
    console.log("Connected successfully!");
    process.exit(0);
  } catch (err) {
    console.error("Connection error:", err.message);
    process.exit(1);
  }
}
test();
