import { supabase } from '../lib/supabase'

const TABLE = 'todos'

async function run(query) {
  const { data, error } = await query
  if (error) {
    console.error('[todoService]', error)
    throw error
  }
  return data
}  

export const getTodos = () =>
  run(supabase.from(TABLE).select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false }))

export async function createTodo({ title, description, priority }, sortOrder) {
  const rows = await run(
    supabase.from(TABLE)
      .insert({ title, description: description || null, priority, sort_order: sortOrder })
      .select()
  )
  return rows[0]
}

export async function updateTodo(id, changes) {
  const rows = await run(supabase.from(TABLE).update(changes).eq('id', id).select())
  return rows[0]
}

export const toggleTodo = (id, completed) => updateTodo(id, { completed })

export const deleteTodo = (id) => run(supabase.from(TABLE).delete().eq('id', id))

export function updateTodoOrder(changes) {
  return Promise.all(changes.map(({ id, sort_order }) => updateTodo(id, { sort_order })))
}
