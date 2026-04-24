import api from "../lib/api";

export async function getErrorLogs(params = {}) {
  try {
    const query = new URLSearchParams();

    if (params.page) query.set("page", params.page);
    if (params.limit) query.set("limit", params.limit);

    if (params.errorName) query.set("errorName", params.errorName);
    if (params.httpStatusCode)
      query.set("httpStatusCode", params.httpStatusCode);
    if (params.httpStatusRange)
      query.set("httpStatusRange", params.httpStatusRange);
    if (params.statusCode) query.set("statusCode", params.statusCode);
    if (params.userID) query.set("userID", params.userID);
    if (params.method) query.set("method", params.method);
    if (params.ipAddress) query.set("ipAddress", params.ipAddress);

    if (params.from) query.set("from", params.from);
    if (params.to) query.set("to", params.to);

    const res = await api.get(`/logs?${query.toString()}`);
    return { success: true, data: res.data.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message ?? "Failed to fetch error logs.",
    };
  }
}
