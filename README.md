# 🧭 Kanban To-Do Dashboard

A modern **Kanban board** built with **Next.js 16**, **React 19**, **React Query**, and **TypeScript**.  
It allows you to create, edit, delete, move, and reorder tasks easily with real-time optimistic UI updates.  
All data is served locally via **JSON Server**.

---

## 🚀 Features

✅ Task CRUD (Create / Read / Update / Delete)  
✅ Move tasks between columns (Backlog → In Progress → Done)  
✅ Drag-and-drop task reordering  
✅ Optimistic updates using React Query  
✅ Type-safe with TypeScript  
✅ Lightweight local API with `json-server`  
✅ Clean and minimal UI built with MUI + TailwindCSS  
✅ Zustand state management for UI interactions  

---

## 🧩 Tech Stack

| Layer | Technology |
|--------|-------------|
| **Framework** | Next.js 16 |
| **Library** | React 19 |
| **Language** | TypeScript 5 |
| **Data Fetching** | @tanstack/react-query |
| **UI Frameworks** | TailwindCSS 4, MUI 7 |
| **State Management** | Zustand 5 |
| **Drag & Drop** | @dnd-kit/core + sortable |
| **API Mocking** | JSON Server |
| **Icons** | lucide-react |

---

## 📁 Project Structure
```bash
src/
├── app/
│ ├── layout.tsx # Root layout and providers
│ └── page.tsx # Main Kanban board page
├── components/
│ ├── Modals/ # Modal components (Edit, Create)
│ ├── TaskColumn.tsx # Column component
│ ├── TaskCard.tsx # Single task component
│ └── Modal.tsx # Reusable modal
├── hooks/
│ └── useTasks.ts # React Query task hooks
├── providers/
│ └── QueryProvider.tsx # React Query Provider
├── services/
│ └── api/
│ └── taskApi.ts # CRUD functions for tasks
├── store/
│ └── useTaskStore.ts # Zustand state management
├── types/
│ └── task.types.ts # Type definitions for tasks
├── utils/
│ └── constants.ts # Column definitions
└── globals.css # Global styles



---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/mo7medhasan/kanban-todo.git
cd kanban-todo


2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Start development mode
To run both Next.js and JSON Server together:

bash
Copy code
npm run dev:full
Or run them separately:

bash
Copy code
npm run dev        # Start Next.js app (http://localhost:3000)
npm run api        # Start JSON Server (http://localhost:4000)
🗄️ Local API (json-server)
The app uses json-server as a mock backend for tasks.

Sample db.json
json
Copy code
{
  "tasks": [
    {
      "id": "1",
      "title": "Design homepage",
      "description": "Create hero section and banner",
      "column": "backlog",
      "order": 0
    },
    {
      "id": "2",
      "title": "Fix login bug",
      "description": "Resolve validation issue",
      "column": "in-progress",
      "order": 1
    }
  ]
}
API Endpoints
Method	Endpoint	Description
GET	/tasks	Get all tasks
POST	/tasks	Create new task
PUT	/tasks/:id	Update task
DELETE	/tasks/:id	Delete task
PATCH	/tasks/order	Update task order

🧱 Available Scripts
Command	Description
npm run dev	Start Next.js in development
npm run api	Start local JSON server
npm run dev:full	Run both (Next.js + API) concurrently
npm run build	Build the production app
npm run start	Run production build
npm run lint	Run ESLint
