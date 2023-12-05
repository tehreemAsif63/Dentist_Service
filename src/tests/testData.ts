const  mongoURI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/Dentists";

import mongoose from "mongoose";
import  Dentist from"../schemas/dentists";


async function insertData() {
    const connection = await mongoose.connect(mongoURI);
    console.log(`Connected to MongoDB with URI: ${mongoURI}`);

    try {
    await mongoose.connection.dropDatabase();
    console.log("DB dropped");
    
   

    const dentist = await new Dentist({ 
        name: "Dentist1",
        email: "dentist@dentist.com",
        password: "",
        slot: []
     }).save();
    console.log("Inserted a test dentist");
    const dentistId = dentist._id;

   

   
} finally {
    await mongoose.disconnect();
}
}

(async function () {
    try {
        await insertData();
    } catch (err) {
        console.error(`Failed to connect to MongoDB with URI: ${mongoURI}`);
        console.error(err);
        process.exit(1);
    }
});