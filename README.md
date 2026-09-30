# Todo List

A React + Vite todo app backed by Supabase (PostgreSQL). Create, edit, delete, complete, search, filter and drag-to-reorder tasks; everything persists to the database.

## Features
Create/edit/delete with validation and delete confirmation · completion toggle (optimistic, with rollback) · drag-and-drop reordering (mouse, touch, keyboard) persisted via `sort_order` · status + priority filters · case-insensitive search · live stats · loading and error states · light/dark theme saved in localStorage · responsive, accessible UI.

## Tech stack
React 18, Vite 5, `@dnd-kit`, `@supabase/supabase-js`, plain CSS.

## Architecture
```
src/
├── components/   presentational UI (TodoForm, TodoItem, TodoList, TodoFilters, TodoStats, SearchBar, Modal, LoadingSpinner, EmptyState)
├── hooks/useTodos.js       state, optimistic updates, rollback
├── services/todoService.js all Supabase queries (getTodos, createTodo, updateTodo, toggleTodo, deleteTodo, updateTodoOrder)
├── lib/supabase.js         client from env vars
├── utils/todoUtils.js      validation, filtering, stats, reorder helpers
└── App.jsx, main.jsx, index.css
supabase/schema.sql         table, constraints, index, trigger, RLS policies
```

## Supabase setup
1. Create a project at supabase.com.
2. Open **SQL Editor**, paste `supabase/schema.sql`, and run it.
3. In **Project Settings → API**, copy the Project URL and the anon public key.

## Environment variables
```
cp .env.example .env
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Run locally
```
npm install
npm run dev
```

## Build and deploy
```
npm run build      # outputs dist/
npm run preview
```
Deploy `dist/` to Netlify, Vercel or Cloudflare Pages; set the two `VITE_` variables in the host's settings (build command `npm run build`, output `dist`).

## Security model
There is no authentication. RLS is enabled, but the policies let the anonymous key read and write every row, so **anyone with your deployed app can modify the data**. That is acceptable for a demo only. For real use, add Supabase Auth, a `user_id` column, and policies restricted to `auth.uid() = user_id`.

## Known limitations
- Reordering is disabled while a filter or search is active (so the saved order is unambiguous).
- Reorder writes one update per changed row; fine for hundreds of tasks, not thousands.
- No auth, due dates, tags or undo.
