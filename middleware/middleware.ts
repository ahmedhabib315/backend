import { NextFunction, Request, Response } from 'express';
import { URL_REGEX } from '../constants/constants';
import jwt from "jsonwebtoken";
require('dotenv').config();
const JWT_SECRET = process.env.JWT_SECRET || '';


export const checkUrl = (req: Request, res: Response, next: NextFunction) => {
	const {url} = req.body;
	if (!url) {
		return res
			.status(401)
			.json({ error: "Please Enter a Valid Url" });
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


export const fetchUser = async (req: any, res: Response, next: NextFunction) => {
  //Get Token From the Header
  const token = req.body.authToken || req.headers.authtoken;

  //If Token is not available then throw error
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please Authenticate Using Valid Token" });
  }

  try {
    //Verify If Token is ours and send it in request to verify
    const data: any = await jwt.verify(token, JWT_SECRET);

    req.user = data.user;
    next();
  } catch {
    return res
      .status(401)
      .json({ error: "Please Authenticate Using Valid TOken" });
  }
};