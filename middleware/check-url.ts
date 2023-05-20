import { NextFunction, Request, Response } from 'express';
import { URL_REGEX } from '../constants/constants';


export const checkUrl = (req: Request, res: Response, next: NextFunction) => {
	const {url, description} = req.body;
	if (!url || !description) {
		return res
			.status(401)
			.json({ error: "Please Enter a Valid Data" });
	}
	else {
		const regex = new RegExp(URL_REGEX);
		if (regex.test(url)) {
			next();
		} else {
			return res
				.status(401)
				.json({ error: "Please Enter a Valid Url" });
		}
	}
}