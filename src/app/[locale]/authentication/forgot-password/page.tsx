import { ForgetPasswordForm } from "@/components/auth/forget-password-form";

export default function Page() {
  return (
    <div className="container ">
      <div className="p-6 md:p-20 flex justify-center">
        <div className="max-w-sm w-full">
          <ForgetPasswordForm />
        </div>
      </div>
    </div>
  );
}
