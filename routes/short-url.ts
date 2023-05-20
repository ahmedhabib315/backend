import { checkUrl } from "../middleware/check-url";
import { Url } from "../models/Url";
import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid'
const router = express.Router();

const base = process.env.BASE;


router.post('/', checkUrl, async (req: Request, res: Response) => {
	const { url, description } = req.body;
	const urlId = nanoid();
	try {
		const filter = { origUrl: url };
		const urlData = await Url.findOne(filter).select("-userId");
		if (!urlData) {
			const shortUrl = `${base}/${urlId}`;
			const newUrlData = await Url.create({
				urlId,
				origUrl: url,
				description: description,
				shortUrl,
				createdAt: new Date(),
				lastUpdatedAt: new Date(),
				timesCreated: 1
			});

			return res
				.json(newUrlData);
		}
		else {
			const updatedUrlData = await Url.findOneAndUpdate(filter, { $inc: { timesCreated: 1 }, lastUpdatedAt: new Date(), }, { new: true });
			return res
				.json(updatedUrlData);
		}
	} catch (error: any) {
		console.error(error.message);
		res.status(500).send("Some Internal Error Occured");
	}
});


export = router;