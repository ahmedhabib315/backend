import { Methods } from "../constants/constants";
import { checkArrayLength } from "../helper/helper-function";
import { fetchUser } from "../middleware/middleware";
import { Expense } from "../models/Expense";
import express, { Response } from 'express';
const router = express.Router();

const base = process.env.BASE;

router.post('/', fetchUser, async (req: any, res: Response) => {
	const { value, method, description, attachment } = req.body;
	const userId = req.user.id;
	try {
		const filter = { userId: userId };
		const lastExpenseData = await Expense.find(filter).sort({ _id: -1 }).limit(1);

    const oldAmount = checkArrayLength(lastExpenseData) ? lastExpenseData[0].currentAmount : 0;

    const newExpenseData = await Expense.create({
      userId,
      difference: value,
      oldAmount: oldAmount,
      method: method,
      description: description,
      date: new Date(),
      isDeleted: false,
      attachment: attachment ? attachment : '',
      currentAmount: method == Methods.add ? oldAmount + value : oldAmount - value
    });
    
    res.json(newExpenseData);
		
	} catch (error: any) {
		console.error(error.message);
		res.status(500).send("Some Internal Error Occured");
	}
});



export = router;