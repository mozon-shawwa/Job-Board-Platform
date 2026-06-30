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
| PUT | `/api/jobs/:id` | Update a job *(Employer only, owner only)* |
| DELETE | `/api/jobs/:id` | Delete a job *(Employer only, owner only)* |
 
> **Note:** A job cannot be deleted while it has existing applications.
> The API returns `409 Conflict` in that case — deactivate the job instead
> by setting `isActive: false` via the update endpoint.
 
---
 
### Applications
 
| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/applications/apply` | Apply for a job *(Candidate only)* |
| GET | `/api/applications/my` | View my applications *(Candidate)* |
| GET | `/api/applications/job/:jobId` | View job applicants *(Employer only, owner only)* |
| PUT | `/api/applications/:id/status` | Update application status *(Employer only, owner only)* |
| GET | `/api/applications/stats` | Get application statistics *(Employer only)* |
 
> **Note:** A candidate can apply to the same job only once.
> A duplicate application attempt returns `409 Conflict`.
 
---
 
### Users
 
| Method | Endpoint | Description |
|---------|----------|-------------|
| GET | `/api/users/profile` | Get full user profile (jobs/applications/resume included) |
| POST | `/api/users/resume` | Upload resume *(Candidate only, PDF/DOC/DOCX, max 5MB)* |
 
---
 
# ⚙️ Installation
 
## Prerequisites
 
- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)
---
 
## Run with Docker (recommended)
 
```bash
docker-compose up --build -d
```
 
This starts two services:
- `postgres` — PostgreSQL 15 database
- `app` — the API server, which automatically runs `prisma migrate deploy`
  on startup via `docker-entrypoint.sh` before starting the server
> The first migration must exist in `prisma/migrations/` before building
> the image. If it doesn't exist yet, generate it locally first:
> ```bash
> docker-compose up -d postgres
> cp .env.example .env
> npm install
> npx prisma generate
> npx prisma migrate dev --name init
> ```
> Then build the full stack with `docker-compose up --build -d`.
 
Check status:
```bash
docker-compose ps
docker-compose logs app
```
 
---
 
## Run Locally (without Docker)
 
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
npx prisma migrate dev --name init
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
DATABASE_URL="postgresql://postgres:postgres123@localhost:5432/codealpha_jobboard?schema=public"
 
JWT_SECRET="your_super_secret_jwt_key_change_in_production"
 
PORT=5000
```
 
> Values must match the `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB`
> defined in `docker-compose.yml` when running the database via Docker.
 
---
 
# 🗄 Database Models
 
## User
 
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| email | String | Unique |
| password | String | Hashed with bcrypt |
| name | String | |
| role | Enum | `EMPLOYER` \| `CANDIDATE` |
| company | String? | Required only for employers |
| createdAt | DateTime | |
| updatedAt | DateTime | |
 
---
 
## Job
 
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| title | String | |
| description | String | |
| location | String | |
| salaryMin | Int? | Optional |
| salaryMax | Int? | Optional |
| type | Enum | `FULL_TIME`, `PART_TIME`, `CONTRACT`, `INTERNSHIP`, `REMOTE` |
| category | String | |
| isActive | Boolean | Defaults to `true`; used for soft-disabling instead of deleting |
| employerId | UUID | Foreign key → User |
| createdAt | DateTime | |
| updatedAt | DateTime | |
 
---
 
## Application
 
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| status | Enum | `PENDING`, `REVIEWING`, `SHORTLISTED`, `REJECTED`, `HIRED` |
| coverLetter | String? | Optional |
| candidateId | UUID | Foreign key → User |
| jobId | UUID | Foreign key → Job |
| appliedAt | DateTime | |
| updatedAt | DateTime | |
 
**Relationships**
 
`Application` is the explicit join table that connects `User` (candidates)
and `Job` in a many-to-many relationship, while also storing extra data
specific to each application (`status`, `coverLetter`, timestamps).
 
- One `User` (candidate) → many `Application`
- One `Job` → many `Application`
- A `(candidateId, jobId)` pair is unique — a candidate cannot apply to the
  same job twice
---
 
## Resume
 
| Field | Type | Notes |
|---|---|---|
| id | UUID | Primary key |
| fileName | String | Original uploaded file name |
| fileUrl | String | Path to the stored file under `/uploads` |
| candidateId | UUID | Foreign key → User, unique |
| uploadedAt | DateTime | |
 
**Relationship**
 
- One `User` (candidate) ⟷ one `Resume` (one-to-one)
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
- curl
A typical manual test flow:
 
1. Register an employer and a candidate
2. Login as the employer, create a job
3. Browse/search/filter jobs as a guest (no auth required)
4. Login as the candidate, upload a resume, apply to the job
5. Login as the employer, view applicants, update application status
6. Verify role-based protections (e.g. a candidate cannot create jobs,
   an employer cannot update/delete another employer's job)
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
- Store uploaded files securely (consider cloud storage instead of local disk).
---
 
# 👨‍💻 Author
 
Developed as part of the **CodeAlpha Backend Development Internship**.
