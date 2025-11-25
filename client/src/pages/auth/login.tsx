import LoadingSpinner from "@/components/LoadingSpinner";
import { signIn } from "@/lib/auth/auth-client";
import { loginSchema } from "@/lib/auth/auth-schema";
import { type ErrorContext } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Chrome, CircleAlert } from "lucide-react";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";

const LoginPage = () => {
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    }
  });

  const onSubmit = (formValues: z.infer<typeof loginSchema>) => {
    startTransition(async () => {
      await signIn.email(
        {
          email: formValues.email,
          password: formValues.password,
        },
        {
          onSuccess: () => navigate("/", { replace: true }),
          onError: (ctx: ErrorContext) => {
            switch (ctx.error.status) {
              case 400:
                form.reset();
                toast.error("Invalid credentials, please try again.");
                break;
              case 401:
                toast.error("Incorrect credentials", {
                  description: "Email or password is incorrect",
                });
                break;
              case 403:
                form.reset();
                toast.error("Email address is unverified", {
                  description: "Please verify your email address.",
                });
                break;
              case 404:
                form.reset();
                toast.error("User not found", {
                  description:
                    "A user with this email does not exist. Please sign up.",
                });
                break;
              case 429:
                toast.error("Too many requests. Please try again later.");
                break;
              default:
                console.log("Error: ", ctx.error.message);
                toast.error("Something went wrong. Please try again.");
            }
          },
        }
      );
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

        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center pb-6">Welcome back</h1>

        <button
          className="w-full h-12 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:cursor-pointer font-medium flex items-center justify-center gap-3 transition-colors"
          disabled={isPending}
        >
          <Chrome size={18} />
          <span>Continue with Google</span>
        </button>

        <div className="flex items-center gap-4 py-5">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form className="flex flex-col gap-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            {(["email", "password"] as const).map((field) =>
              <div>
                {field === "password" && <div className="pb-1 pr-1 flex justify-end">
                  <Link
                    to={"/forgot-password"}
                    className="text-gray-700 hover:text-purple-600 underline lg:no-underline lg:hover:underline text-sm"
                  >Forgot password?</Link>
                </div>}
                <input
                  type={field}
                  placeholder={ field === "email" ? "Enter email address" : "Enter password" }
                  className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
                  {...form.register(field)}
                />
                {form.formState.errors[field] && (
                  <p className="text-sm text-red-500 pt-1">
                    <CircleAlert size={14} className="inline pr-1"/>
                    {form.formState.errors[field].message}
                  </p>
                )}
              </div>
            )}

          <button
            type="submit"
            className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
            disabled={isPending}
          >
            {isPending ? <LoadingSpinner /> : "Log in"}
          </button>
        </form>

        <p className="text-xs text-gray-600 text-center pt-6">
          By continuing, you agree to Routana's{" "}
          <a href="#" className="text-gray-900 hover:text-purple-600 underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-gray-900 hover:text-purple-600 underline">
            Privacy Policy
          </a>
        </p>

        <p className="text-sm text-gray-600 text-center pt-6">
          Don&apos;t have an account?{" "}
          <Link to={"/signup"} className=" text-gray-900 hover:text-purple-600 underline lg:no-underline lg:hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
