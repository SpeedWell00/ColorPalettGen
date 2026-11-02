export function LoadingSpinner({ label = 'Loading data...' }) {
  return (
    <div className="state-card" role="status" aria-live="polite">
      <span className="spinner" aria-hidden="true" />
      <strong>{label}</strong>
    </div>
  )
}

export function ErrorMessage({ error, onRetry }) {
  return (
    <div className="state-card error-state" role="alert">
      <span className="state-icon" aria-hidden="true">!</span>
      <div>
        <h3>Something went wrong</h3>
        <p>{error || 'An unexpected error occurred.'}</p>
        {onRetry && <button className="button secondary" onClick={onRetry}>Try again</button>}
      </div>
    </div>
  )
}

export function EmptyState({ type = 'no-results', onReset }) {
  const noUsers = type === 'no-users'
  return (
    <div className="state-card empty-state">
      <span className="state-icon" aria-hidden="true">{noUsers ? '👥' : '⌕'}</span>
      <div>
        <h3>{noUsers ? 'No users available' : 'No matching results'}</h3>
        <p>{noUsers ? 'Add or restore users to continue.' : 'Try changing your search or filters.'}</p>
        {onReset && <button className="button secondary" onClick={onReset}>Reset filters</button>}
      </div>
    </div>
  )
}
