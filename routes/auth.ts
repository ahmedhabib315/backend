import { User } from "../models/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { body, query, validationResult } from "express-validator";
import express from "express";
import { fetchUser } from "../middleware/middleware";
const router = express.Router();
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET || '';

//Login a User Using POST "/auth/login", Does not require Auth
router.post(
  "/signin",
  [
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Please Enter a Password").exists(),
  ],
  async (req: any, res: any) => {
    //Set Errors if Wrong Values is Passed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      let success = false;
      //Check if a User already Exists
      let user = await User.findOne({ emailOrId: email });

      //If User Doesn't exists then throw error
      if (!user) {
        return res
          .status(400)
          .json({
            success: success,
            error: "Please Login with Correct Credentials",
          });
      }

      const name = user.name;

      //Check Password
      const passwordCompare = await bcrypt.compare(password, user.password);

      //If Password Doesn't Match then throw error
      if (!passwordCompare) {
        return res
          .status(400)
          .json({
            success: success,
            error: "Please Login with Correct Credentials",
          });
      }

      const payload = {
        user: {
          id: user.id,
        },
      };

      //Create an AuthToken
      const authToken = await jwt.sign(payload, JWT_SECRET);
      success = true;

      res.json({ success: success, user_token: authToken, authToken: authToken, name: name, email: email, user_id: 1 });
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Some Internal Error Occured");
    }
  }
);

//Create a User Using POST "/api/auth/create", Does not require Auth
router.post(
  "/signup",
  [
    body("name", "Name Should Contain more than 2 words").isLength({ min: 2 }),
    body("email", "Enter a Valid Email").isEmail(),
    body("password", "Enter a Valid Password").isLength({ min: 5 }),
  ],
  async (req: any, res: any) => {
    //Set Errors if Wrong Values is Passed
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      //Check if a User already Exists
      let user = await User.findOne({ emailOrId: req.body.email });

      //If Exists then throw error
      if (user) {
        return res
          .status(400)
          .json({ error: "User Already Exist with this Email" });
      }

      // Hashing Entered Password By User
      const salt = await bcrypt.genSalt(10);
      const secPassword = await bcrypt.hash(req.body.password, salt);

      user = await User.create({
        name: req.body.name,
        emailOrId: req.body.email,
        password: secPassword,
        createdAt: new Date(),
        lastUpdatedAt: new Date(),
      }).then((user) => res.json(user));

      const data = {
        user: {
          id: user?.id,
        },
      };

      //Create an AuthToken
      const authToken = await jwt.sign(data, JWT_SECRET);
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Some Internal Error Occured");
    }
  }
);

//Logout a User Using GET "/api/v1/logout", Does not require Auth
router.get(
  "/logout",
  async (req, res) => {
    try {
      res.status(200).send("Logged Out");
    } catch (err: any) {
      console.error(err.message);
      res.status(500).send("Some Internal Error Occured");
    }
  }
);

export = router;
