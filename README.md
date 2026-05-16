# 🌟 Northstar | Enterprise Goal Setting & Tracking Portal

> **AtomQuest Hackathon 1.0 Submission**
> An intelligent, end-to-end platform for organizational alignment, continuous performance tracking, and automated governance.

---

## 📖 The Problem
Organizations relying on manual or fragmented goal-tracking methods struggle with alignment, visibility, and accountability. Spreadsheets create blind spots, managers cannot monitor real-time progress, and employees lack clarity on how their work connects to the bigger picture.

## 🚀 The Solution: Northstar
Northstar is a structured, digital Goal Setting & Tracking Portal that eliminates these pain points. It supports the full lifecycle of employee goals—from AI-assisted creation and manager approvals to quarterly check-ins and executive analytics—while remaining intuitive, reliable, and entirely audit-ready.

### ✨ Key Features (PRD Compliant)
* **Role-Based Access Control:** Distinct workflows for Employees, Managers (L1), and Admin/HR.
* **Smart Goal Creation:** Define targets, Thrust Areas, and Weightages (enforcing strict 100% total validation).
* **AI Goal Generator (Bonus):** Context-aware SMART goal suggestions tailored to user roles.
* **Approval & Locking Engine:** Managers can edit, return, or approve goals. Approved goals are cryptographically locked.
* **Shared Departmental KPIs:** Managers can push locked company goals to multiple employees simultaneously.
* **Quarterly Check-ins & Math Computation:** Dynamic progress tracking based on specific Units of Measurement (Min, Max, Zero-based).
* **Immutable Audit Trail:** Complete governance logs tracking every status change, edit, and approval.
* **Automated Escalation Engine (Bonus):** Rule-based system that scans for and flags overdue "Draft" goals.
* **Executive Analytics (Bonus):** Interactive dashboard featuring QoQ trends, Manager Effectiveness, and Goal Distribution.

---

## 🛠️ Technology Stack
* **Frontend:** Next.js (React), Tailwind CSS, shadcn/ui, Recharts (Data Visualization).
* **Backend:** Python, FastAPI, SQLAlchemy.
* **Database:** Supabase (PostgreSQL).

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
