import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable'
import TodoItem from './TodoItem'

export default function TodoList({ todos, busyIds, dragDisabled, onReorder, ...handlers }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )
  const handleDragEnd = ({ active, over }) => {
    if (over && active.id !== over.id) onReorder(active.id, over.id)
  }
  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <ul className="todo-list">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} busy={busyIds.has(todo.id)} dragDisabled={dragDisabled} {...handlers} />
          ))}
        </ul>
      </SortableContext>
    </DndContext>
  )
}
