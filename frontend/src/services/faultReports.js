import api from "../lib/api";

export const getAllFaultReports = async (page = 1, limit = 20) => {
  try {
    const response = await api.get("/reports/faults", {
      params: { page, limit },
    });
    const p = response.data.pagination;
    return {
      success: true,
      data: response.data.data,
      pagination: {
        ...p,
        hasPrev: p.hasPrevPage,
        hasNext: p.hasNextPage,
      },
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch fault reports.",
    };
  }
};

export const getFaultReportById = async (id) => {
  try {
    const response = await api.get(`/reports/faults/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch fault report.",
    };
  }
};

export const updateFaultReport = async (id, fields) => {
  try {
    const response = await api.put(`/reports/faults/${id}`, fields);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to update fault report.",
    };
  }
};

export const updateFaultReportNote = async (reportId, noteId, fields) => {
  try {
    const response = await api.put(
      `/reports/faults/${reportId}/notes/${noteId}`,
      fields,
    );
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to update note.",
    };
  }
};

export const assignUserToReport = async (reportId, userId) => {
  try {
    const response = await api.post(`/reports/faults/${reportId}/assign`, {
      userID: userId,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to assign user.",
    };
  }
};

export const unassignUserFromReport = async (reportId, userId) => {
  try {
    const response = await api.post(`/reports/faults/${reportId}/unassign`, {
      userID: userId,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to unassign user.",
    };
  }
};

export const createFaultReportNote = async (reportId, { title, content }) => {
  try {
    const response = await api.post(`/reports/faults/${reportId}/notes`, {
      title,
      content,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to create note.",
    };
  }
};

export const createFaultReport = async ({
  name,
  description,
  severityLevelID,
}) => {
  try {
    const response = await api.post("/reports/faults", {
      name,
      description,
      severity: severityLevelID,
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to create fault report.",
    };
  }
};

export const getAssignableUsers = async () => {
  try {
    const response = await api.get("/reports/faults/assignable-users");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch assignable users.",
    };
  }
};
