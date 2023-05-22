import express from 'express';
import { Url } from '../models/Url';
const router = express.Router();

router.get('/:id',
	async (req, res) => {
		const id = req.params.id;
		if (!id) {
			res.status(401)
				.send('Cannot find the URL');
		}
		else {
			const urlData = await Url.findOneAndUpdate({ urlId: id }, { $inc: { visits: 1 }, lastUpdatedAt: new Date(), }, { new: false }).select("-userId");

			if (!urlData) {
				res.status(401)
					.send('Cannot find the URL');
			}
			else {
				res.redirect(urlData.origUrl);
			}
		}
	});

export = router;