import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Submission: " + email);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Reset Password
        </h1>
        <p className="mt-1 mb-8 text-sm text-gray-500 text-center">
          Enter your email and we'll send you a reset link.
        </p>

        <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="email">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer">
            Send Reset Link
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link to="/login" className="text-blue-600 hover:underline">
            Back to login
          </Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPasswordPage;
