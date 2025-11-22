import { Chrome } from "lucide-react";
import { Link } from "react-router-dom";

const LoginPage = () => {
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

        <div className="pb-6">
          <button className="w-full h-12 rounded-lg border border-gray-300 bg-white text-gray-800 hover:bg-gray-100 hover:cursor-pointer font-medium flex items-center justify-center gap-3 transition-colors">
            <Chrome size={18} />
            <span>Continue with Google</span>
          </button>
        </div>

        <div className="flex items-center gap-4 pb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>

        <form className="flex flex-col gap-y-4">
          <input
            type="email"
            placeholder="Enter email address"
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
          />

          <input
            type="password"
            placeholder="Enter password"
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
          />

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
          >
            Log in
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
          <Link to={"/signup"} className=" text-gray-900 hover:text-purple-600 underline lg:no-underline">
            Sign up
          </Link>
        </p>
      </div>
    </section>
  );
}

export default LoginPage;
