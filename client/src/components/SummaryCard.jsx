import './SummaryCard.css'

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  variant = 'total',
  subtext
}) {
  return (
    <div className={`summary-card summary-card-${variant}`}>
      <div className="summary-card-inner">
        <div className="summary-card-meta">
          <span className="summary-card-label">{label}</span>
          <h3 className="summary-card-value">{value}</h3>
          {subtext && <span className="summary-card-subtext">{subtext}</span>}
        </div>
        <div className={`summary-icon-wrapper summary-icon-${variant}`}>
          <Icon size={22} />
        </div>
      </div>
      <div className={`summary-accent-bar summary-bar-${variant}`} />
    </div>
  )
}
