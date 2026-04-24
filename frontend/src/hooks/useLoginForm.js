import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { login } from "../services/loginUserService";
import { AuthContext } from "../context/AuthContext";
import { validateEmail, validatePassword } from "../utils/validator";

export function useLoginForm() {
  const navigate = useNavigate();
  const { setIsAuthenticated, setLoading, loading } = useContext(AuthContext);

  const [form, setForm] = useState({ email: "", password: "", mfaCode: "" });
  const [mfaRequired, setMfaRequired] = useState(false);
  const [visiblePass, setVisiblePass] = useState(false);

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateEmail(form.email)) {
      toast.error("Please enter a valid email address.");
      setLoading(false);
      return;
    }

    const validPass = validatePassword(form.password);
    if (!validPass.valid) {
      toast.error(validPass.reason);
      setLoading(false);
      return;
    }

    const res = await login(form.email, form.password, form.mfaCode);

    if (res.mfaRequired) {
      setMfaRequired(true);
      setLoading(false);
      if (!mfaRequired) {
        toast.success("Enter your MFA code to continue.");
      } else {
        toast.error("Invalid MFA code. Please try again.");
        setForm((f) => ({ ...f, mfaCode: "" }));
      }
      return;
    }

    if (!res.success) {
      toast.error(
        res.message || "Login failed. Please check your credentials.",
      );
      setLoading(false);
      return;
    }

    setLoading(false);
    setIsAuthenticated(true);
    toast.success("Successfully logged in!");
    navigate(0);
  };

  const handleBackToLogin = () => {
    setMfaRequired(false);
    setForm((f) => ({ ...f, mfaCode: "" }));
  };

  return {
    form,
    loading,
    mfaRequired,
    visiblePass,
    setVisiblePass,
    handleChange,
    handleSubmit,
    handleBackToLogin,
  };
}
