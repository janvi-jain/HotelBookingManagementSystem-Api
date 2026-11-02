# Hotel Booking Management System API

A RESTful API built with **Node.js, Express.js, and MongoDB** to manage hotel information, room inventory, user roles, approval workflows, and hotel bookings.

## Features

- **Authentication:** User registration and login using JWT authentication.
- **Role-Based Access Control:** Separate permissions for Admin, Hotel Manager, and Guest.
- **User Management:** Manage users according to their roles and access permissions.
- **Hotel Management:** Hotel Managers can create and manage their hotel profiles.
- **Room Type Management:** Admins can create, update, view, and delete room types.
- **Room Management:** Hotel Managers can manage rooms associated with their hotels.
- **Approval Workflow:** Admins can approve or reject hotels and rooms before they become available for booking.
- **Booking Management:** Guests can create bookings, while authorized users can view and manage bookings according to their permissions.
- **Booking Validation:** Validate booking dates and check for overlapping bookings for the same room.
- **Image Uploads:** Upload hotel and room images using Multer.

## Tech Stack

- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **ODM:** Mongoose
- **Authentication:** JSON Web Tokens (JWT)
- **Password Hashing:** bcrypt
- **File Uploads:** Multer
- **API Testing:** Postman

## User Roles

| Role | Responsibilities |
|---|---|
| Admin | Manage users, manage room types, and approve or reject hotels and rooms. |
| Hotel Manager | Create and manage their own hotel and rooms, subject to ownership and approval rules. |
| Guest | Access permitted features and create and view their own bookings. |

## Project Structure

The project is organized into separate modules for routes, controllers, models, and middleware.

```text
HotelBookingManagementSystem-Api/
├── controllers/
│   ├── bookings/
│   ├── hotels/
│   ├── rooms/
│   ├── roomTypes/
│   └── users/
├── middleware/
│   ├── auth/
│   └── uploadMiddleware/
├── models/
│   ├── bookings/
│   ├── hotels/
│   ├── rooms/
│   ├── roomTypes/
│   └── users/
├── routes/
├── upload/
├── .env
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

*Note: The folder names above represent the intended module organization; adjust them to match the actual folders in your repository.*

## Getting Started

### Prerequisites

Make sure you have installed:

- Node.js
- npm
- MongoDB, locally or through MongoDB Atlas
- Postman (for API testing)

### 1. Clone the Repository

```bash
git clone https://github.com/janvi-jain/HotelBookingManagementSystem-Api.git
cd HotelBookingManagementSystem-Api
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root.

```env
PORT=3001
MODE=development
DEV_DB_URL=mongodb://localhost:27017/HotelManagement
PRD_DB_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Replace the sample values with your own configuration. Keep actual credentials private and never commit your `.env` file to GitHub.

### 4. Start the Server

Use the start command configured in your `package.json`. If your project runs directly through `server.js`, you can use:

```bash
node server.js
```

The API uses port `3001` by default, based on the current project configuration.

Base URL:

```text
http://localhost:3001/api
```

## API Modules

The API is organized around the following modules:

| Module | Purpose |
|---|---|
| Authentication | Registration, login, and token-based authentication |
| Users | Role-based user management |
| Hotels | Hotel creation, management, and approval |
| Room Types | Room type management by Admin |
| Rooms | Room creation, management, image uploads, and approval |
| Bookings | Booking creation, retrieval, updates, and deletion according to role permissions |

Protected endpoints require a valid JWT Bearer token. Access is restricted according to the user's role and, where applicable, ownership of the hotel or booking.

## Hotel and Room Approval

Hotels and rooms submitted by Hotel Managers follow an approval workflow.

- Admins can approve or reject submitted hotels and rooms.
- Only approved hotels and rooms should be available for booking.
- Rejected items can be submitted for approval again according to the implemented workflow.

## Image Uploads

Hotel and room images are uploaded using Multer.

For image upload requests, use `multipart/form-data` in Postman and provide the image through the `image` field.

Uploaded files are stored in the configured upload directory, and the associated filename is saved in the database.

## Testing

Use Postman to test the API endpoints.

For protected routes:

1. Select the required HTTP method and endpoint.
2. Add a valid JWT using **Authorization → Bearer Token**.
3. Provide the required request body.
4. For image uploads, select **Body → form-data** and set the `image` field type to **File**.
5. Verify the response and status code.

## Security

- Passwords are hashed before storage.
- JWT authentication protects restricted routes.
- Role-based middleware controls access to protected resources.
- Environment variables are used for sensitive configuration.
- Database credentials and JWT secrets should never be committed to version control.

## Author

**Janvi Jain**

GitHub: [janvi-jain](https://github.com/janvi-jain)

LinkedIn: [Janvi Jain](https://www.linkedin.com/in/janvi-jain-86111a374/)
