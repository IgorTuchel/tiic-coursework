import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { requestPasswordReset } from "../services/resetPasswordService";

export function useResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Reset Password | Inspectra";
  }, []);

  const handleSubmitPassword = async (e, { password, validate }) => {
    e.preventDefault();
    const check = validate();
    if (!check.valid) {
      toast.error(check.reason);
      return;
    }
    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    setSubmitting(true);
    const result = await requestPasswordReset("", token, password);
    setSubmitting(false);

    if (result.success) {
      toast.success("Password reset successfully! Redirecting to login...");
      navigate("/login", { replace: true });
    } else {
      toast.error(result.message || "Password reset failed. Please try again.");
    }
  };

  const handleSubmitEmail = async (e) => {
    e.preventDefault();
    const res = await requestPasswordReset(email);
    if (res.success) {
      toast.success(
        res.data?.message || "Please check your email for the reset link.",
      );
    } else {
      toast.error(
        res.message || "Failed to request password reset. Please try again.",
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
