import FaultReportAssign from "../models/appdb/faultReportAssign.js";

export async function userAssignedToFaultReport(userID, reportID) {
  const assigned = await FaultReportAssign.findOne({
    where: {
      userID,
      faultReportID: reportID,
    },
  });
  if (!assigned) {
    return false;
  }
  return true;
}

export async function assignUserToFaultReport(userID, reportID) {
  const existingAssignment = await FaultReportAssign.findOne({
    where: {
      userID,
      faultReportID: reportID,
    },
  });
  if (existingAssignment) {
    return {
      success: false,
      message: "User already assigned to this fault report",
    };
  }

  const newAssignment = await FaultReportAssign.create({
    userID,
    faultReportID: reportID,
  });

  if (!newAssignment) {
    return { success: false, message: "Failed to assign user to fault report" };
  }

  return { success: true, data: newAssignment };
}

export async function unassignUserFromFaultReport(userID, reportID) {
  const existingAssignment = await FaultReportAssign.findOne({
    where: {
      userID,
      faultReportID: reportID,
    },
  });
  if (!existingAssignment) {
    return {
      success: false,
      message: "User is not assigned to this fault report",
    };
  }

  const deleted = await existingAssignment.destroy();
  if (!deleted) {
    return {
      success: false,
      message: "Failed to unassign user from fault report",
    };
  }

  return { success: true };
}
