# VOLP Notification Agent

A Node.js backend bot that monitors assignment deadlines on the [VOLP](https://classroom.volp.in) e-learning platform and delivers push notifications to an Android device via **Firebase Cloud Messaging (FCM)**.

---

## How It Works

The bot runs as a persistent server that:

1. **Authenticates** with the VOLP platform using your account credentials
2. **Fetches** all enrolled courses and their assignments
3. **Stores** the data locally in a MySQL database
4. **Classifies** each unsubmitted assignment by deadline urgency
5. **Sends FCM data messages** to the target Android device to schedule or cancel local notifications

This cycle runs automatically every **4 hours**, but only during VOLP's active window (**06:00 – 23:30 IST**).

---

## Architecture

```
VOLP_Backend/
├── API/
│   └── api.js                  # VOLP platform HTTP client
├── db/
│   ├── database.js             # MySQL connection pool
│   ├── assignments.js          # Assignment queries
│   ├── courses.js              # Course queries
│   └── notifications.js        # Notification log queries
├── server/
│   ├── server.js               # Express app entry point
│   ├── middleware/
│   │   └── auth.js             # Bearer token auth middleware
│   └── routes/
│       ├── assignments.js      # GET /api/assignments
│       ├── courses.js          # GET /api/courses
│       └── notifications.js    # GET /api/notifications
├── services/
│   ├── date.js                 # VOLP date format parser
│   ├── deadline.js             # Deadline status classifier
│   ├── firebase.js             # FCM message sender
│   ├── notification.js         # Notification processing logic
│   ├── notificationSchedule.js # Future notification time calculator
│   └── parser.js               # VOLP API response transformer
└── sync/
    ├── schedule.js             # VOLP availability window checker
    ├── scheduler.js            # Auto-sync loop (every 4 hours)
    └── sync.js                 # Full sync orchestrator
```

---

## Data Flow

```
Server Start
    └─► startScheduler()
            │
            ├─► isVOLPAvailable()? (06:00–23:30 IST)
            │       └─ No  ──► Skip
            │       └─ Yes ──► sync()
            │                    ├─► login() ──► VOLP API
            │                    ├─► getCourses() ──► parseCourses() ──► saveCourse()
            │                    └─► getAssignmentList() ──► parseAssignments() ──► saveAssignment()
            │
            ├─► processCancellations()
            │       └─► Find submitted assignments with no CANCELLED notification
            │               └─► sendCancelNotification() via FCM
            │                       └─► recordNotification(CANCELLED)
            │
            └─► processNotifications()
                    └─► getDeadlineInfo() ──► classify each assignment
                            └─► Filter: APPROACHING / URGENT / CRITICAL
                                    └─► Check notifications table (avoid duplicates)
                                            └─► sendScheduleNotification() via FCM
                                                    └─► recordNotification(status)
```

---

## Deadline Classification

Unsubmitted assignments are classified based on time remaining until `due_date`:

| Status | Condition | FCM Action |
|---|---|---|
| `NO_DEADLINE` | `due_date` is null | — |
| `UPCOMING` | > 72 hours remaining | — |
| `APPROACHING` | ≤ 72 hours remaining | Schedule notification at `due_date - 3 days` |
| `URGENT` | ≤ 24 hours remaining | Schedule notification at `due_date - 24 hours` |
| `CRITICAL` | ≤ 6 hours remaining | Schedule notification at `due_date - 6 hours` |
| `OVERDUE` | Past `due_date` | — |

When an assignment is submitted, a `CANCEL` FCM message is sent so the Android app can cancel any pending local notifications.

---

## Database Schema

### `courses`
| Column | Type | Notes |
|---|---|---|
| `course_id` | INT | Primary key |
| `course_offering_learner_id` | INT | |
| `code` | VARCHAR | Short course code |
| `name` | VARCHAR | Full course name |
| `description` | TEXT | |
| `professor` | VARCHAR | Instructor name |
| `last_seen` | DATETIME | |
| `progress` | DECIMAL | Completion percentage |
| `active` | TINYINT | Boolean flag |
| `allow_assessment` | TINYINT | Boolean flag |
| `archived` | TINYINT | Boolean flag |
| `last_synced_at` | DATETIME | Auto-updated on upsert |

### `assignments`
| Column | Type | Notes |
|---|---|---|
| `assignment_id` | INT | Primary key |
| `course_id` | INT | Foreign key → courses |
| `marks` | DECIMAL | Total marks/weightage |
| `submitted` | TINYINT | Boolean flag |
| `question` | TEXT | Assignment question |
| `due_date` | DATETIME | Deadline |
| `grace_date` | DATETIME | Grace period end |
| `graded` | TINYINT | Boolean flag |
| `evaluated` | TINYINT | Boolean flag |
| `score` | DECIMAL | Marks obtained |
| `submission_file` | VARCHAR | |
| `submission_path` | VARCHAR | |
| `last_synced_at` | DATETIME | Auto-updated on upsert |

### `notifications`
| Column | Type | Notes |
|---|---|---|
| `id` | INT | Primary key (auto increment) |
| `assignment_id` | INT | Foreign key → assignments |
| `notification_type` | VARCHAR | `APPROACHING` / `URGENT` / `CRITICAL` / `CANCELLED` |

---

## REST API

All endpoints except `/api/health` require a `Bearer` token in the `Authorization` header.

```
Authorization: Bearer <APP_API_KEY>
```

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check — no auth required |
| `GET` | `/api/assignments` | All upcoming and overdue assignments with deadline status |
| `GET` | `/api/courses` | All courses, sorted by name |
| `GET` | `/api/notifications` | Full future notification schedule for all assignments |

### Example Responses

**`GET /api/assignments`**
```json
{
  "assignments": [
    {
      "assignmentId": 12345,
      "courseId": 678,
      "marks": 10,
      "submitted": false,
      "question": "Describe the OSI model.",
      "dueDate": "2026-08-22T18:30:00.000Z",
      "graceDate": null,
      "graded": false,
      "evaluated": false,
      "score": null,
      "status": "URGENT",
      "timeRemaining": 72000000
    }
  ]
}
```

**`GET /api/notifications`**
```json
{
  "notifications": [
    {
      "assignmentId": 12345,
      "type": "APPROACHING",
      "scheduledFor": "2026-08-19T18:30:00.000Z"
    },
    {
      "assignmentId": 12345,
      "type": "URGENT",
      "scheduledFor": "2026-08-21T18:30:00.000Z"
    }
  ]
}
```

---

## FCM Message Format

The server sends **data-only** FCM messages to the Android app. The app is responsible for scheduling or cancelling local notifications based on the `action` field.

**Schedule message:**
```json
{
  "action": "SCHEDULE",
  "assignmentId": "12345",
  "type": "URGENT",
  "scheduledFor": "1724259000000",
  "title": "Assignment due within 24 hours",
  "body": "Assignment 12345 is due on 8/22/2026, 12:00:00 AM."
}
```

**Cancel message:**
```json
{
  "action": "CANCEL",
  "assignmentId": "12345"
}
```

---

## Setup & Configuration

### Prerequisites
- Node.js v18+
- MySQL database
- A Firebase project with Cloud Messaging enabled
- A Firebase service account JSON file
- A VOLP student account

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root:

```env
# Server
PORT=3000
APP_API_KEY=your_secret_api_key

# VOLP Credentials
VOLP_EMAIL=your_volp_email
VOLP_PASSWORD=your_volp_password

# MySQL Database
DB_HOST=localhost
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=volp_bot

# Firebase
FIREBASE_SERVICE_ACCOUNT=./volp-notification-agent-firebase-service-token.json
FCM_DEVICE_TOKEN=your_android_device_fcm_token
```

### 3. Set up the database

Create the required tables in your MySQL database:

```sql
CREATE TABLE courses (
    course_id INT PRIMARY KEY,
    course_offering_learner_id INT,
    code VARCHAR(50),
    name VARCHAR(255),
    description TEXT,
    professor VARCHAR(255),
    last_seen DATETIME,
    progress DECIMAL(5,2),
    active TINYINT(1),
    allow_assessment TINYINT(1),
    archived TINYINT(1),
    last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY,
    course_id INT,
    marks DECIMAL(10,2),
    submitted TINYINT(1),
    question TEXT,
    due_date DATETIME,
    grace_date DATETIME,
    graded TINYINT(1),
    evaluated TINYINT(1),
    score DECIMAL(10,2),
    submission_file VARCHAR(255),
    submission_path VARCHAR(500),
    last_synced_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(course_id)
);

CREATE TABLE notifications (
    id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT,
    notification_type VARCHAR(50),
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_notification (assignment_id, notification_type),
    FOREIGN KEY (assignment_id) REFERENCES assignments(assignment_id)
);
```

### 4. Add your Firebase service account

Place your Firebase service account JSON file in the project root and set the `FIREBASE_SERVICE_ACCOUNT` path in `.env` accordingly.

### 5. Start the server

```bash
node server/server.js
```

The server will:
- Start listening on the configured port
- Immediately run a full VOLP sync (if within the 06:00–23:30 IST window)
- Repeat the sync every 4 hours automatically

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| `express` | ^5.2.1 | HTTP server framework |
| `mysql2` | ^3.23.3 | MySQL client with promise support |
| `firebase-admin` | ^14.3.0 | Firebase Admin SDK for FCM |
| `axios` | ^1.19.0 | HTTP client for VOLP API |
| `dotenv` | ^17.4.2 | Environment variable loading |

---

## ⚠️ Important Note

The backend server is fully functional — it syncs data from VOLP, classifies deadlines, and dispatches FCM messages correctly. However, **the Android app that receives and acts on these FCM messages was never built**, due to limited experience in mobile app development at the time of this project.

As a result, the `SCHEDULE` and `CANCEL` data messages are sent by the server but have no client-side handler to process them. This project is effectively the complete backend half of a notification system that requires a companion Android app to be fully operational.

---

## Author

**Shroojan Dhok**
