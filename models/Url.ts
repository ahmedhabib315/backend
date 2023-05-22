import mongoose from "mongoose";
const { Schema } = mongoose;

const urlSchema = new Schema({
	urlId: {
		type: String,
		required: true,
	},
	userId: [{
		type: Schema.Types.ObjectId,
		ref: 'User'
	}],
	origUrl: {
		type: String,
		required: true
	},
	shortUrl: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date
	},
	lastUpdatedAt: {
		type: Date,
		default: Date.now,
	},
	timesCreated: {
		type: Number,
		required: true,
		default: 0,
	},
	visits: {
		type: Number,
		required: true,
		default: 0,
	}
});

export const Url = mongoose.model("url", urlSchema);