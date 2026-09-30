import { useState } from 'react'
import { DESCRIPTION_MAX, PRIORITIES, TITLE_MAX, validateTodo } from '../utils/todoUtils'

const EMPTY = { title: '', description: '', priority: 'medium' }

export default function TodoForm({ initial = EMPTY, submitLabel, busyLabel, busy, onSubmit, onCancel, idPrefix = 'new' }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial, description: initial.description ?? '' })
  const [errors, setErrors] = useState({})
  const set = (patch) => setValues((v) => ({ ...v, ...patch }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (busy) return
    const found = validateTodo(values)
    setErrors(found)
    if (Object.keys(found).length) return
    const ok = await onSubmit(values)
    if (ok && !onCancel) setValues(EMPTY)
  }

  const id = (n) => `${idPrefix}-${n}`
  return (
    <form className="todo-form" onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor={id('title')}>Task title</label>
        <input id={id('title')} value={values.title} maxLength={TITLE_MAX + 20} autoFocus={Boolean(onCancel)}
          aria-invalid={Boolean(errors.title)} aria-describedby={errors.title ? id('title-err') : undefined}
          onChange={(e) => set({ title: e.target.value })} placeholder="What needs doing?" />
        {errors.title && <p className="field-error" id={id('title-err')} role="alert">{errors.title}</p>}
      </div>
      <div className="field">
        <label htmlFor={id('desc')}>Description (optional)</label>
        <textarea id={id('desc')} rows={2} value={values.description} aria-invalid={Boolean(errors.description)}
          onChange={(e) => set({ description: e.target.value })} maxLength={DESCRIPTION_MAX + 50} />
        {errors.description && <p className="field-error" role="alert">{errors.description}</p>}
      </div>
      <div className="form-row">
        <div className="field">
          <label htmlFor={id('priority')}>Priority</label>
          <select id={id('priority')} value={values.priority} onChange={(e) => set({ priority: e.target.value })}>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p[0].toUpperCase() + p.slice(1)}</option>)}
          </select>
        </div>
        <div className="actions">
          {onCancel && <button type="button" className="btn" onClick={onCancel}>Cancel</button>}
          <button type="submit" className="btn primary" disabled={busy}>{busy ? busyLabel : submitLabel}</button>
        </div>
      </div>
    </form>
  )
}
