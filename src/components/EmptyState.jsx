const COPY = {
  none: 'You don’t have any tasks yet. Create your first task.',
  search: 'No tasks match your search.',
  completed: 'You haven’t completed any tasks yet.',
  active: 'Nothing left to do. All tasks are complete.',
  filtered: 'No tasks match these filters.',
}

export default function EmptyState({ todos, filters }) {
  let key = 'none'
  if (todos.length) {
    if (filters.search.trim()) key = 'search'
    else if (filters.status === 'completed' && filters.priority === 'all') key = 'completed'
    else if (filters.status === 'active' && filters.priority === 'all') key = 'active'
    else key = 'filtered'
  }
  return <p className="center-state">{COPY[key]}</p>
}
