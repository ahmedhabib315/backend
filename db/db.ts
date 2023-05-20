import mongoose from "mongoose";
require("dotenv").config();
const mongooseUri: any = process.env.MONGOOSE_URI;

mongoose.set("strictQuery", true);

export const connectToMongo = () => {
	mongoose
		.connect(mongooseUri)
		.then(() => {
			console.log("Connected to Database");
		})
		.catch((err: any) => {
			console.log("Not Connected to Database ERROR! ", err);
		});
};
