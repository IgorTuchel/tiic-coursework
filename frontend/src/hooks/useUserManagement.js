import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";
import {
  getAllUsers,
  createUser,
  updateUser,
  deactivateUser,
  getRoles,
  getStatuses,
} from "../services/getUsersService.js";

function normaliseUser(u) {
  if (!u) return u;
  return {
    ...u,
    role: Array.isArray(u.role)
      ? { roleName: u.role[0], roleID: u.role[1] }
      : u.role,
    status: Array.isArray(u.status)
      ? { statusName: u.status[0], statusID: u.status[1] }
      : u.status,
  };
}

export function useUserManagement() {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [statuses, setStatuses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [modal, setModal] = useState(null);
  const [activeUser, setActiveUser] = useState(null);
  const [onBack, setOnBack] = useState(null);
  const [searchState, setSearchState] = useState({ query: "", result: null });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await getAllUsers();
    if (res.success) setUsers(res.data.map(normaliseUser));
    else toast.error(res.message);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
    getRoles().then((r) => {
      if (r.success) setRoles(r.data);
      else toast.error(r.message);
    });
    getStatuses().then((r) => {
      if (r.success) setStatuses(r.data);
      else toast.error(r.message);
    });
  }, [fetchUsers]);

  const openModal = useCallback((type, user, backFn) => {
    if (user !== undefined) setActiveUser(user);
    if (backFn !== undefined) setOnBack(() => backFn);
    else setOnBack(null);
    setModal(type);
  }, []);

  const closeModal = useCallback(() => {
    setModal(null);
    setActiveUser(null);
    setOnBack(null);
    setSearchState({ query: "", result: null });
  }, []);

  const handleCreate = async (payload) => {
    const res = await createUser(payload);
    if (res.success) {
      toast.success("User created.");
      closeModal();
      fetchUsers();
    } else toast.error(res.message);
  };

  const handleUpdate = async (payload) => {
    const res = await updateUser(activeUser.userID, payload);
    if (res.success) {
      toast.success("User updated.");
      closeModal();
      fetchUsers();
    } else toast.error(res.message);
  };

  const handleDeactivate = async () => {
    const res = await deactivateUser(activeUser.userID);
    if (res.success) {
      toast.success("Account deactivated.");
      closeModal();
      fetchUsers();
    } else toast.error(res.message);
  };

  return {
    // data
    users,
    roles,
    statuses,
    loading,
    // modal state
    modal,
    activeUser,
    onBack,
    searchState,
    setSearchState,
    // actions
    openModal,
    closeModal,
    fetchUsers,
    handleCreate,
    handleUpdate,
    handleDeactivate,
  };
}
