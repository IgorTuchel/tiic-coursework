import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    toast.success("Submission: " + JSON.stringify(form));
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-500 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center">
          Inspectra
        </h1>
        <p className="mt-1 mb-8 text-sm text-gray-500 text-center">
          Secure access for authorised staff.
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
              type="text"
              onChange={handleChange}
              value={form.email}
              className="w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="password">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              value={form.password}
              className="w-full rounded-lg border border-gray-200 py-2.5 px-4 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg py-2.5 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition cursor-pointer">
            Login
          </button>
        </form>

        <p className="mt-6 text-sm text-center">
          <Link to="/reset-password" className="text-blue-600 hover:underline">
            Reset password
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
