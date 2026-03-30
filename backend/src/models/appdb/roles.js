import { Sequelize } from "sequelize";
import { db } from "../../config/db.js";

const Roles = db.define("Roles", {
  roleID: {
    type: Sequelize.UUID,
    defaultValue: Sequelize.UUIDV4,
    primaryKey: true,
  },
  roleName: {
    type: Sequelize.STRING,
    allowNull: false,
    unique: true,
  },
  isAdmin: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canManageUsers: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canManageRoles: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canViewSecurityLogs: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canViewActivityLogs: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canViewAllReports: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canAssignReports: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canManageReports: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canManageTools: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canWorkOnReports: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canSuggestFaults: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canManageFaults: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canViewAllFaults: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  canAssignFaults: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  mfaRequired: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
});

Roles.afterSync(async () => {
  await Roles.bulkCreate(
    [
      {
        roleName: "Admin",
        isAdmin: true,
        canManageUsers: true,
        canManageRoles: true,
        canViewSecurityLogs: true,
        canViewActivityLogs: true,
        canViewAllReports: true,
        canWorkOnReports: true,
        canManageReports: true,
        canManageTools: true,
        canSuggestFaults: true,
        canAssignReports: true,
        canManageFaults: true,
        canViewAllFaults: true,
        canAssignFaults: true,
        mfaRequired: true,
      },
      {
        roleName: "Security Analyst",
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: true,
        canViewActivityLogs: true,
        canViewAllReports: false,
        canWorkOnReports: false,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: false,
        canAssignReports: false,
        canManageFaults: false,
        canViewAllFaults: false,
        canAssignFaults: false,

        mfaRequired: true,
      },
      {
        roleName: "Engineer",
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: false,
        canViewActivityLogs: false,
        canViewAllReports: false,
        canWorkOnReports: true,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: true,
        canAssignReports: false,
        canManageFaults: true,
        canViewAllFaults: true,
        canAssignFaults: true,
        mfaRequired: false,
      },
      {
        roleName: "Authorized Personnel",
        isAdmin: false,
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: false,
        canViewActivityLogs: false,
        canViewAllReports: false,
        canWorkOnReports: false,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: true,
        canAssignReports: false,
        canManageFaults: false,
        canViewAllFaults: false,
        canAssignFaults: false,
        mfaRequired: false,
      },
    ],
    { ignoreDuplicates: true },
  );
});

export default Roles;
