# Renta Uber Backend

## Overview
The Renta Uber backend is a RESTful API built with Node.js and TypeScript. It provides the necessary endpoints for managing drivers, vehicles, expenses, payments, reports, and contracts for a ride-hailing application.

## Features
- User authentication and authorization
- CRUD operations for drivers and vehicles
- Expense and payment management
- Report generation
- Contract management

## Technologies Used
- Node.js
- TypeScript
- Express.js
- MongoDB (or any other database of your choice)
- JWT for authentication

## Project Structure
```
renta-uber-backend
├── src
│   ├── controllers         # Contains controller files for handling requests
│   ├── models              # Contains model files for database schemas
│   ├── routes              # Contains route files for defining API endpoints
│   ├── middlewares         # Contains middleware files for request processing
│   ├── services            # Contains service files for business logic
│   ├── utils               # Contains utility files, e.g., for database connection
│   ├── app.ts              # Initializes the Express application
│   └── server.ts           # Entry point for starting the server
├── package.json            # Lists project dependencies and scripts
├── tsconfig.json           # TypeScript configuration file
└── README.md               # Project documentation
```

## Installation
1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd renta-uber-backend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Configuration
- Update the database connection settings in `src/utils/db.ts`.
- Set environment variables for sensitive information (e.g., JWT secret) in a `.env` file.

## Running the Application
1. Start the server:
   ```
   npm run start
   ```
2. The API will be available at `http://localhost:3000` (or the port specified in your configuration).

## API Documentation
Refer to the individual route files in the `src/routes` directory for detailed API endpoint information.

## Contributing
Contributions are welcome! Please submit a pull request or open an issue for any enhancements or bug fixes.

## License
This project is licensed under the MIT License.