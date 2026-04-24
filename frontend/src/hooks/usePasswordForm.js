import { useState } from "react";
import { passwordRules, validatePassword } from "../utils/validator";

export function usePasswordForm() {
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);

  const rules = passwordRules().map((r) => ({
    label: r.label,
    ok: r.test(password),
  }));

  const allValid = rules.every((r) => r.ok);

  const validate = () => validatePassword(password);

  return {
    password,
    setPassword,
    showPass,
    setShowPass,
    rules,
    allValid,
    validate,
  };
}
