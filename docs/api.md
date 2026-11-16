# AI Travel Planner - API Reference

Base URL: `http://localhost:5000/api`  
Swagger UI: `http://localhost:5000/swagger`

All responses follow the standardized `ApiResponse<T>` envelope:

```json
{
  "success": true,
  "message": "Operation completed successfully.",
  "data": { ... },
  "errors": []
}
```

---

## 1. Authentication Endpoints

### Register User
- **Method**: `POST`
- **Route**: `/api/auth/register`
- **Request Body**:
```json
{
  "fullName": "Rahul Sharma",
  "email": "rahul@example.com",
  "password": "Password123!"
}
```
- **Response**: `200 OK` with JWT token and user profile.

### Login User
- **Method**: `POST`
- **Route**: `/api/auth/login`
- **Request Body**:
```json
{
  "email": "demo@aitravelplanner.com",
  "password": "Password123!"
}
```
- **Response**: `200 OK` with JWT token.

### Current User Profile
- **Method**: `GET`
- **Route**: `/api/auth/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with user details.

---

## 2. Trip Planning Endpoints

### Plan Trip (Natural Language or Structured)
- **Method**: `POST`
- **Route**: `/api/trips/plan`
- **Auth**: Optional (supports anonymous guest planning)
- **Request Body (Natural Language)**:
```json
{
  "prompt": "I want a 4 day trip from Kolkata for 2 people under ₹30,000. I like beaches and I don't want heavy rain."
}
```
- **Request Body (Structured Parameters)**:
```json
{
  "fromCity": "Kolkata",
  "destination": "Puri",
  "budgetInRupees": 30000,
  "travellers": 2,
  "days": 4,
  "interests": "beach, seafood",
  "weatherPreference": "Avoid heavy rain"
}
```
- **Response**: `200 OK` with `TripPlanResponse` containing Destination, Hotel, Live Weather, Budget Breakdown, AI Explanation, Day-by-Day Itinerary, and Packing Tip.

### Replan Trip (AI Cost Optimization)
- **Method**: `POST`
- **Route**: `/api/trips/replan`
- **Request Body**:
```json
{
  "tripId": 1,
  "userChangeRequest": "Make it cheaper by selecting a lower-cost hotel and adjusting activities.",
  "newTargetBudget": 25000,
  "preferredDestination": null
}
```
- **Response**: `200 OK` with updated `TripPlanResponse` detailing savings and reasons.

### Save Trip to User Account
- **Method**: `POST`
- **Route**: `/api/trips/{id}/save`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

### Get User Saved Trips
- **Method**: `GET`
- **Route**: `/api/trips`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK` with list of `TripSummaryDto`.

### Delete Trip
- **Method**: `DELETE`
- **Route**: `/api/trips/{id}`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`

---

## 3. Catalog & Diagnostics

### Get All Destinations
- **Method**: `GET`
- **Route**: `/api/destinations?interest=beach`
- **Response**: `200 OK` with array of destinations, hotels, and activities.

### System Health
- **Method**: `GET`
- **Route**: `/api/health`
- **Response**: `200 OK` with status of SQL Server, Ollama, and Weather service.
