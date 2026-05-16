<div align="center">
  <h1>🌟 Northstar</h1>
  <p><b>Enterprise Goal Setting, Alignment & Governance Portal</b></p>
  
  [![AtomQuest Hackathon](https://img.shields.io/badge/AtomQuest-Hackathon_1.0-blueviolet?style=for-the-badge)](https://#)
  [![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
  [![Supabase](https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
</div>

> **AtomQuest Hackathon 1.0 Submission**
> An intelligent, end-to-end platform for organizational alignment, continuous performance tracking, and automated governance.

---

## 📖 The Problem
Organizations relying on manual or fragmented goal-tracking methods struggle with alignment, visibility, and accountability. Spreadsheets create blind spots, managers cannot monitor real-time progress, and employees lack clarity on how their work connects to the bigger picture.

## 🚀 The Solution: Northstar
**Northstar** is a structured, digital Goal Setting & Tracking Portal that eliminates these pain points. It supports the full lifecycle of employee goals—from AI-assisted creation and manager approvals to quarterly check-ins and executive analytics—while remaining intuitive, reliable, and entirely audit-ready.

## ✨ Key Features
* 🔐 **Role-Based Access Control:** Distinct, secure workflows for Employees, Managers (L1), and Admin/HR.
* 🎯 **Smart Goal Creation:** Define targets, Thrust Areas, and Weightages (enforcing a strict 100% total validation system).
* 🤖 **AI Goal Generator (Bonus):** Context-aware SMART goal suggestions tailored instantly to user roles.
* ✍️ **Approval & Locking Engine:** Managers can edit, return, or approve goals. Approved goals are cryptographically locked against unauthorized edits.
* 🏢 **Shared Departmental KPIs:** Managers can push locked, high-level company goals to multiple employees simultaneously.
* 📊 **Quarterly Check-ins & Math Engine:** Dynamic progress tracking based on specific Units of Measurement (Min, Max, Zero-based).
* 📜 **Immutable Audit Trail:** Complete governance logs tracking every status change, edit, and approval for HR compliance.
* 🚨 **Automated Escalation Engine (Bonus):** Rule-based system that scans for and flags overdue "Draft" goals.
* 📈 **Executive Analytics (Bonus):** Interactive Recharts dashboard featuring QoQ trends, Manager Effectiveness, and Goal Distribution.

---

## 📸 Screenshots

*(Note: Replace these placeholder links with actual images of your app! Just drop your screenshots into a `/public/docs/` folder in your repo)*

| Employee Dashboard | Manager Portal |
| :---: | :---: |
| <img src="[https://placehold.co/600x400/png?text=Employee+Dashboard](https://placehold.co/600x400/png?text=Employee+Dashboard)" alt="Employee Dashboard" width="100%"> | <img src="[https://placehold.co/600x400/png?text=Manager+Portal](https://placehold.co/600x400/png?text=Manager+Portal)" alt="Manager Portal" width="100%"> |

| Executive Analytics | Admin Audit Trail |
| :---: | :---: |
| <img src="[https://placehold.co/600x400/png?text=Executive+Analytics](https://placehold.co/600x400/png?text=Executive+Analytics)" alt="Analytics Dashboard" width="100%"> | <img src="[https://placehold.co/600x400/png?text=Audit+Trail](https://placehold.co/600x400/png?text=Audit+Trail)" alt="Admin Logs" width="100%"> |

---

## 🛠️ Tech Stack

**Client:** * Next.js (React)
* Tailwind CSS
* shadcn/ui (Radix Primitives)
* Recharts (Data Visualization)
* Sonner (Toast Notifications)

**Server:** * Python 3.10+
* FastAPI
* SQLAlchemy (ORM)

**Database:** * Supabase (PostgreSQL)

---

## 🏗️ System Architecture

```mermaid
graph TD
    %% User Roles
    subgraph Users ["User Personas (Role-Based Access)"]
        E[Employee]
        M[Manager L1]
        A[Admin / HR]
    end

    %% Frontend
    subgraph Frontend ["Frontend Application (Next.js & React)"]
        UI[User Interface & State Management]
        Charts[Recharts Analytics Engine]
        UI --> Charts
    end

    %% Backend
    subgraph Backend ["Backend API (Python FastAPI)"]
        API[RESTful API Router]
        Logic[Business Logic & Math Validation]
        Escalation[Rule-Based Escalation Engine]
        API --> Logic
        API --> Escalation
    end

    %% Database
    subgraph Database ["Database (Supabase / PostgreSQL)"]
        DB[(Relational Tables)]
        Audit[(Immutable Audit Ledger)]
    end

    %% Connections
    E -->|Creates Goals & Check-ins| UI
    M -->|Approves & Pushes KPIs| UI
    A -->|Views Analytics & Logs| UI

    UI <-->|JSON over HTTP| API
    Logic <-->|SQLAlchemy ORM| DB
    Escalation -->|Writes Overdue Flags| DB
    Logic -->|Triggers on Edit| Audit
```

---

## 🔑 Role-Based Demo Access

To facilitate seamless testing for hackathon judges, this demo utilizes a **Global Navigation Architecture** rather than a hard-locked authentication wall. 

Judges can experience the entire product lifecycle by using the top navigation bar to instantly switch between user personas:
1. **Employee View (`/`):** Create goal sheets, utilize the AI generator, and submit quarterly check-ins.
2. **Manager View (`/manager`):** Review pending goals, add feedback, push Shared KPIs, and approve/lock sheets.
3. **Admin/HR View (`/admin`):** Run the automated Escalation Engine and export the immutable Audit Log to CSV.
4. **CXO View (`/analytics`):** View the interactive alignment visualizer and organizational metrics.

---

## 💻 Local Installation & Setup

### 1. Backend Setup (FastAPI)
Navigate to the backend directory and set up your Python environment:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt
```

Create a `.env` file in the backend directory and add your Supabase connection string:
```env
DATABASE_URL="postgresql://postgres.[YOUR_PROJECT_REF]:[YOUR_PASSWORD]@aws-0-us-west-1.pooler.supabase.com:6543/postgres"
```

Start the Python server:
```bash
uvicorn main:app --reload
```
*The backend will run on `http://localhost:8000`*

### 2. Frontend Setup (Next.js)
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Next.js development server:
```bash
npm run dev
```
*The frontend will run on `http://localhost:3000`*

---

## 🎯 Hackathon Deliverables Checklist
- [x] **Phase 1:** Goal Creation, Validation, and Manager Approvals.
- [x] **Phase 2:** Quarterly Check-ins and Math computations.
- [x] **Reporting:** Immutable Audit Logs and CSV Exports.
- [x] **Bonus 5.3:** Rule-based Escalation Module.
- [x] **Bonus 5.4:** Comprehensive Analytics Module.
