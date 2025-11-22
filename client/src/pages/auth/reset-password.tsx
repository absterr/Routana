const ResetPasswordPage = () => {
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

        <form className="flex flex-col gap-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
          />

          <input
            type="password"
            placeholder="Confirm new password"
            className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-purple-600 focus:ring-1 focus:ring-purple-600 font-medium transition-colors"
          />

          <button
            type="submit"
            className="w-full h-12 rounded-lg bg-purple-600 text-white hover:bg-purple-700  disabled:bg-purple-400 hover:cursor-pointer font-semibold text-base transition-colors"
          >
            Reset password
          </button>
        </form>
      </div>
    </section>
  );
}

export default ResetPasswordPage;
