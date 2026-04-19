# Rental App

This project currently keeps the backend intentionally simple.

## Active backend modules

- `auth`: register, login, profile, password change
- `properties`: create, list, view, update, delete properties
- `bookings`: create, list, view, approve, reject, allocate, cancel bookings

## Removed for now

The following backend modules were intentionally removed to keep development focused:

- payments
- notifications
- reports

## Backend structure

- [backend/src/app.js](c:/Users/ShadowStrike/Desktop/Rental%20App/backend/src/app.js:1) mounts only stable routes.
- [backend/src/controllers](c:/Users/ShadowStrike/Desktop/Rental%20App/backend/src/controllers) contains active controller logic.
- [backend/src/routes](c:/Users/ShadowStrike/Desktop/Rental%20App/backend/src/routes) contains the active Express routes.
- [backend/server.js](c:/Users/ShadowStrike/Desktop/Rental%20App/backend/server.js:1) starts the API server.

## Rule for future additions

When adding a new backend feature in the future:

1. Add the model, controller, and route only when the feature is actually needed.
2. Keep the feature self-contained and avoid coupling core flows to optional modules.
3. Mount the new route in [backend/src/app.js](c:/Users/ShadowStrike/Desktop/Rental%20App/backend/src/app.js:1) only after the controller works.
4. Update this README to list the new active module.
5. If the feature is incomplete, leave it out of `app.js` until it is ready.

## Current goal

The current backend should stay focused on authentication, properties, and bookings until those flows are fully stable.
