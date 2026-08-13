# API Contract

## Project

**Intelligent Bankruptcy Risk Prediction and Decision Support System**

نظام ذكي لدعم القرار للتنبؤ المبكر بمخاطر الإفلاس وتقديم قرارات وقائية في الشركات الصناعية الصغيرة والمتوسطة باستخدام الذكاء الاصطناعي.

---

## 1. Purpose

This document defines the shared API contract between the following system components:

- Frontend: Next.js + TypeScript + Tailwind CSS
- Backend: FastAPI + Pydantic
- Database: PostgreSQL
- AI Agent: LangGraph
- Machine Learning
- Explainable AI (XAI)
- Decision Support System
- Recommendation Engine
- Report Generator

The API uses JSON for normal request and response payloads.

Generated reports are returned as HTML files.

---

## 2. Backend Base URL

Development Backend URL:

```text
http://127.0.0.1:8000
```

Alternative local URL:

```text
http://localhost:8000
```

The current Backend routes do **not** use the `/api/v1` prefix.

---

## 3. Frontend Base URL

Development Frontend URL:

```text
http://localhost:3000
```

The Next.js application uses internal API proxy routes under:

```text
/api/*
```

These routes forward authenticated requests to the FastAPI Backend.

---

# 4. Authentication

The Backend uses JWT Bearer authentication.

Protected Backend requests use:

```http
Authorization: Bearer <access_token>
```

The Frontend stores the access token in a secure application cookie named:

```text
access_token
```

The Next.js API routes read this cookie and forward the token to FastAPI.

---

# 5. Authentication API

## 5.1 Login

### Backend Endpoint

```http
POST /auth/login
```

### Authentication

Not required.

### Request

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

### Success Response

Status:

```text
200 OK
```

Response:

```json
{
  "access_token": "<jwt_token>",
  "token_type": "bearer"
}
```

### Errors

Invalid email or password:

```text
401 Unauthorized
```

```json
{
  "detail": "Invalid email or password"
}
```

Inactive account:

```text
403 Forbidden
```

```json
{
  "detail": "User account is inactive"
}
```

Invalid request data:

```text
422 Unprocessable Entity
```

---

# 6. User Registration

## 6.1 Create User

### Backend Endpoint

```http
POST /users/
```

### Authentication

Not required for normal account registration.

### Request

```json
{
  "full_name": "Example User",
  "email": "user@example.com",
  "password": "password123"
}
```

### Success Response

```text
201 Created
```

Example:

```json
{
  "id": 5,
  "full_name": "Example User",
  "email": "user@example.com",
  "role": "financial_user",
  "is_active": true,
  "created_at": "2026-08-13T01:00:00+03:00"
}
```

### Duplicate Email

```text
409 Conflict
```

```json
{
  "detail": "Email already exists"
}
```

### Validation Error

```text
422 Unprocessable Entity
```

---

# 7. Current User Account API

## 7.1 Get Current User

### Backend Endpoint

```http
GET /users/me
```

### Authentication

Required.

### Success Response

```text
200 OK
```

Example:

```json
{
  "id": 5,
  "full_name": "Example User",
  "email": "user@example.com",
  "role": "financial_user",
  "is_active": true,
  "created_at": "2026-08-13T01:00:00+03:00"
}
```

Possible roles currently used by the system:

```text
financial_user
admin
```

---

## 7.2 Update Current User

### Backend Endpoint

```http
PUT /users/me
```

### Authentication

Required.

### Request

All fields are optional.

```json
{
  "full_name": "Updated Name",
  "email": "updated@example.com",
  "password": "newpassword123"
}
```

### Success Response

```text
200 OK
```

### Errors

Duplicate email:

```text
409 Conflict
```

Invalid data:

```text
422 Unprocessable Entity
```

---

# 8. Company

Each normal financial user owns or is associated with their own company.

The Frontend uses:

```text
/api/company/me
```

to retrieve and manage the company belonging to the authenticated user.

The user must not manually provide another user's company identifier when performing normal account operations.

The Backend determines company ownership from the authenticated user.

The analysis workflow also obtains the authenticated user's company automatically.

---

# 9. Financial Records API

Financial records belong to the authenticated user's company.

Users do not manually provide `company_id` through the normal Frontend workflow.

---

## 9.1 Create Financial Record

### Backend Endpoint

```http
POST /financial-records/
```

### Authentication

Required.

### Request

```json
{
  "fiscal_year": 2025,
  "total_assets": 520000,
  "total_liabilities": 275000,
  "current_assets": 150000,
  "current_liabilities": 100000,
  "total_revenue": 680000,
  "net_income": 92000,
  "operating_cash_flow": 102000
}
```

### Important Behavior

The Backend automatically determines:

```text
company_id
```

from the current authenticated user.

### Success

```text
201 Created
```

Example response:

```json
{
  "id": 3,
  "company_id": 5,
  "fiscal_year": 2025,
  "total_assets": "520000.00",
  "total_liabilities": "275000.00",
  "current_assets": "150000.00",
  "current_liabilities": "100000.00",
  "total_revenue": "680000.00",
  "net_income": "92000.00",
  "operating_cash_flow": "102000.00",
  "created_at": "2026-08-13T01:00:00+03:00"
}
```

### Company Missing

```text
400 Bad Request
```

```json
{
  "detail": "Create your company first"
}
```

### Duplicate Fiscal Year

A company cannot have two financial records for the same fiscal year.

```text
409 Conflict
```

```json
{
  "detail": "A financial record already exists for this fiscal year"
}
```

### Validation Error

```text
422 Unprocessable Entity
```

---

## 9.2 Get Current Company's Financial Records

### Backend Endpoint

```http
GET /financial-records/me
```

### Authentication

Required.

### Success

```text
200 OK
```

Response:

```json
[
  {
    "id": 3,
    "company_id": 5,
    "fiscal_year": 2025,
    "total_assets": "520000.00",
    "total_liabilities": "275000.00",
    "current_assets": "150000.00",
    "current_liabilities": "100000.00",
    "total_revenue": "680000.00",
    "net_income": "92000.00",
    "operating_cash_flow": "102000.00",
    "created_at": "2026-08-13T01:00:00+03:00"
  }
]
```

Records are returned ordered by:

```text
fiscal_year DESC
```

If the user has no company:

```json
[]
```

---

## 9.3 Get One Financial Record

### Backend Endpoint

```http
GET /financial-records/{record_id}
```

### Authentication

Required.

### Authorization

Normal users may access only records belonging to their company.

Admins may access records according to Backend administrator permissions.

### Errors

Not found:

```text
404 Not Found
```

```json
{
  "detail": "Financial record not found"
}
```

Unauthorized ownership:

```text
403 Forbidden
```

```json
{
  "detail": "Access denied"
}
```

---

## 9.4 Update Financial Record

### Backend Endpoint

```http
PUT /financial-records/{record_id}
```

### Authentication

Required.

### Example Request

```json
{
  "fiscal_year": 2025,
  "total_assets": 530000,
  "total_liabilities": 270000,
  "current_assets": 155000,
  "current_liabilities": 98000,
  "total_revenue": 700000,
  "net_income": 95000,
  "operating_cash_flow": 110000
}
```

### Success

```text
200 OK
```

### Duplicate Year Protection

If the fiscal year is changed to another year already used by the same company:

```text
409 Conflict
```

```json
{
  "detail": "A financial record already exists for this fiscal year"
}
```

### Ownership Error

```text
403 Forbidden
```

### Not Found

```text
404 Not Found
```

---

## 9.5 Delete Financial Record

### Backend Endpoint

```http
DELETE /financial-records/{record_id}
```

### Authentication

Required.

### Success

```text
204 No Content
```

### Ownership Error

```text
403 Forbidden
```

### Not Found

```text
404 Not Found
```

---

# 10. AI Analysis API

The analysis process uses:

```text
FastAPI
→ LangGraph Agent
→ Financial Data Validation
→ Machine Learning
→ Explainable AI
→ Decision Support
→ Recommendations
→ Report Generation
→ Database Persistence
```

The authenticated user does not manually provide:

```text
company_id
financial_record_id
```

The Backend determines the user's company and selects the latest financial record automatically.

---

## 10.1 Run Analysis

### Backend Endpoint

```http
POST /analysis/run
```

### Authentication

Required.

### Request

The ML model expects 21 financial ratios for 3 years.

```json
{
  "yearly_ratios": {
    "t_minus_3": {
      "ROA": 0.1,
      "ROE": 0.14,
      "ROS": 0.12,
      "L1": 1.5,
      "L2": 1.2,
      "L3": 0.8,
      "ATD": 0.2,
      "DTR": 0.48,
      "TAT": 1.3,
      "ITD": 4.1,
      "DA": 0.4,
      "DE": 0.7,
      "FL": 1.6,
      "ROI": 0.1,
      "DIR": 0.3,
      "DCR": 1.6,
      "ACR": 1.4,
      "LP": 0.2,
      "BL": 0.1,
      "LRR": 0.3,
      "WAR": 0.5
    },
    "t_minus_2": {
      "ROA": 0.1,
      "ROE": 0.14,
      "ROS": 0.12,
      "L1": 1.5,
      "L2": 1.2,
      "L3": 0.8,
      "ATD": 0.2,
      "DTR": 0.48,
      "TAT": 1.3,
      "ITD": 4.1,
      "DA": 0.4,
      "DE": 0.7,
      "FL": 1.6,
      "ROI": 0.1,
      "DIR": 0.3,
      "DCR": 1.6,
      "ACR": 1.4,
      "LP": 0.2,
      "BL": 0.1,
      "LRR": 0.3,
      "WAR": 0.5
    },
    "t_minus_1": {
      "ROA": 0.1,
      "ROE": 0.14,
      "ROS": 0.12,
      "L1": 1.5,
      "L2": 1.2,
      "L3": 0.8,
      "ATD": 0.2,
      "DTR": 0.48,
      "TAT": 1.3,
      "ITD": 4.1,
      "DA": 0.4,
      "DE": 0.7,
      "FL": 1.6,
      "ROI": 0.1,
      "DIR": 0.3,
      "DCR": 1.6,
      "ACR": 1.4,
      "LP": 0.2,
      "BL": 0.1,
      "LRR": 0.3,
      "WAR": 0.5
    }
  }
}
```

---

## 10.2 Required Ratio Codes

The 21 ratio codes are:

```text
ROA
ROE
ROS
L1
L2
L3
ATD
DTR
TAT
ITD
DA
DE
FL
ROI
DIR
DCR
ACR
LP
BL
LRR
WAR
```

---

## 10.3 Analysis Success Response

Example structure:

```json
{
  "user_id": 5,
  "company_id": 5,
  "financial_record_id": 3,
  "prediction_id": 12,
  "bankruptcy_probability": 0.01,
  "predicted_class": 0,
  "risk_level": "low",
  "model_version": "1.0.0",
  "explanation": "Risk level is low. The most influential financial factors are...",
  "top_risk_factors": [
    {
      "ratio_code": "DTR",
      "ratio_name": "Accounts Receivable Collection Days",
      "year_offset": "t_minus_1",
      "category": "activity",
      "value": 0.48
    }
  ],
  "recommendations": [
    {
      "id": "REC007",
      "title": "الاستمرار في المراقبة الدورية",
      "description": "الاستمرار في متابعة المؤشرات وإعادة التقييم عند توفر بيانات أحدث.",
      "priority": "Low",
      "priority_rank": 4,
      "action_category": "monitoring",
      "time_horizon": "ongoing",
      "risk_level": "Low"
    }
  ],
  "report": {
    "report_id": "REP-20260813-EE5E86B8",
    "status": "completed",
    "filename": "REP-20260813-EE5E86B8.html",
    "view_url": "/analysis/reports/REP-20260813-EE5E86B8",
    "download_url": "/analysis/reports/REP-20260813-EE5E86B8/download"
  },
  "status": "completed",
  "error": null
}
```

---

## 10.4 Analysis Errors

Company missing:

```text
400 Bad Request
```

```json
{
  "detail": "Create your company first"
}
```

Financial records missing:

```text
400 Bad Request
```

```json
{
  "detail": "No financial records found for your company"
}
```

Agent or ML failure:

```text
400 Bad Request
```

The exact `detail` contains the Agent error.

---

# 11. Analysis History API

## 11.1 Get User Analysis History

### Backend Endpoint

```http
GET /analysis/history
```

### Authentication

Required.

### Authorization

Only records associated with the current authenticated user are returned.

### Success Response

Example:

```json
[
  {
    "user_id": 5,
    "company_id": 5,
    "financial_record_id": 3,
    "prediction_id": 12,
    "report_id": "REP-20260813-EE5E86B8",
    "status": "completed",
    "id": 9,
    "created_at": "2026-08-13T01:52:00+03:00"
  },
  {
    "user_id": 5,
    "company_id": 5,
    "financial_record_id": 3,
    "prediction_id": 11,
    "report_id": null,
    "status": "completed",
    "id": 8,
    "created_at": "2026-08-12T23:36:24+03:00"
  }
]
```

### Legacy Records

Older analysis records created before report ownership integration may contain:

```json
{
  "report_id": null
}
```

This is intentional for backward compatibility.

---

# 12. Reports API

Reports are linked to:

```text
user_id + report_id
```

inside `analysis_history`.

This protects generated reports from unauthorized users.

---

## 12.1 View Report

### Backend Endpoint

```http
GET /analysis/reports/{report_id}
```

### Authentication

Required.

### Example

```text
GET /analysis/reports/REP-20260813-EE5E86B8
```

### Success

```text
200 OK
```

Content type:

```text
text/html
```

### Security Rule

The Backend checks that the report belongs to:

```text
current_user.id
```

before returning the file.

If the report belongs to another user:

```text
404 Not Found
```

```json
{
  "detail": "Report not found"
}
```

The API intentionally returns `404` instead of `403` so that it does not reveal whether another user's report exists.

---

## 12.2 Download Report

### Backend Endpoint

```http
GET /analysis/reports/{report_id}/download
```

### Authentication

Required.

### Success

```text
200 OK
```

The response downloads the generated HTML report.

### Unauthorized Report Ownership

```text
404 Not Found
```

```json
{
  "detail": "Report not found"
}
```

---

## 12.3 Report ID Format

Valid report IDs use this format:

```text
REP-YYYYMMDD-XXXXXXXX
```

Example:

```text
REP-20260813-EE5E86B8
```

Invalid report IDs return:

```text
400 Bad Request
```

```json
{
  "detail": "Invalid report id"
}
```

---

# 13. Admin Users API

Administrative endpoints are protected using the Backend dependency:

```text
require_admin
```

Only users with:

```text
role = "admin"
```

may access these endpoints.

---

## 13.1 Get All Users

### Endpoint

```http
GET /users/
```

### Authentication

Required.

### Role

Admin only.

### Query Parameters

Optional:

```text
skip
limit
```

Example:

```text
GET /users/?skip=0&limit=100
```

### Success

```text
200 OK
```

Example:

```json
[
  {
    "id": 1,
    "full_name": "Admin User",
    "email": "admin@example.com",
    "role": "admin",
    "is_active": true,
    "created_at": "2026-08-08T02:41:44+03:00"
  },
  {
    "id": 2,
    "full_name": "Financial User",
    "email": "financial@example.com",
    "role": "financial_user",
    "is_active": true,
    "created_at": "2026-08-08T02:42:27+03:00"
  }
]
```

---

## 13.2 Get One User

### Endpoint

```http
GET /users/{user_id}
```

### Authentication

Required.

A normal user can retrieve only their own account.

Admins may retrieve other user records.

### Unauthorized User

```text
403 Forbidden
```

```json
{
  "detail": "You can only view your own account"
}
```

---

## 13.3 Update User as Admin

### Endpoint

```http
PUT /users/{user_id}
```

### Authentication

Required.

### Role

Admin only.

### Supported Fields

```text
full_name
email
password
is_active
```

The user's role is currently displayed but is not modified through this endpoint.

### Disable User Example

```json
{
  "is_active": false
}
```

### Enable User Example

```json
{
  "is_active": true
}
```

### Success

```text
200 OK
```

---

## 13.4 Delete User as Admin

### Endpoint

```http
DELETE /users/{user_id}
```

### Authentication

Required.

### Role

Admin only.

### Success

```text
204 No Content
```

The Frontend Admin UI prevents the currently logged-in administrator from deleting or disabling their own active account through the UI.

---

# 14. Frontend API Proxy Routes

The Next.js Frontend uses server-side proxy routes so JWT tokens remain managed through application cookies.

Current Frontend API routes include:

```text
/api/account/me
/api/admin/users
/api/admin/users/[userId]
/api/analysis/history
/api/analysis/run
/api/auth/login
/api/auth/logout
/api/auth/register
/api/auth/session
/api/company/me
/api/financial-records
/api/financial-records/[recordId]
/api/reports/[reportId]
/api/reports/[reportId]/download
```

---

# 15. Frontend Application Routes

Current application pages include:

```text
/
/account
/admin
/company
/dashboard
/financial-records
/history
/login
/register
```

Protected pages require an authenticated session.

Examples:

```text
/dashboard
/history
/company
/financial-records
/account
/admin
```

---

# 16. Admin Frontend Security

The `/admin` page performs server-side role verification.

Behavior:

```text
No access token
→ Redirect to /login
```

```text
Authenticated financial_user
→ Redirect to /dashboard
```

```text
Authenticated admin
→ Allow /admin
```

The Admin navigation item is displayed only when:

```text
user.role === "admin"
```

Frontend visibility is not considered the primary security control.

The FastAPI Backend remains responsible for enforcing administrator permissions.

---

# 17. Financial Record Ownership Security

Financial records are associated with a company.

Normal users can access only records belonging to their own company.

The Backend compares:

```text
record.company_id
```

against the authenticated user's company.

Unauthorized access returns:

```text
403 Forbidden
```

---

# 18. Report Ownership Security

Reports are protected using:

```text
report_id
+
user_id
```

The Backend searches the analysis history using both values before accessing the report file.

Security flow:

```text
Authenticated User
        ↓
report_id
        ↓
analysis_history
        ↓
user_id + report_id match?
        ↓
YES → Return report
NO  → 404 Report not found
```

This applies to both:

```text
View Report
Download Report
```

---

# 19. AI Agent Workflow

The LangGraph Agent currently follows this workflow:

```text
START
  ↓
load_financial_data
  ↓
validate_financial_data
  ↓
predict_bankruptcy
  ↓
explain_prediction
  ↓
generate_recommendations
  ↓
save_analysis_results
  ↓
save_analysis_history
  ↓
END
```

If a node changes the Agent status to:

```text
failed
```

the workflow stops instead of continuing with invalid results.

---

# 20. Agent State

The Agent passes shared state containing information such as:

```text
user_id
company_id
financial_record_id
prediction_id
company_data
financial_data
yearly_ratios
validated_data
bankruptcy_probability
predicted_class
risk_level
explanation
top_risk_factors
recommendations
report
model_version
status
error
```

---

# 21. Decision Support Integration

The Agent sends prediction results to the Decision Support subsystem.

The subsystem uses:

```text
bankruptcy_probability
risk_level
top_risk_factors
```

to generate preventive recommendations.

The Decision Support layer then generates the final report.

General flow:

```text
ML Prediction
      ↓
XAI Risk Factors
      ↓
Decision Support
      ↓
Rules
      ↓
Knowledge Base
      ↓
Recommendations
      ↓
Report
```

---

# 22. Recommendation Structure

Example:

```json
{
  "id": "REC005",
  "title": "إعداد خطة تصحيح مالي",
  "description": "وضع خطة إجراءات قابلة للقياس لتحسين الاستقرار المالي وتقليل المخاطر.",
  "priority": "High",
  "priority_rank": 2,
  "action_category": "corrective_plan",
  "time_horizon": "short_term",
  "risk_level": "High"
}
```

---

# 23. Report Structure

The generated report metadata uses:

```json
{
  "report_id": "REP-20260813-EE5E86B8",
  "status": "completed",
  "filename": "REP-20260813-EE5E86B8.html",
  "view_url": "/analysis/reports/REP-20260813-EE5E86B8",
  "download_url": "/analysis/reports/REP-20260813-EE5E86B8/download"
}
```

Current report format:

```text
HTML
```

PDF generation may be added later if required.

---

# 24. Common HTTP Status Codes

| Code | Meaning | Usage |
|---|---|---|
| 200 | OK | Successful GET or PUT |
| 201 | Created | Resource created |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Business or analysis error |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Authenticated but insufficient permission |
| 404 | Not Found | Resource not found or protected report inaccessible |
| 409 | Conflict | Duplicate email or duplicate fiscal year |
| 422 | Unprocessable Entity | Pydantic validation failure |
| 500 | Internal Server Error | Unexpected server failure |
| 503 | Service Unavailable | Frontend proxy cannot reach Backend |

---

# 25. Frontend Proxy Error Handling

Frontend Next.js API routes translate Backend errors into user-friendly Arabic messages.

Examples:

Duplicate financial year:

```text
يوجد سجل مالي لهذه السنة بالفعل
```

Invalid financial data:

```text
تأكد من صحة البيانات المالية
```

Backend unavailable:

```text
تعذر الاتصال بالخادم
```

Unauthenticated request:

```text
غير مسجل الدخول
```

---

# 26. Backend Automated Tests

The Backend currently contains automated tests for:

### Authentication

```text
5 tests passed
```

Coverage includes:

```text
Successful login
Invalid credentials
Wrong password
Inactive account
Invalid email format
```

### Financial Records

```text
4 tests passed
```

Coverage includes:

```text
Create financial record
Duplicate fiscal year protection
Get company financial records
Cross-company access protection
```

### Analysis Reports

```text
4 tests passed
```

Coverage includes:

```text
Report owner access
Other-user view protection
Other-user download protection
Invalid report ID
```

### Admin Users

```text
4 tests passed
```

Coverage includes:

```text
Admin user listing
Regular-user access denial
Admin disables user
Admin deletes user
```

### Total

```text
17 tests passed
```

---

# 27. Frontend Production Build Verification

The Next.js production build has been successfully verified with:

```bash
npm run build
```

Verified stages include:

```text
Compiled successfully
Finished TypeScript
Collecting page data
Generating static pages
Finalizing page optimization
```

The project currently builds successfully using:

```text
Next.js 16.3.0
```

---

# 28. Security Rules Summary

The current system enforces the following rules:

1. JWT authentication is required for protected Backend routes.
2. Users access only their own company data.
3. Users access only financial records belonging to their company.
4. Duplicate fiscal years are blocked for the same company.
5. Reports are bound to both `report_id` and `user_id`.
6. Other users receive `404` when attempting to access another user's report.
7. Admin routes require the `admin` role.
8. Normal users are redirected away from `/admin`.
9. The Admin UI does not allow the current administrator to disable or delete their own account.
10. Backend authorization remains authoritative even if Frontend controls are bypassed.

---

# 29. Current Integration Flow

The complete current system flow is:

```text
User
  ↓
Authentication
  ↓
Company
  ↓
Financial Record
  ↓
Analysis Request
  ↓
LangGraph AI Agent
  ↓
Financial Data Validation
  ↓
Machine Learning Prediction
  ↓
Explainable AI
  ↓
Decision Support
  ↓
Preventive Recommendations
  ↓
Report Generation
  ↓
Prediction Persistence
  ↓
Recommendation Persistence
  ↓
Analysis History
  ↓
Protected Report View / Download
```

---

# 30. Contract Status

Current integration status:

```text
Authentication                 ✅
User Account                   ✅
Company/User Association       ✅
Financial Records              ✅
Duplicate Year Protection      ✅
Financial Record CRUD          ✅
LangGraph Agent                ✅
Machine Learning               ✅
Explainable AI                 ✅
Decision Support               ✅
Recommendations                ✅
Reports                        ✅
Analysis History               ✅
Report Ownership Protection    ✅
Admin Role Protection          ✅
Admin UI                       ✅
Backend Automated Tests        ✅
Frontend Production Build      ✅
```

---

## End of API Contract