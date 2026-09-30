export default function SearchBar({ value, onChange }) {
  return (
    <div className="field search">
      <label htmlFor="search">Search tasks</label>
      <input id="search" type="search" placeholder="Search by title or description" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}
