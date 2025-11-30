import GoogleIcon from "@/components/GoogleIcon";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Button } from "@/components/ui/button";
import { signIn, signUp } from "@/lib/auth/auth-client";
import { signupSchema } from "@/lib/auth/auth-schema";
import type { Provider } from "@/lib/provider";
import { type ErrorContext } from "@better-fetch/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleAlert } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import type z from "zod";

const SignupPage = () => {
  const [isPending, startTransition] = useTransition();
  const [isFormPending, setFormPending] = useState(false);
  const navigate = useNavigate();
  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    }
  });

  const handleSocialSignIn = (provider: Provider) => () => {
    startTransition(async () => {
      await signIn.social(
        {
          provider: provider,
        },
        {
          onSuccess: () => {
            navigate("/", { replace: true  });
          },
          onError: () => {
            toast.error("Couldn't sign in", {
              description: `Could not sign in with ${provider}. Please try again`,
            });
          },
        }
      );
    });
  };

  const onSubmit = (formValues: z.infer<typeof signupSchema>) => {
    setFormPending(true);
    startTransition(async () => {
      await signUp.email(
        {
          name: formValues.name,
          email: formValues.email,
          password: formValues.password,
        },
        {
          onSuccess: () => {
            form.reset();
            toast.success("Verification email sent", {
              description:
                "A verification email has been sent. Please check your email",
            });
          },
          onError: (ctx: ErrorContext) => {
            setFormPending(false);
            switch (ctx.error.status) {
              case 422:
                form.reset();
                toast.error("Email already exists", {
                  description:
                    "Email already exists. Please try again with a different email or log in.",
                });
                break;
              case 400:
                form.reset();
                toast.error("Invalid credentials. Please try again");
                break;
              case 429:
                toast.error("Too many requests. Please try again later.");
                break;
              default:
                console.log("Error: ", ctx.error.message);
                toast.error("Could not sign up. Please try again");
            }
          },
        }
      );
    });
  }

  return (
    <section className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md px-6 py-12">
        {/* Logo */}
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
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 text-center pb-2">Create your account</h1>
          <p className="text-gray-500 text-sm">Get personalized roadmaps, progress tracking, and curated resources.</p>
        </header>

        <Button
          disabled={isPending}
          className="w-full h-12 rounded-xl border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:cursor-pointer font-medium mb-4 flex items-center justify-center gap-3 transition-colors"
          onClick={handleSocialSignIn("google")}
        >
          <GoogleIcon />
          <span className="text-base">Continue with Google</span>
        </Button>

        <div className="flex items-center gap-4 pb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form className="flex flex-col gap-y-3" onSubmit={form.handleSubmit(onSubmit)}>
          {(["name", "email"] as const).map(
            (field) => <div>
              <input
                type={field === "email" ? "email" : "text"}
                placeholder={field === "email" ? "Enter your email address" : "Enter your name"}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
                {...form.register(field)}
              />
              {form.formState.errors[field] && (
                <p className="text-sm text-red-500 pt-1">
                  <CircleAlert size={14} className="inline pr-1" />
                  {form.formState.errors[field].message}
                </p>
              )}
            </div>
          )}

          <div className="py-3">
            <hr className="text-gray-300" />
          </div>

          {(["password", "confirmPassword"] as const).map(
            (field) => <div>
              <input
                type="password"
                placeholder={field === "password" ? "Enter your password" : "Confirm password"}
                className="w-full h-12 px-4 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
                {...form.register(field)}
              />
              {form.formState.errors[field] && (
                <p className="text-sm text-red-500 pt-1">
                  <CircleAlert size={14} className="inline pr-1" />
                  {form.formState.errors[field].message}
                </p>
              )}
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full h-12 rounded-xl bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
            >
              {isFormPending ? <LoadingSpinner /> : "Create account"}
            </button>
          </div>
        </form>

        <p className="text-xs text-gray-600 text-center pt-6">
          By continuing, you agree to Routana's{" "}
          <a href="#" className="text-gray-900 hover:text-purple-600 underline lg:no-underline">
            Terms of Service
          </a>{" "}
          and{" "}
          <a href="#" className="text-gray-900 hover:text-purple-600 underline lg:no-underline">
            Privacy Policy
          </a>
        </p>

        <p className="text-sm text-gray-600 text-center pt-6">
          Already have an account?{" "}
          <Link to={"/login"} className=" text-gray-900 hover:text-purple-600 underline lg:no-underline">
            Log in
          </Link>
        </p>
      </div>
    </section>
  );
}

export default SignupPage;
