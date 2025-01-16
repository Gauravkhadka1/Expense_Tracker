import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schema: "./utils/schema.jsx",
  out: "./drizzle",
  dbCredentials: {
    url:'postgresql://personalfinance_owner:vnEXiJgl1Vt3@ep-wandering-bonus-a51u5c0w.us-east-2.aws.neon.tech/Expenses-Tracker?sslmode=require'
  }
});
