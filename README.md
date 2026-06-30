# CodeAlpha Job Board Platform - Backend

A production-ready REST API for a Job Board Platform built with **Node.js**, **Express.js**, **PostgreSQL**, and **Prisma ORM**.

---

## 🚀 Features

### Authentication
- JWT-based authentication
- Role-based authorization (Employer & Candidate)
- Secure password hashing with bcrypt

### Employer Features
- Register & Login
- Create, Update, and Delete Job Posts
- View Applicants
- Manage Application Status

### Candidate Features
- Register & Login
- Browse Available Jobs
- Search & Filter Jobs
- Upload Resume
- Apply for Jobs
- View Application Status

### Additional Features
- Pagination
- Search & Filtering
- File Upload with Multer
- Input Validation
- Docker Support

---

## 🛠 Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Prisma ORM
- JWT Authentication
- bcrypt
- Multer
- Express Validator
- Docker & Docker Compose

---

## 📁 Project Structure

```text
codealpha-jobboard/
│
├── src/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   ├── app.js
│   └── server.js
│
├── prisma/
│   └── schema.prisma
│
├── uploads/
│
├── .env
├── .env.example
├── .gitignore
├── Dockerfile
├── docker-compose.yml
├── package.json
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current authenticated user |

---

### Jobs

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/jobs` | Browse jobs (pagination, search, filtering) |
| GET | `/api/jobs/:id` | Get job details |
| GET | `/api/jobs/employer` | Get employer's jobs |
| POST | `/api/jobs` | Create a new job *(Employer only)* |
| PUT | `/api/jobs/:id` | Update a job *(Employer only)* |
| DELETE | `/api/jobs/:id` | Delete a job *(Employer only)* |

---

### Applications

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/applications/apply` | Apply for a job *(Candidate only)* |
| GET | `/api/applications/my` | View my applications |
| GET | `/api/applications/job/:jobId` | View job applicants *(Employer only)* |
| PUT | `/api/applications/:id/status` | Update application status *(Employer only)* |
| GET | `/api/applications/stats` | Get application statistics *(Employer only)* |

---

### Users

| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/profile` | Get user profile |
| POST | `/api/users/resume` | Upload resume *(Candidate only)* |

---

# ⚙️ Installation

## Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally)

---

## Run with Docker

```bash
docker-compose up --build
```

---

## Run Locally

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

```bash
cp .env.example .env
```

Update the `.env` file with your own configuration.

### Run Prisma Migration

```bash
npx prisma migrate dev
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Start Development Server

```bash
npm run dev
```

---

# 🌍 Environment Variables

Example:

```env
DATABASE_URL="postgresql://postgres:password@localhost:5432/jobboard"

JWT_SECRET=your_super_secret_key

PORT=5000
```

---

# 🗄 Database Models

## User

- id
- name
- email
- password
- role *(EMPLOYER / CANDIDATE)*
- company

---

## Job

- id
- title
- description
- location
- salaryMin
- salaryMax
- type
- category
- isActive

---

## Application

- id
- status
- coverLetter
- appliedAt

**Relationship**

- User ⟷ Job *(Many-to-Many)*

---

## Resume

- id
- fileName
- fileUrl

**Relationship**

- User ⟷ Resume *(One-to-One)*

---

# 🧪 Testing

Health Check

```bash
curl http://localhost:5000/health
```

You can also test the API using:

- Postman
- Insomnia
- Thunder Client

---

# 🔒 Production Considerations

Before deploying:

- Use a strong JWT secret.
- Enable HTTPS.
- Configure secure CORS policies.
- Use environment-specific configurations.
- Implement rate limiting.
- Add logging and monitoring.
- Use database connection pooling.
- Validate all incoming requests.
- Store uploaded files securely.

---

# 👨‍💻 Author

Developed as part of the **CodeAlpha Backend Development Internship**.