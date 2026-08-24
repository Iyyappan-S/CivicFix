# Testing Strategy & Scenarios

## Manual Test Cases

| Test Case ID | Feature | Input | Expected Result | Status |
|---|---|---|---|---|
| TC-001 | Auth: Registration | Valid Name, Email, Password | Acc created, returns 201 Success. | ✅ Tested |
| TC-002 | Auth: Login | Valid Email, Password | Returns JWT Token & User Data, routes to Dash. | ✅ Tested |
| TC-003 | Auth: Role Access | Citizen trying to hit Admin APIs | Server returns `403 Forbidden`. | ✅ Tested |
| TC-004 | Complaint: File Issue | Category, Location, Title | Complaint created in DB with status SUBMITTED. | ✅ Tested |
| TC-005 | Admin: Assigment | Select complaint, Dept, Officer | Complaint status shifts to ASSIGNED, officer bounded. | ✅ Tested |
| TC-006 | Officer: Update | Select issue -> IN_PROGRESS | Complaint status shifts, history log is generated. | ✅ Tested |
| TC-007 | Image: Uploads | PNG image file | File saved to `/uploads`, DB row entered for `complaint_images`. | ✅ Tested |
| TC-008 | Dashboard: Stats | Load Admin Dash | Metrics accurately count SQL aggregations. | ✅ Tested |

## Postman API Testing
Endpoints successfully pass JSON format expectations and header rules for Authorization. `Bearer <token>` parsing properly verified.
