import { useEffect, useRef } from 'react'

// Native <dialog>: gives focus trapping, Esc to close, and a backdrop.
export default function Modal({ title, onClose, children }) {
  const ref = useRef(null)
  useEffect(() => {
    const dialog = ref.current
    if (!dialog.open) dialog.showModal()
    return () => dialog.open && dialog.close()
  }, [])
  return (
    <dialog ref={ref} className="modal" aria-labelledby="modal-title" onCancel={(e) => { e.preventDefault(); onClose() }}
      onMouseDown={(e) => e.target === ref.current && onClose()}>
      <h2 id="modal-title">{title}</h2>
      {children}
    </dialog>
  )
}
