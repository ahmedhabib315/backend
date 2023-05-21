import { API_URL_PREFIX } from "../constants/constants";
import { checkUrl, fetchUser } from "../middleware/middleware";
import { Url } from "../models/Url";
import express, { Request, Response } from 'express';
import { nanoid } from 'nanoid'
const router = express.Router();

const base = process.env.BASE;

router.post('/', fetchUser, checkUrl, async (req: any, res: Response) => {
	const { url } = req.body;
	const userId = req.user.id;
	const urlId = nanoid();
	try {
		const filter = { origUrl: url };
		const urlData = await Url.findOne(filter).select("-userId");
		if (!urlData) {
			const shortUrl = `${API_URL_PREFIX}/${urlId}`;
			const newUrlData: any = await Url.create({
				urlId,
				origUrl: url,
				userId: [userId],
				shortUrl,
				createdAt: new Date(),
				lastUpdatedAt: new Date(),
				timesCreated: 1
			});

			return res
				.json({...newUrlData._doc, shortUrl: base + newUrlData.shortUrl});
		}
		else {
			const updatedUrlData: any = await Url.findOneAndUpdate(filter, { $inc: { timesCreated: 1 }, lastUpdatedAt: new Date(), $addToSet: { userId: userId } }, { new: true });
			if(updatedUrlData){
				return res
				.json({...updatedUrlData._doc, shortUrl: base + updatedUrlData.shortUrl});
			}
		}
	} catch (error: any) {
		console.error(error.message);
		res.status(500).send("Some Internal Error Occured");
	}
});

router.get('/', fetchUser, async (req: any, res: Response) => {
	const userId = req.user.id;
	const urls: any = [];
	try {
		const userUrlData = await Url.find({ userId: userId }).select("-userId");
		userUrlData.forEach(function getUrls(data) {
			urls.push({
				origUrl: data.origUrl,
				shortUrl: base + data.shortUrl
			});
		});

		res.json(urls);
	} catch (error: any) {
		console.error(error.message);
		res.status(500).send("Some Internal Error Occured");
	}
});


export = router;