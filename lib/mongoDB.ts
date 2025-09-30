import mongoose from "mongoose";

let isConnected: boolean = false;

export const connectToDB = async (): Promise<void> => {
	mongoose.set("strictQuery", true); // Add this line to suppress the warning

	if (isConnected) {
		console.log("Already connected to MongoDB");
		return;
	}
	try {
		await mongoose.connect(process.env.MONGODB_URI || "", {
			dbName: "styora_admin",
		});

		isConnected = true;
		console.log("Connected to MongoDB");
	} catch (error) {
		console.log("Error connecting to MongoDB:", error);
	}
};
