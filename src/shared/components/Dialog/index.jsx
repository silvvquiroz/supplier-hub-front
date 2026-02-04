import './Dialog.css'

export function Dialog({ id, title, children, largeSize }) {
  return (
    <dialog 
      role="dialog" 
      id={id} 
      popover="auto"
      className={largeSize ? 'Dialog--large' : ''}
    >
      <header>
        <h6>{title}</h6>
      </header>
      {children}
    </dialog>
  )
}
