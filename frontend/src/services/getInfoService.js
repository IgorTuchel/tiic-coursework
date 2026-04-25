import api from "../lib/api";

export const getAssignedFaultReports = async () => {
  try {
    const response = await api.get("/reports/faults/info/assigned");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch assigned fault reports.",
    };
  }
};

export const getAllFaultReportCount = async () => {
  try {
    const response = await api.get("/reports/faults/info/all");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch fault report count.",
    };
  }
};

export const getFaultReportCount = async () => {
  try {
    const response = await api.get("/reports/faults/info/me");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch fault report count.",
    };
  }
};

export const getAssignedMaintenanceReports = async () => {
  try {
    const response = await api.get("/reports/maintenance/info/assigned");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch assigned maintenance reports.",
    };
  }
};

export const getAllMaintenanceReportCount = async () => {
  try {
    const response = await api.get("/reports/maintenance/info/all");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch maintenance report count.",
    };
  }
};

export const getMaintenanceReportCount = async () => {
  try {
    const response = await api.get("/reports/maintenance/info/me");
    return {
      success: true,
      data: response.data.data,
      total: response.data.total,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        "Failed to fetch maintenance report count.",
    };
  }
};
