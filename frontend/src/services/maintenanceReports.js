import api from "../lib/api";

export const getAllMaintenanceReports = async () => {
  try {
    const response = await api.get("/reports/maintenance");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch maintenance reports.",
    };
  }
};

export const getMaintenanceReportById = async (id) => {
  try {
    const response = await api.get(`/reports/maintenance/${id}`);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch maintenance report.",
    };
  }
};

export const updateMaintenanceReport = async (id, fields) => {
  try {
    const response = await api.put(`/reports/maintenance/${id}`, fields);
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to update maintenance report.",
    };
  }
};

export const updateMaintenanceReportNote = async (reportId, noteId, fields) => {
  try {
    const response = await api.put(
      `/reports/maintenance/${reportId}/notes/${noteId}`,
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
    const response = await api.post(`/reports/maintenance/${reportId}/assign`, {
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
    const response = await api.post(
      `/reports/maintenance/${reportId}/unassign`,
      { userID: userId },
    );
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
export const addToolToReport = async (reportId, toolId) => {
  try {
    const response = await api.post(`/reports/maintenance/${reportId}/tools`, {
      toolIDs: [toolId],
    });
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error || error.message || "Failed to add tool.",
    };
  }
};

export const removeToolFromReport = async (reportId, toolId) => {
  try {
    const response = await api.delete(
      `/reports/maintenance/${reportId}/tools`,
      {
        data: { toolIDs: [toolId] },
      },
    );
    return { success: true, data: response.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to remove tool.",
    };
  }
};

export const getAllTools = async () => {
  try {
    const response = await api.get("/reports/maintenance/tools");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch tools.",
    };
  }
};

export const getReportStatuses = async () => {
  try {
    const response = await api.get("/reports/status");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch report statuses.",
    };
  }
};

export const getSeverityLevels = async () => {
  try {
    const response = await api.get("/reports/severity");
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch severity levels.",
    };
  }
};

export const createMaintenanceReportNote = async (
  reportId,
  { title, content },
) => {
  try {
    const response = await api.post(`/reports/maintenance/${reportId}/notes`, {
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

export const getMarkerQrBlobUrl = async (reportId) => {
  try {
    const response = await api.get(
      `/reports/maintenance/${reportId}/marker/qr`,
      {
        responseType: "blob",
      },
    );
    return { success: true, url: URL.createObjectURL(response.data) };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch QR marker.",
    };
  }
};

export const downloadMarkerPdf = async (reportId) => {
  try {
    const response = await api.get(
      `/reports/maintenance/${reportId}/marker/pdf`,
      {
        responseType: "blob",
      },
    );
    const url = URL.createObjectURL(response.data);
    const a = document.createElement("a");
    a.href = url;
    a.download = `marker-${reportId}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    return { success: true };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to download PDF.",
    };
  }
};

export const createMaintenanceReport = async ({
  name,
  description,
  severityLevelID,
  tools,
}) => {
  try {
    const response = await api.post("/reports/maintenance", {
      name,
      description,
      severity: severityLevelID,
      tools: tools ?? [],
    });
    return { success: true, data: response.data.data };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to create maintenance report.",
    };
  }
};
