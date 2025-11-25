import LoadingSpinner from "@/components/LoadingSpinner";
import { resetPassword } from "@/lib/auth/auth-client";
import { resetPasswordSchema } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";

const ResetPasswordPage = () => {
  const [isPending, startTransition] = useTransition();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const error = searchParams.get("error");
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  if (error === "invalid_token" || !token) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="pb-2 text-2xl font-bold text-black">
          Invalid reset link
        </h1>
        <p className="text-gray-600">
          The password reset link is invalid or has expired
        </p>
      </div>
    );
  }

  const onSubmit = (formValues: z.infer<typeof resetPasswordSchema>) => {
    startTransition(async () => {
      const { error } = await resetPassword({
        newPassword: formValues.password,
        token,
      });
      if (error)
        toast.error("Couldn't reset password", {
          description: `${error.message}`,
        });
      else {
        navigate("/login", { replace: true });
        toast.success("Password reset successfull", {
          description:
            "Password has been successfully reset. Please login to continue.",
        });
      }
    });
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md px-6 py-12">
        <div className="flex justify-center pb-8">
          <svg
            width="40"
            height="40"
            viewBox="0 0 40 40"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="fill-purple-600"
          >
            <path
              d="M10 20C10 14.477 14.477 10 20 10C25.523 10 30 14.477 30 20C30 25.523 25.523 30 20 30C14.477 30 10 25.523 10 20Z"
            />
            <path d="M20 15L25 23H15L20 15Z" fill="neutral-950" />
          </svg>
        </div>

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center pb-8">Reset password</h1>

        <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          {(["password", "confirmPassword"] as const).map(
            (field) => <div>
              <input
                type="password"
                placeholder={field === "password" ? "Enter new password" : "Confirm new password"}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
                {...form.register(field)}
              />
              {form.formState.errors[field] && (
                <p className="text-sm text-red-500 pt-1">
                  <CircleAlert size={14} className="inline pr-1" />
                  {form.formState.errors[field].message}
                </p>
              )}
            </div>)}

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
          >
            {isPending ? <LoadingSpinner /> : "Reset password"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
