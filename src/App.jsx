import { useEffect, useState } from 'react'
import { isSupabaseConfigured } from './lib/supabase'
import { useTodos } from './hooks/useTodos'
import TodoForm from './components/TodoForm'
import TodoList from './components/TodoList'
import TodoFilters from './components/TodoFilters'
import TodoStats from './components/TodoStats'
import SearchBar from './components/SearchBar'
import LoadingSpinner from './components/LoadingSpinner'
import EmptyState from './components/EmptyState'
import Modal from './components/Modal'

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'light')
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem('theme', theme) } catch { /* storage unavailable */ }
  }, [theme])
  return [theme, () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))]
}

function Header({ theme, onToggleTheme }) {
  return (
    <header className="header">
      <div>
        <p className="brand"><span className="logo" aria-hidden="true">✓</span> Tickmark</p>
        <h1>Todo List</h1>
        <p className="lede">Capture tasks, rank them by priority, and drag them into the order you’ll do them.</p>
      </div>
      <button type="button" className="btn" onClick={onToggleTheme} aria-pressed={theme === 'dark'}>
        {theme === 'dark' ? 'Light mode' : 'Dark mode'}
      </button>
    </header>
  )
}

function SetupNotice() {
  return (
    <main className="app">
      <div className="banner" role="alert">
        Supabase isn’t configured. Copy <code>.env.example</code> to <code>.env</code>, add your project URL and anon key,
        then restart the dev server.
      </div>
    </main>
  )
}

export default function App() {
  const [theme, toggleTheme] = useTheme()
  if (!isSupabaseConfigured) return <SetupNotice />
  return <TodoApp theme={theme} onToggleTheme={toggleTheme} />
}

function TodoApp({ theme, onToggleTheme }) {
  const t = useTodos()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  const handleEdit = async (values) => {
    const ok = await t.editTodo(editing.id, values)
    if (ok) setEditing(null)
    return ok
  }
  const confirmDelete = async () => {
    const todo = deleting
    setDeleting(null)
    await t.removeTodo(todo.id)
  }

  return (
    <main className="app">
      <Header theme={theme} onToggleTheme={onToggleTheme} />
      <section aria-labelledby="add-heading" className="panel">
        <h2 id="add-heading">Add a task</h2>
        <TodoForm submitLabel="Add task" busyLabel="Saving…" busy={t.saving} onSubmit={t.addTodo} />
      </section>

      {t.error && (
        <div className="banner" role="alert">
          <span>{t.error}</span>
          <span className="actions">
            <button type="button" className="btn small" onClick={t.reload}>Reload</button>
            <button type="button" className="btn small" onClick={t.clearError}>Dismiss</button>
          </span>
        </div>
      )}

      <section aria-labelledby="list-heading" className="panel">
        <div className="list-head">
          <h2 id="list-heading">Your tasks</h2>
          <TodoStats stats={t.stats} />
        </div>
        <SearchBar value={t.filters.search} onChange={(search) => t.setFilters({ ...t.filters, search })} />
        <TodoFilters filters={t.filters} onChange={t.setFilters} />
        {t.isFiltered && t.stats.total > 1 && <p className="hint">Reordering is off while a filter or search is active.</p>}
        {t.loading ? <LoadingSpinner /> : t.visibleTodos.length === 0 ? (
          <EmptyState todos={t.todos} filters={t.filters} />
        ) : (
          <TodoList todos={t.visibleTodos} busyIds={t.busyIds} dragDisabled={t.isFiltered}
            onReorder={t.reorderTodos} onToggle={t.toggleTodo} onEdit={setEditing} onDelete={setDeleting} />
        )}
      </section>

      {editing && (
        <Modal title="Edit task" onClose={() => setEditing(null)}>
          <TodoForm idPrefix="edit" initial={editing} submitLabel="Save changes" busyLabel="Updating…"
            busy={t.busyIds.has(editing.id)} onSubmit={handleEdit} onCancel={() => setEditing(null)} />
        </Modal>
      )}
      {deleting && (
        <Modal title="Delete task?" onClose={() => setDeleting(null)}>
          <p>Are you sure you want to delete this task?</p>
          <p><strong>{deleting.title}</strong></p>
          <div className="actions end">
            <button type="button" className="btn" onClick={() => setDeleting(null)}>Cancel</button>
            <button type="button" className="btn danger solid" onClick={confirmDelete}>Delete</button>
          </div>
        </Modal>
      )}
    </main>
  )
}
