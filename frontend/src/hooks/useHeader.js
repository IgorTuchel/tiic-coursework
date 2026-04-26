import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../lib/api";
import { AuthContext } from "../context/AuthContext";

export function useHeader() {
  const { user, setUser, setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [textSizeLevel, setTextSizeLevel] = useState(0);

  const profileRef = useRef(null);
  const mobileRef = useRef(null);
  const pointerDownRef = useRef(false);

  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }

      if (mobileRef.current && !mobileRef.current.contains(e.target)) {
        setMobileOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const applyTextSize = (level) => {
    const root = document.documentElement;
    root.classList.remove("text-lg", "text-xl");

    if (level === 1) root.classList.add("text-lg");
    if (level === 2) root.classList.add("text-xl");

    setTextSizeLevel(level);
  };

  const handleLogout = async () => {
    try {
      const res = await api.post("/logout");

      if (!res.data.success) {
        toast.error(res.data.message || "Logout failed. Please try again.");
        return;
      }

      toast.success("Logged out successfully.");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          err.message ||
          "An error occurred during logout.",
      );
      return;
    }

    setIsAuthenticated(false);
    setUser(null);
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  const openSettings = () => {
    setProfileOpen(false);
    setMobileOpen(false);
    setSettingsOpen(true);
  };

  const handleProfileMouseDown = () => {
    pointerDownRef.current = true;

    requestAnimationFrame(() => {
      pointerDownRef.current = false;
    });
  };

  const handleProfileFocus = () => {
    if (pointerDownRef.current) return;
    setProfileOpen(true);
  };

  const handleProfileBlur = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.relatedTarget)) {
      setProfileOpen(false);
    }
  };

  const perms = user?.roleInfo;

  const navLinks = [
    { to: "/app/dashboard", label: "Dashboard" },
    ...(perms?.canWorkOnReports ||
    perms?.canViewAllReports ||
    perms?.canManageReports
      ? [{ to: "/app/maintenance", label: "Maintenance Reports" }]
      : []),
    ...(perms?.canWorkOnReports ||
    perms?.canViewAllReports ||
    perms?.canSuggestFaults ||
    perms?.canManageFaults ||
    perms?.canViewAllFaults
      ? [{ to: "/app/faults", label: "Fault Reports" }]
      : []),
    ...(perms?.canManageUsers || perms?.canViewAllUsers
      ? [{ to: "/app/admin", label: "Users" }]
      : []),
    ...(perms?.canViewSecurityLogs || perms?.canViewActivityLogs
      ? [{ to: "/app/logs", label: "Logs" }]
      : []),
  ];

  const textSizeLabel = ["Standard", "Large", "X-Large"][textSizeLevel];

  return {
    user,
    setUser,
    navLinks,
    textSizeLevel,
    textSizeLabel,
    mobileOpen,
    setMobileOpen,
    profileOpen,
    setProfileOpen,
    settingsOpen,
    setSettingsOpen,
    profileRef,
    mobileRef,
    applyTextSize,
    handleLogout,
    openSettings,
    handleProfileMouseDown,
    handleProfileFocus,
    handleProfileBlur,
  };
}
