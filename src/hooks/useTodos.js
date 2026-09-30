import { useCallback, useEffect, useMemo, useState } from 'react'
import * as api from '../services/todoService'
import { DEFAULT_FILTERS, filterTodos, getStats, moveItem } from '../utils/todoUtils'

const FRIENDLY = {
  load: 'We couldn’t load your tasks. Check your connection and try again.',
  create: 'We couldn’t add that task. Try again.',
  update: 'We couldn’t save your changes. They’ve been reverted.',
  delete: 'We couldn’t delete that task. Try again.',
  reorder: 'We couldn’t save the new order. It’s been reverted.',
}

export function useTodos() {
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [busyIds, setBusyIds] = useState(() => new Set())
  const [error, setError] = useState(null)
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const fail = useCallback((key) => setError(FRIENDLY[key]), [])
  const markBusy = (id, on) =>
    setBusyIds((prev) => {
      const next = new Set(prev)
      on ? next.add(id) : next.delete(id)
      return next
    })

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      setTodos(await api.getTodos())
    } catch {
      fail('load')
    } finally {
      setLoading(false)
    }
  }, [fail])

  useEffect(() => { load() }, [load])

  const addTodo = useCallback(async (values) => {
    setSaving(true)
    setError(null)
    try {
      const top = todos.length ? Math.min(...todos.map((t) => t.sort_order)) - 1 : 0
      const created = await api.createTodo(values, top)
      setTodos((prev) => [created, ...prev])
      return true
    } catch {
      fail('create')
      return false
    } finally {
      setSaving(false)
    }
  }, [todos, fail])

  // Optimistic update with rollback to the snapshot taken before the change.
  const patchTodo = useCallback(async (id, changes, remote) => {
    const snapshot = todos
    setError(null)
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...changes } : t)))
    markBusy(id, true)
    try {
      const saved = await remote()
      setTodos((prev) => prev.map((t) => (t.id === id ? saved : t)))
      return true
    } catch {
      setTodos(snapshot)
      fail('update')
      return false
    } finally {
      markBusy(id, false)
    }
  }, [todos, fail])

  const toggleTodo = useCallback(
    (todo) => patchTodo(todo.id, { completed: !todo.completed }, () => api.toggleTodo(todo.id, !todo.completed)),
    [patchTodo]
  )

  const editTodo = useCallback(
    (id, { title, description, priority }) => {
      const changes = { title: title.trim(), description: description.trim() || null, priority }
      return patchTodo(id, changes, () => api.updateTodo(id, changes))
    },
    [patchTodo]
  )

  const removeTodo = useCallback(async (id) => {
    markBusy(id, true)
    setError(null)
    try {
      await api.deleteTodo(id)
      setTodos((prev) => prev.filter((t) => t.id !== id))
      return true
    } catch {
      fail('delete')
      return false
    } finally {
      markBusy(id, false)
    }
  }, [fail])

  const reorderTodos = useCallback(async (fromId, toId) => {
    const snapshot = todos
    const moved = moveItem(todos, fromId, toId)
    if (moved === todos) return
    const renumbered = moved.map((t, i) => ({ ...t, sort_order: i }))
    const changes = renumbered
      .filter((t, i) => snapshot.find((s) => s.id === t.id).sort_order !== i)
      .map(({ id, sort_order }) => ({ id, sort_order }))
    setError(null)
    setTodos(renumbered)
    try {
      await api.updateTodoOrder(changes)
    } catch {
      setTodos(snapshot)
      fail('reorder')
    }
  }, [todos, fail])

  const visibleTodos = useMemo(() => filterTodos(todos, filters), [todos, filters])
  const stats = useMemo(() => getStats(todos), [todos])
  const isFiltered = filters.status !== 'all' || filters.priority !== 'all' || filters.search.trim() !== ''

  return {
    todos, visibleTodos, stats, filters, setFilters, isFiltered,
    loading, saving, busyIds, error, clearError: () => setError(null), reload: load,
    addTodo, toggleTodo, editTodo, removeTodo, reorderTodos,
  }
}
