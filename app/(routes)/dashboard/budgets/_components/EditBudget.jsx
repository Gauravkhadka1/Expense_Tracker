"use client";

import React, { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { PenBox, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import { db } from "../../../../../utils/dbConfig";
import { Budgets } from "../../../../../utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "react-hot-toast";
import { Button } from "../../../../../components/ui/button";
import { eq } from "drizzle-orm";

// Utility function for class concatenation
const cn = (...classes) => classes.filter(Boolean).join(" ");

// Dialog components
const Dialog = DialogPrimitive.Root;
const DialogTrigger = DialogPrimitive.Trigger;
const DialogPortal = DialogPrimitive.Portal;
const DialogOverlay = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    ref={ref}
    className={cn(
      "fixed inset-0 z-50 bg-black/80 data-[state=open]:animate-in data-[state=closed]:animate-out",
      className
    )}
    {...props}
  />
));
DialogOverlay.displayName = DialogPrimitive.Overlay.displayName;

const DialogContent = React.forwardRef(
  ({ className, children, ...props }, ref) => (
    <DialogPortal>
      <DialogOverlay />
      <DialogPrimitive.Content
        ref={ref}
        className={cn(
          "fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg sm:rounded-lg",
          className
        )}
        {...props}
      >
        {children}
        <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPortal>
  )
);
DialogContent.displayName = DialogPrimitive.Content.displayName;

const DialogHeader = ({ className, ...props }) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogTitle = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
DialogTitle.displayName = DialogPrimitive.Title.displayName;

const DialogDescription = React.forwardRef(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
DialogDescription.displayName = DialogPrimitive.Description.displayName;

// EditBudget Component
function EditBudget({ budgetInfo, refreshData }) {
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [emojiIcon, setEmojiIcon] = useState("😀");
  const [name, setName] = useState(budgetInfo?.name);
  const [amount, setAmount] = useState(budgetInfo?.amount);
  const { user } = useUser();

  useEffect(() => {
    if (budgetInfo) {
      setEmojiIcon(budgetInfo?.icon);
      setAmount(budgetInfo?.amount);
      setName(budgetInfo?.name);
    }
  }, [budgetInfo]);

  const toggleEmojiPicker = () => {
    setOpenEmojiPicker((prev) => !prev);
  };

  const handleEmojiClick = (event, emojiObject) => {
    if (emojiObject) {
      setEmojiIcon(emojiObject.emoji); // Update emoji icon if one is selected
    } else {
      setEmojiIcon("😀"); // Fallback to default if no emoji is selected
    }
    setOpenEmojiPicker(false); // Close the emoji picker after selection
  };

  const onUpdateBudget = async () => {
    const finalEmojiIcon = emojiIcon === "" ? "😀" : emojiIcon; // Ensure emojiIcon is set properly

    try {
      const result = await db
        .update(Budgets)
        .set({
          name: name,
          amount: amount,
          icon: finalEmojiIcon, // Use final emoji icon
        })
        .where(eq(Budgets.id, budgetInfo.id))
        .returning();

      if (result) {
        toast.success("Budget updated successfully!");
        refreshData(); // Refresh data after update
      } else {
        toast.error("Unexpected error: Budget update failed.");
      }
    } catch (error) {
      console.error("Error updating budget:", error);
      toast.error("Failed to update budget. Please try again.");
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <div className="">
            <Button className="flex gap-2">
              <PenBox /> Edit
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Budget</DialogTitle>
            <DialogDescription>
              <button
                className="mt-4 p-2 bg-gray-200 rounded"
                onClick={toggleEmojiPicker}
              >
                {emojiIcon} Emoji Icon
              </button>
              {openEmojiPicker && (
                <div className="mt-2 border rounded p-2">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Name</h2>
                <input
                  placeholder="e.g. Home Decor"
                  onChange={(e) => setName(e.target.value)}
                  value={name || ""}
                  className="border p-2 w-full rounded"
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Budget Amount</h2>
                <input
                  type="number"
                  placeholder="e.g. 5000"
                  onChange={(e) => setAmount(e.target.value)}
                  value={amount || ""}
                  className="border p-2 w-full rounded"
                />
              </div>
              <button
                disabled={!(name && amount)}
                onClick={onUpdateBudget}
                className="bg-blue-500 text-white p-2 mt-5 w-full disabled:opacity-50"
              >
                Update Budget
              </button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default EditBudget;
