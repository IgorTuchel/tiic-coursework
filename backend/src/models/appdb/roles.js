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
  canWorkOnReports: {
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
  canSuggestFaults: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  cabAssignReports: {
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
        canManageUsers: true,
        canManageRoles: true,
        canViewSecurityLogs: true,
        canViewActivityLogs: true,
        canViewAllReports: true,
        canWorkOnReports: true,
        canManageReports: true,
        canManageTools: true,
        canSuggestFaults: true,
        cabAssignReports: true,
        mfaRequired: true,
      },
      {
        roleName: "Security Analyst",
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: true,
        canViewActivityLogs: true,
        canViewAllReports: false,
        canWorkOnReports: false,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: false,
        cabAssignReports: false,
        mfaRequired: true,
      },
      {
        roleName: "Engineer",
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: false,
        canViewActivityLogs: false,
        canViewAllReports: false,
        canWorkOnReports: true,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: true,
        cabAssignReports: false,
        mfaRequired: false,
      },
      {
        roleName: "Authorized Personnel",
        canManageUsers: false,
        canManageRoles: false,
        canViewSecurityLogs: false,
        canViewActivityLogs: false,
        canViewAllReports: false,
        canWorkOnReports: false,
        canManageReports: false,
        canManageTools: false,
        canSuggestFaults: true,
        cabAssignReports: false,
        mfaRequired: false,
      },
    ],
    { ignoreDuplicates: true },
  );
});

export default Roles;
