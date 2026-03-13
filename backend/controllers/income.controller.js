import incomeModel from "../models/income.model";

// add income
export async function addIncome(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!!",
      });
    }

    const newIncome = new incomeModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });
    await newIncome.save();
    res.json({
      success: true,
      message: "Income added successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: false,
      message: "Server Error",
    });
  }
}

// to get income(all)
export async function getAllIncome(req, res) {
  const userId = req.user._id;

  try {
    const income = (await incomeModel.find({ userId })).toSorted({ date: -1 });
    res.json(income);
  } catch (error) {
    console.log(error);
    res.json({
      success: true,
      message: "Server Error!",
    });
  }
}

// update an income
export async function updateIncome(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedIncome = await incomeModel.findOneAndUpdate(
      {
        _id: id,
        userId,
      },
      {
        description,
        amount,
      },
      {
        new: true,
      },
    );

    if (!updatedIncome) {
      return res.status(404).json({
        success: false,
        message: "Income not found",
      });
    }

    res.json({
      success: true,
      message: "Income update successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    })
    
  }
}
