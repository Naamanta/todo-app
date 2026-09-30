export default function TodoStats({ stats }) {
  return (
    <dl className="stats" aria-label="Task statistics">
      <div><dt>Total</dt><dd>{stats.total}</dd></div>
      <div><dt>Active</dt><dd>{stats.active}</dd></div>
      <div><dt>Completed</dt><dd>{stats.completed}</dd></div>
    </dl>
  )
}
