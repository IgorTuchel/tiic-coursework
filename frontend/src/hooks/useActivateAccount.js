import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { activateAccount } from "../services/activateAccountService";
import { login } from "../services/loginUserService";

export function useActivateAccount() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("id");

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmitPassword = async (e, { password, validate }) => {
    e.preventDefault();
    const check = validate();
    if (!check.valid) {
      toast.error(check.reason);
      return;
    }
    if (!token) {
      toast.error("Invalid activation link.");
      return;
    }

    setSubmitting(true);
    const result = await activateAccount(token, password);
    setSubmitting(false);

    if (result.success) {
      toast.success("Account activated successfully! Redirecting to login...");
      navigate("/login", { replace: true });
    } else {
      toast.error(
        result.error?.error || "Activation failed. Please try again.",
      );
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const res = await login(email, "dummyPassword");
    if (res.statusCode === "LOGIN_FAILURE_ACCOUNT_NOT_SETUP") {
      toast.success("Please check your email for the activation link.");
    } else {
      toast.error(
        "Account not found or already activated. Please check your email or try logging in.",
      );
    }
  };

  return {
    token,
    email,
    setEmail,
    submitting,
    handleSubmitPassword,
    handleSubmitEmail,
  };
}
