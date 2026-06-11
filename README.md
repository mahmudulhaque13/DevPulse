# 🚀 DevPulse — Issue Tracking & User Management Engine

**Live Deployment URL:** [https://devpulse-backend-sepia.vercel.app/](https://devpulse-backend-sepia.vercel.app/)

DevPulse is a robust and modern backend engine designed to manage software development lifecycles through precise issue tracking and role-based user administration. Built entirely using **TypeScript**, **Express.js**, and hosted seamlessly on **Vercel** with a **NeonDB (PostgreSQL)** database cluster.

To optimize database resource consumption and enhance performance, this system bypasses traditional relational bottlenecks by utilizing an advanced in-memory object hydration mechanism. This successfully mirrors a classic one-to-many relationship mapping **without utilizing any SQL JOIN queries**.

---

## ✨ Core Features

- **Advanced Role-Based Access Control (RBAC):** Strict security layers and distinct permission privileges for `contributor` and `maintainer` roles.
- **No SQL JOIN Architecture:** Bypasses database-level joins by leveraging runtime memory-mapping object dictionaries to dynamically merge related data structures.
- **Secure Authentication:** Robust user onboarding featuring secure password hashing via `bcrypt` and session lifecycle security with `jsonwebtoken (JWT)`.
- **Cross-Origin Resource Sharing (CORS):** Fully configured CORS middleware preventing multi-origin pre-flight blockages across client runtimes.
- **Dynamic Filtering & Sorting:** Real-time query parameter support for filtering issues by category (`type`) and arranging timelines (`sort=oldest`).
- **Strict Data Validation:** High-level database and application constraints (e.g., ensuring issue descriptions are at least 20 characters after trimming whitespace).
- **Centralized Error Handling:** Integrated global exception middleware tracking and returning clean error codes uniformly across the entire system.

---

## 🏗️ Tech Stack

- **Language:** TypeScript (v6+)
- **Framework:** Express.js (v5+ / Native ESM Module Type)
- **Database:** PostgreSQL (Neon Cloud Pool Connection)
- **Deployment Platform:** Vercel (Serverless Node Runtime)
- **Security:** JWT (JSON Web Tokens) & Bcrypt
- **Runtime Dev Engine:** `tsx` (TypeScript Execute Watcher)

---

## 🗄️ Database Schema Summary

The database layer consists of two interconnected tables with constraints applied to protect data integrity:

### 1. `users` Table

| Column Name  | Data Type     | Constraints                                                                          |
| :----------- | :------------ | :----------------------------------------------------------------------------------- |
| `id`         | `SERIAL`      | `PRIMARY KEY`                                                                        |
| `name`       | `VARCHAR(30)` | `NOT NULL`                                                                           |
| `email`      | `TEXT`        | `NOT NULL`, `UNIQUE`                                                                 |
| `password`   | `TEXT`        | `NOT NULL`                                                                           |
| `role`       | `VARCHAR(20)` | `NOT NULL`, `DEFAULT 'contributor'`, `CHECK (role IN ('contributor', 'maintainer'))` |
| `created_at` | `TIMESTAMP`   | `DEFAULT NOW()`                                                                      |
| `updated_at` | `TIMESTAMP`   | `DEFAULT NOW()`                                                                      |

### 2. `issues` Table

| Column Name   | Data Type      | Constraints                                                                           |
| :------------ | :------------- | :------------------------------------------------------------------------------------ |
| `id`          | `SERIAL`       | `PRIMARY KEY`                                                                         |
| `title`       | `VARCHAR(150)` | `NOT NULL`                                                                            |
| `description` | `TEXT`         | `NOT NULL`, `CHECK (LENGTH(TRIM(description)) >= 20)`                                 |
| `type`        | `TEXT`         | `NOT NULL`, `CHECK (type IN ('bug', 'feature_request'))`                              |
| `status`      | `TEXT`         | `NOT NULL`, `DEFAULT 'open'`, `CHECK (status IN ('open', 'in_progress', 'resolved'))` |
| `reporter_id` | `INTEGER`      | `NOT NULL`                                                                            |
| `created_at`  | `TIMESTAMP`    | `DEFAULT NOW()`                                                                       |
| `updated_at`  | `TIMESTAMP`    | `DEFAULT NOW()`                                                                       |

---

## 🚀 Local Installation & Setup

### 1. Clone the Repository & Install Dependencies

```bash
git clone [https://github.com/mahmudulhaque13/DevPulse.git](https://github.com/mahmudulhaque13/DevPulse.git)
cd DevPulse
npm install

```

### 2. Configure Environment Variables

Create a `.env` file in the root directory of your project and populate it with the following parameters:

```env
PORT=5000
CONNECTION_STRING=your_neon_postgresql_connection_string
ACCESS_SECRET=your_jwt_super_secret_key_2026

```

### 3. Run the Application Locally

```bash
# Start development mode with tsx hot reloading
npm run dev

```

---

## 🔌 API Endpoints Reference

### 1. Authentication Module

| Method | Endpoint           | Access | Description                                                     |
| ------ | ------------------ | ------ | --------------------------------------------------------------- |
| `POST` | `/api/auth/signup` | Public | Registers a new user account (`role: contributor / maintainer`) |
| `POST` | `/api/auth/login`  | Public | Validates credentials and issues a secure access token (JWT)    |

### 2. Issue Tracking Module

| Method   | Endpoint          | Access  | Description                                                                |
| -------- | ----------------- | ------- | -------------------------------------------------------------------------- |
| `POST`   | `/api/issues`     | Private | Submits a new bug or feature request (Bearer Token mandatory)              |
| `GET`    | `/api/issues`     | Public  | Retrieves all issues (Supports `?type=bug` & `?sort=oldest` filters)       |
| `GET`    | `/api/issues/:id` | Public  | Fetches detailed view of a specific issue with hydrated user details       |
| `PATCH`  | `/api/issues/:id` | Private | Updates issue details (Business constraints and role-guard protected)      |
| `DELETE` | `/api/issues/:id` | Private | Removes an issue from the engine (Ownership or Maintainer status required) |

### 3. User Administration Module

| Method | Endpoint     | Access          | Description                                                     |
| ------ | ------------ | --------------- | --------------------------------------------------------------- |
| `GET`  | `/api/users` | Maintainer Only | Fetches the full profile listing of all registered system users |

---

## 🛡️ Core Business Rules & Validations

1. **Description Character Boundary:** Every issue creation or modification requires the `description` string to be a minimum of **20 characters long** after trimming surrounding whitespaces.
2. **Contributor Tier Restriction:** A user assigned to a `contributor` role is authorized to update or delete _only_ the issues they created. They are completely restricted from changing the `status` workflow of any issue.
3. **Maintainer Tier Privileges:** Only users flagged as a `maintainer` hold administrative rights to change issue states (`open`, `in_progress`, `resolved`), delete any issue, or query the master registry list of all platform accounts.

```

```
