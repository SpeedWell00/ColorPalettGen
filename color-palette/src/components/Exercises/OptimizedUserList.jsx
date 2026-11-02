import React, { useMemo, useState } from 'react'

const ROW_HEIGHT = 68
const VIEWPORT_HEIGHT = 408
const BUFFER = 4

const makeUsers = () => Array.from({ length: 1000 }, (_, index) => ({
  id: index + 1,
  name: `User ${String(index + 1).padStart(4, '0')}`,
  email: `user${index + 1}@example.com`,
  role: ['admin', 'editor', 'user'][index % 3],
  score: ((index * 37) % 101),
}))

const UserCard = React.memo(function UserCard({ user }) {
  return (
    <article className="virtual-user-card" style={{ height: ROW_HEIGHT - 8 }}>
      <div className="avatar small-avatar" aria-hidden="true">{user.name.split(' ').map((part) => part[0]).join('').slice(0, 2)}</div>
      <div className="virtual-user-main"><strong>{user.name}</strong><span>{user.email}</span></div>
      <span className={`badge role-${user.role}`}>{user.role}</span>
      <span className="score">{user.score}</span>
    </article>
  )
})

export default function OptimizedUserList() {
  const [users] = useState(makeUsers)
  const [query, setQuery] = useState('')
  const [sortDescending, setSortDescending] = useState(false)
  const [scrollTop, setScrollTop] = useState(0)

  const filteredUsers = useMemo(() => {
    const needle = query.trim().toLowerCase()
    const result = users.filter((user) => !needle || user.name.toLowerCase().includes(needle) || user.email.toLowerCase().includes(needle))
    return [...result].sort((a, b) => sortDescending ? b.score - a.score : a.score - b.score)
  }, [users, query, sortDescending])

  const startIndex = Math.max(0, Math.floor(scrollTop / ROW_HEIGHT) - BUFFER)
  const visibleCount = Math.ceil(VIEWPORT_HEIGHT / ROW_HEIGHT) + BUFFER * 2
  const endIndex = Math.min(filteredUsers.length, startIndex + visibleCount)
  const visibleUsers = filteredUsers.slice(startIndex, endIndex)
  const topSpacer = startIndex * ROW_HEIGHT
  const bottomSpacer = Math.max(0, (filteredUsers.length - endIndex) * ROW_HEIGHT)

  return (
    <section className="exercise-panel" aria-labelledby="task4-heading">
      <div className="section-heading"><div><span className="eyebrow">Task 4</span><h2 id="task4-heading">Optimized User List</h2><p>Stable keys, memoized work, memoized rows, and lightweight manual virtualization.</p></div></div>

      <div className="optimization-grid">
        <article className="concept-card"><span className="concept-number">01</span><h3>Stable keys</h3><p>Every row uses <code>user.id</code>, not the array index. This keeps component identity tied to the data when rows are inserted, removed, or reordered.</p></article>
        <article className="concept-card"><span className="concept-number">02</span><h3>Memoization</h3><p><code>useMemo</code> caches filtering/sorting and <code>React.memo</code> prevents unchanged <code>UserCard</code> rows from re-rendering unnecessarily.</p></article>
        <article className="concept-card"><span className="concept-number">03</span><h3>Windowing</h3><p>Only the visible slice plus a small buffer is mounted. This pattern is useful for hundreds or thousands of similarly sized rows.</p></article>
      </div>

      <div className="code-comparison" aria-label="Key usage comparison">
        <div><span>Bad</span><code>{'users.map((user, index) => <UserCard key={index} ... />)'}</code></div>
        <div><span>Good</span><code>{'users.map(user => <UserCard key={user.id} ... />)'}</code></div>
      </div>

      <div className="toolbar compact">
        <label className="field grow"><span>Filter 1,000 generated users</span><input value={query} onChange={(e) => { setQuery(e.target.value); setScrollTop(0) }} placeholder="Name or email" /></label>
        <label className="check-field align-end"><input type="checkbox" checked={sortDescending} onChange={(e) => setSortDescending(e.target.checked)} />Highest score first</label>
      </div>

      <div className="virtual-header"><span>{filteredUsers.length.toLocaleString()} matching users</span><span>Rendering {visibleUsers.length} rows</span></div>
      <div className="virtual-list" style={{ height: VIEWPORT_HEIGHT }} onScroll={(e) => setScrollTop(e.currentTarget.scrollTop)} tabIndex="0" aria-label="Virtualized user list">
        <div style={{ height: topSpacer }} aria-hidden="true" />
        {visibleUsers.map((user) => <UserCard key={user.id} user={user} />)}
        <div style={{ height: bottomSpacer }} aria-hidden="true" />
      </div>
    </section>
  )
}
