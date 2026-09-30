import { PRIORITIES } from '../utils/todoUtils'

const STATUSES = [['all', 'All'], ['active', 'Active'], ['completed', 'Completed']]

export default function TodoFilters({ filters, onChange }) {
  const set = (patch) => onChange({ ...filters, ...patch })
  return (
    <div className="filters">
      <div role="group" aria-label="Filter by status" className="segmented">
        {STATUSES.map(([value, label]) => (
          <button key={value} type="button" aria-pressed={filters.status === value} onClick={() => set({ status: value })}>
            {label}
          </button>
        ))}
      </div>
      <div className="field">
        <label htmlFor="priority-filter">Priority</label>
        <select id="priority-filter" value={filters.priority} onChange={(e) => set({ priority: e.target.value })}>
          <option value="all">All priorities</option>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
        </select>
      </div>
    </div>
  )
}
