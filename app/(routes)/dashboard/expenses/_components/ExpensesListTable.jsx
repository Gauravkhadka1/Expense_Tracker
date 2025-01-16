import { db } from "../../../../../utils/dbConfig";
import { Expenses } from "../../../../..//utils/schema";
import { Trash } from "lucide-react";
import React from "react";
import { eq } from "drizzle-orm";
import { toast } from "sonner";

function ExpensesListTable({ expensesList = [], refreshData }) {
  const deleteExpense = async (expense) => {
    try {
      const result = await db
        .delete(Expenses)
        .where(eq(Expenses.id, expense.id))
        .returning();

      if (result) {
        toast.success('Expenses Deleted!');
        refreshData();
      } else {
        toast.error('Failed to delete expense.');
      }
    } catch (error) {
      toast.error('An error occurred while deleting the expense.');
      console.error(error);
    }
  };

  return (
    <div className="mt-3">
      <h2 className="font-bold text-lg">Latest Expenses</h2>
      <div className="grid grid-cols-4 bg-slate-200 p-2 mt-3">
        <h2 className="font-bold">Name</h2>
        <h2 className="font-bold">Amount</h2>
        <h2 className="font-bold">Date</h2>
        <h2 className="font-bold">Action</h2>
      </div>
      {expensesList.length > 0 ? (
        expensesList.map((expenses, index) => (
          <div
            key={index}
            className="grid grid-cols-4 bg-slate-50 p-2"
          >
            <h2>{expenses.name}</h2>
            <h2>{expenses.amount}</h2>
            <h2>{expenses.createdAt}</h2>
            <h2>
              <Trash
                className="text-red-600 cursor-pointer"
                onClick={() => deleteExpense(expenses)}
              />
            </h2>
          </div>
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">No expenses to show</div>
      )}
    </div>
  );
}

export default ExpensesListTable;
