// src/components/AccessControlInfo.jsx
import React from "react";

function AccessControlInfo() {
  return (
    <div className="access-info">
      <h3>Role-Based Access Overview</h3>
      <p>
        These access rules reflect the stakeholder roles and permissions defined
        in the project requirements. [page:1][file:6]
      </p>

      <ul>
        <li>
          <strong>Admin / System Administrator</strong> – Access to everything,
          including user management, AR pages, dashboard, tool checks and logs.
        </li>
        <li>
          <strong>Maintenance Engineer</strong> – Uses AR maintenance and tool
          check pages; can create and update faults; cannot manage users. [page:1][file:6]
        </li>
        <li>
          <strong>Maintenance Technician</strong> – Similar to engineer, focused
          on viewing reported faults and marking them as resolved. [file:6]
        </li>
        <li>
          <strong>Security Analyst / Security Administrator</strong> – Access to
          security dashboards, activity logs and monitoring; no access to
          assigning tasks or infrastructure updates. [page:1][file:6]
        </li>
        <li>
          <strong>Data Analyst</strong> – Access to fault history, analytics and
          dashboards; no ability to modify faults or users. [page:1][file:6]
        </li>
        <li>
          <strong>Authorised Personnel</strong> – Can suggest faults (e.g. report
          an issue) but cannot work on them or change system configuration. [page:1][file:6]
        </li>
      </ul>
    </div>
  );
}

export default AccessControlInfo;
