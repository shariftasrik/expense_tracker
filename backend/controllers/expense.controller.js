import expenseModel from "../models/expense.model.js";
import getDateRange from "../utils/dateFilter.js";
import XLSX from "xlsx"

// add expense
export async function addExpense(req, res) {
  const userId = req.user._id;
  const { description, amount, category, date } = req.body;

  try {
    if (!description || !amount || !category || !date) {
      return res.status(400).json({
        success: false,
        message: "All fields are required!!",
      });
    }

    const newExpense = new expenseModel({
      userId,
      description,
      amount,
      category,
      date: new Date(date),
    });
    await newExpense.save();
    return res.json({
      success: true,
      message: "Expense added successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


// to get expense(all)
export async function getAllExpense(req, res) {
  const userId = req.user._id;

  try {
    const expense = await expenseModel.find({ userId }).sort({ date: -1 });

    return res.json({
      success: true,
      data: expense
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error!",
    });
  }
}

// update an expense
export async function updateExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;
  const { description, amount } = req.body;

  try {
    const updatedExpense = await expenseModel.findOneAndUpdate(
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

    if (!updatedExpense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    return res.json({
      success: true,
      message: "Expense update successfully",
      data: updatedExpense,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


// delete an Expense
export async function deleteExpense(req, res) {
  const { id } = req.params;
  const userId = req.user._id;

  try {
    const expense = await expenseModel.findByIdAndDelete({
      _id: req.params.id,
    });

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Invalid expense information!",
      });
    }
    return res.json({
      success: true,
      message: "Expense deleted successfully!",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
}


// to download the data in an excel sheet
export async function downloadExpenseExcel(req, res){
  const userId = req.user._id;
  try {
    const expense = await expenseModel.find({ userId}).sort({ date: -1});
    const plainData = expense.map((exp) => ({
      Description: exp.description,
      Amount: exp.amount,
      Category: exp.category,
      Date: new Date(exp.date).toLocaleDateString(),
    }))

    const worksheet = XLSX.utils.json_to_sheet(plainData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "expenseModel");

    XLSX.writeFile(workbook, "expense_details.xlsx");
    return res.download("expense_details.xlsx");

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    })
    
  }
}


// to get the expense overview
export async function getExpenseOverview(req, res){
  try {
    const userId = req.user._id;
    const { range = "monthly" } = req.query;
    const { start, end } = getDateRange(range);

    const expenses = await expenseModel.find({
      userId,
      date: { $gte: start, $lte: end },
    }).sort({ date: -1});

    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);
    const averageExpense =
      expenses.length > 0 ? totalExpense / expenses.length : 0;
    const numberOfTransactions = expenses.length;
    const recentTransactions = expenses.slice(0, 5);

    return res.json({
      success: true,
      data: {
        totalExpense,
        averageExpense,
        numberOfTransactions,
        recentTransactions,
        range
      }
    })

  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Server Error"
    })
    
  }
}