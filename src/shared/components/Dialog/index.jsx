import './Dialog.css'

export function Dialog({ id, title, children }) {
  return (
    <dialog role="dialog" id={id} popover="auto">
      <header>
        <h6>{title}</h6>
      </header>
      {children}
    </dialog>
  )
}
