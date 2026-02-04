import './Metric.css'

export function Metric({ title, value, description }) {
  return (
    <div className="Metric">
      <h6>{title}</h6>
      <p>{value}</p>
      {description && (
        <p>
          <small>{description}</small>
        </p>
      )}
    </div>
  )
}
