import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { updateSelf } from "../services/getUsersService";

export function useSettingsModal({ open, user, setUser, onClose }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    mfaEnabled: false,
    mfaCode: "",
  });
  const [saving, setSaving] = useState(false);
  const [awaitingMfaCode, setAwaitingMfaCode] = useState(false);

  const initialFirstName = user?.firstName || "";
  const initialLastName = user?.lastName || "";
  const initialMfaEnabled = !!user?.mfaEnabled;

  useEffect(() => {
    if (!open) return;

    setForm({
      firstName: initialFirstName,
      lastName: initialLastName,
      mfaEnabled: initialMfaEnabled,
      mfaCode: "",
    });

    setSaving(false);
    setAwaitingMfaCode(false);
  }, [open, initialFirstName, initialLastName, initialMfaEnabled]);

  const firstName = form.firstName.trim();
  const lastName = form.lastName.trim();

  const nameChanged =
    firstName !== initialFirstName || lastName !== initialLastName;
  const mfaChanged = form.mfaEnabled !== initialMfaEnabled;
  const hasChanges = nameChanged || mfaChanged;

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const toggleMfa = () => {
    if (awaitingMfaCode) return;

    setForm((prev) => ({
      ...prev,
      mfaEnabled: !prev.mfaEnabled,
      mfaCode: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!hasChanges) {
      toast.error("No changes to save.");
      return;
    }

    if (awaitingMfaCode && !form.mfaCode.trim()) {
      toast.error("Please enter the code sent to your email.");
      return;
    }

    setSaving(true);

    const payload = {};

    if (nameChanged) {
      payload.firstName = firstName;
      payload.lastName = lastName;
    }

    if (mfaChanged) {
      payload.mfaEnabled = form.mfaEnabled;

      if (awaitingMfaCode) {
        payload.mfaCode = form.mfaCode.trim();
      }
    }

    const res = await updateSelf(payload);

    setSaving(false);

    if (res.statusCode === "ACTION_REQUIRE_MFA") {
      setAwaitingMfaCode(true);
      toast.success("A verification code has been sent to your email.");
      return;
    }

    if (!res.success) {
      toast.error(res.message || "Failed to update settings.");
      return;
    }

    setUser((prev) => ({
      ...prev,
      firstName: res.data.firstName,
      lastName: res.data.lastName,
      mfaEnabled: res.data.mfaEnabled,
    }));

    toast.success("Settings updated successfully.");
    onClose();
  };

  const subtitle = awaitingMfaCode
    ? "A verification code was sent to your email — enter it below to confirm."
    : "Update your profile details and security preferences.";

  const submitLabel = saving
    ? "Saving..."
    : awaitingMfaCode
      ? "Confirm"
      : "Save changes";

  return {
    form,
    saving,
    awaitingMfaCode,
    hasChanges,
    subtitle,
    submitLabel,
    updateField,
    toggleMfa,
    handleSubmit,
  };
}
