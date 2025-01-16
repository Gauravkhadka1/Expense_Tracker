import { db } from "../../../../../utils/dbConfig";
import { Button } from "../../../../../components/ui/button";
import React, { useState } from "react";
import { Budgets, Expenses } from "../../../../..//utils/schema";
import { toast } from "sonner";
import moment from "moment/moment";
import { Loader } from "lucide-react";

function AddExpense({budgetId,user,refreshData}) {
const [name,setName]=useState();
const[amount,setAmount]=useState();
const [loading,setLoading]=useState(false);
const addNewExpense=async()=>{
  setLoading(true)
    const result=await db.insert(Expenses).values({
        name:name,
        amount:amount,
        budgetId:budgetId,
        createdAt:moment().format('DD/MM/yyy')
    }).returning({insertedId:Budgets.id});
    console.log(result);

setAmount('');
setName('');

    if(result)
    {
      setLoading(false)
        refreshData()
        toast('New Expenses Added!')
    }
    setLoading(false);
}

  return (
    <div className="border p-5 rounded-lg">
      <h2 className="font-bold text-lg">Add Expense</h2>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Name</h2>
        <input
          placeholder="e.g. Bedroom Decor"
          onChange={(e) => setName(e.target.value)}
          value={name}
          className="border p-2 w-full rounded"
        />
      </div>
      <div className="mt-2">
        <h2 className="text-black font-medium my-1">Expense Amount</h2>
        <input
          type="number"
          placeholder="e.g. 1000"
          onChange={(e) => setAmount(e.target.value)}
          value={amount}
          className="border p-2 w-full rounded"
        />
      </div>
      <Button disabled={!(name&&amount)||loading} 
      onClick={()=>addNewExpense()}
      
      className="mt-3 w-full" >
        {loading?
      <Loader className="animate-spin"/>:" Add New Expenses"  
      }
       </Button>
    </div>
  );
}

export default AddExpense;
