import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { formatDate } from '../utils/todoUtils'

export default function TodoItem({ todo, busy, dragDisabled, onToggle, onEdit, onDelete }) {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: todo.id, disabled: dragDisabled })
  const style = { transform: CSS.Transform.toString(transform), transition }

  return (
    <li ref={setNodeRef} style={style}
      className={`todo priority-${todo.priority}${todo.completed ? ' done' : ''}${isDragging ? ' dragging' : ''}`}>
      <button ref={setActivatorNodeRef} type="button" className="handle" disabled={dragDisabled}
        aria-label={`Reorder “${todo.title}”. Press space to pick up, arrow keys to move.`}
        title={dragDisabled ? 'Clear filters and search to reorder' : 'Drag to reorder'} {...attributes} {...listeners}>
        <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" fill="currentColor">
          <circle cx="5" cy="3" r="1.4" /><circle cx="11" cy="3" r="1.4" /><circle cx="5" cy="8" r="1.4" />
          <circle cx="11" cy="8" r="1.4" /><circle cx="5" cy="13" r="1.4" /><circle cx="11" cy="13" r="1.4" />
        </svg>
      </button>
      <input type="checkbox" className="check" checked={todo.completed} disabled={busy}
        aria-label={`Mark “${todo.title}” as ${todo.completed ? 'active' : 'completed'}`} onChange={() => onToggle(todo)} />
      <div className="todo-body">
        <p className="todo-title">{todo.title}</p>
        {todo.description && <p className="todo-desc">{todo.description}</p>}
        <p className="todo-meta">
          <span className="badge">{todo.priority} priority</span>
          {todo.completed && <span className="badge">done</span>}
          <time dateTime={todo.created_at}>{formatDate(todo.created_at)}</time>
        </p>
      </div>
      <div className="todo-actions">
        <button type="button" className="btn small" disabled={busy} onClick={() => onEdit(todo)} aria-label={`Edit “${todo.title}”`}>Edit</button>
        <button type="button" className="btn small danger" disabled={busy} onClick={() => onDelete(todo)} aria-label={`Delete “${todo.title}”`}>Delete</button>
      </div>
    </li>
  )
}
