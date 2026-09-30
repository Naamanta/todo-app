export const PRIORITIES = ['low', 'medium', 'high']
export const TITLE_MAX = 120
export const DESCRIPTION_MAX = 500
export const DEFAULT_FILTERS = { status: 'all', priority: 'all', search: '' }

export function validateTodo({ title, description }) {
  const errors = {}
  if (!title.trim()) errors.title = 'Enter a task title.'
  else if (title.trim().length > TITLE_MAX) errors.title = `Keep the title under ${TITLE_MAX} characters.`
  if (description && description.length > DESCRIPTION_MAX)
    errors.description = `Keep the description under ${DESCRIPTION_MAX} characters.`
  return errors
}

export function filterTodos(todos, { status, priority, search }) {
  const q = search.trim().toLowerCase()
  return todos.filter((t) => {
    if (status === 'active' && t.completed) return false
    if (status === 'completed' && !t.completed) return false
    if (priority !== 'all' && t.priority !== priority) return false
    if (q && !`${t.title} ${t.description ?? ''}`.toLowerCase().includes(q)) return false
    return true
  })
}

export function getStats(todos) {
  const completed = todos.filter((t) => t.completed).length
  return { total: todos.length, completed, active: todos.length - completed }
}

export const formatDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function moveItem(list, fromId, toId) {
  const from = list.findIndex((t) => t.id === fromId)
  const to = list.findIndex((t) => t.id === toId)
  if (from < 0 || to < 0 || from === to) return list
  const next = [...list]
  next.splice(to, 0, next.splice(from, 1)[0])
  return next
}
