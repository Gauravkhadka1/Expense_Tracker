import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <SignUp redirect_url="/dashboard" />
  );
}
