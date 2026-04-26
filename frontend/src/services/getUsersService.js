// src/services/userService.js
import api from "../lib/api";

export const getAllUsers = async () => {
  try {
    const response = await api.get("/users");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while fetching users.",
    };
  }
};

export const updateSelf = async (payload) => {
  try {
    const response = await api.put("/users/self", payload);
    return {
      success: true,
      data: response.data.data,
      message: response.data.message,
    };
  } catch (error) {
    return {
      success: false,
      statusCode: error.response?.data?.statusCode,
      message:
        error.response?.data?.message ||
        error.message ||
        "An error occurred while updating user settings.",
    };
  }
};

export const getUserById = async (id) => {
  try {
    const response = await api.get(`/users/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while fetching the user.",
    };
  }
};

export const createUser = async (payload) => {
  try {
    const response = await api.post("/users", payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while creating the user.",
    };
  }
};

export const updateUser = async (id, payload) => {
  try {
    const response = await api.put(`/users/${id}`, payload);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while updating the user.",
    };
  }
};

export const deactivateUser = async (id) => {
  try {
    const response = await api.delete(`/users/${id}`);
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while deactivating the user.",
    };
  }
};

export const getRoles = async () => {
  try {
    const response = await api.get("/users/roles");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while fetching roles.",
    };
  }
};

export const getStatuses = async () => {
  try {
    const response = await api.get("/users/status");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "An error occurred while fetching statuses.",
    };
  }
};
