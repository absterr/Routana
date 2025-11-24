import { requestPasswordReset } from "@/lib/auth/auth-client";
import { emailSchema } from "@/lib/auth/auth-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import LoadingSpinner from "./LoadingSpinner";

const ForgotPasswordPage = () => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: ""
    }
  });

  const onSubmit = ({ email }: z.infer<typeof emailSchema>) => {
    startTransition(async () => {
      const { error } = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      });
      if (error) toast.error(`Couldn't send reset link, ${error.message}`);
      else {
        toast.success("Reset link sent.", {
          description: "Password reset link sent. Please check your email.",
        });
        form.reset();
      }
    });
  }

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

        <header className="text-center pb-6">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center pb-2">Forgot your password?</h1>
          <p className="text-gray-500 text-sm">Enter your account email, and we’ll send you instructions to reset your password.</p>
        </header>

        <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <div>
            <input
              type="email"
              placeholder="Enter email address"
              className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
              {...form.register("email")}
            />
            {form.formState.errors["email"] && (
              <p className="text-sm text-red-500 pt-1">
                <CircleAlert size={14} className="inline pr-1" />
                {form.formState.errors["email"].message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
          >
            {isPending ? <LoadingSpinner /> : "Send reset email"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default ForgotPasswordPage;
