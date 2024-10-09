import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const mongouri = process.env.MONGO_URI;

    //checking if the uri is undefined
    if (!mongouri) {
      throw new Error("MongoDB URI is not defined in environment variables.");
    }

    //connect to MongoDB
    const connection = await mongoose.connect(mongouri);

    connection.connection.on("connected", () => {
      console.log("Connected to MongoDb");
    });

    //checking the errors in the connection
    connection.connection.on("error", () =>
      console.log("Error connecting to MongoDB")
    );
    
  } catch (error) {
    console.log("Something went wrong");
    console.error(error);
  }
};

export default dbConnect;
