# MongoDB Setup Guide for HRM Node (Logging)

## Overview

This setup configures MongoDB for logging purposes while keeping PostgreSQL for main application data.

## Installation Steps

### 1. Install Required Packages

Run the following command in your terminal:

```bash
npm install @nestjs/mongoose mongoose
```

### 2. Environment Setup

Update your `.env` file with the MongoDB connection string:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=hrm_db
DB_DRIVER=postgres
MONGODB_URI=mongodb://localhost:27017/hrm_logs
PORT=3456
NODE_ENV=development
```

**Important:** Update with your actual database credentials.

### 3. Database Connections

The application now connects to both databases:
- **PostgreSQL**: For main application data (nhan-su entities)
- **MongoDB**: For logging HTTP requests and errors

Configured in:
- `src/database/database.module.ts` - Both TypeORM and Mongoose modules
- `src/config/configuration.ts` - Configuration for both databases

### 4. Logging Features

- **Automatic HTTP Logging**: All requests are logged to MongoDB with details like method, URL, response time, status code, etc.
- **Error Logging**: Exceptions are captured and stored in MongoDB
- **Log Schema**: Includes level, message, timestamp, context, user info, and metadata

### 5. Log Management

The `LogService` provides methods to:
- Create logs
- Query logs by level or context
- Delete old logs (cleanup utility)

### 6. Start the Application

After installing dependencies and setting up the environment:

```bash
npm run start:dev
```

The application will connect to both PostgreSQL and MongoDB, with all HTTP requests automatically logged to MongoDB.