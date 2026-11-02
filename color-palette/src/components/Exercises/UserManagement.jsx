import { useEffect, useMemo, useState } from 'react'
import { EmptyState, ErrorMessage, LoadingSpinner } from '../common/StatusComponents.jsx'

const STORAGE_KEY = 'lab4-users'
const initialUsers = [
  { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'admin', isActive: true, joinDate: '2023-01-15' },
  { id: 2, name: 'Bob Smith', email: 'bob@example.com', role: 'user', isActive: false, joinDate: '2023-02-20' },
  { id: 3, name: 'Carla Gomez', email: 'carla@example.com', role: 'editor', isActive: true, joinDate: '2023-03-11' },
  { id: 4, name: 'Daniel Lee', email: 'daniel@example.com', role: 'user', isActive: true, joinDate: '2023-06-02' },
  { id: 5, name: 'Eva Novak', email: 'eva@example.com', role: 'editor', isActive: false, joinDate: '2024-01-09' },
  { id: 6, name: 'Faris Khan', email: 'faris@example.com', role: 'user', isActive: true, joinDate: '2024-04-18' },
]

const getInitialUsers = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : initialUsers
  } catch {
    return initialUsers
  }
}

function UserList({ users, selectedIds, onToggleSelected, onToggleStatus }) {
  return (
    <div className="table-shell">
      <table>
        <caption className="sr-only">Filtered user management results</caption>
        <thead><tr><th scope="col">Select</th><th scope="col">User</th><th scope="col">Role</th><th scope="col">Joined</th><th scope="col">Status</th><th scope="col">Action</th></tr></thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td><input type="checkbox" aria-label={`Select ${user.name}`} checked={selectedIds.includes(user.id)} onChange={() => onToggleSelected(user.id)} /></td>
              <td><strong>{user.name}</strong><small>{user.email}</small></td>
              <td><span className={`badge role-${user.role}`}>{user.role}</span></td>
              <td>{new Date(`${user.joinDate}T00:00:00`).toLocaleDateString()}</td>
              <td><span className={`status-dot ${user.isActive ? 'active' : 'inactive'}`}>{user.isActive ? 'Active' : 'Inactive'}</span></td>
              <td><button className="button small ghost" onClick={() => onToggleStatus(user.id)}>{user.isActive ? 'Deactivate' : 'Activate'}</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function UserManagement() {
  const [users, setUsers] = useState(getInitialUsers)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [activeOnly, setActiveOnly] = useState(false)
  const [sortBy, setSortBy] = useState('name')
  const [selectedIds, setSelectedIds] = useState([])

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 450)
    return () => window.clearTimeout(timer)
  }, [])

  // Bonus: debounce the text input so filtering does not run on every keystroke.
  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(searchTerm.trim().toLowerCase()), 300)
    return () => window.clearTimeout(timer)
  }, [searchTerm])

  // Bonus: persist user data.
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users))
    } catch {
      // Storage can be unavailable in privacy modes; the app remains usable.
    }
  }, [users])

  const processedUsers = useMemo(() => users
    .filter((user) => {
      const matchesSearch = !debouncedSearch || user.name.toLowerCase().includes(debouncedSearch) || user.email.toLowerCase().includes(debouncedSearch)
      const matchesRole = roleFilter === 'all' || user.role === roleFilter
      const matchesActive = !activeOnly || user.isActive
      return matchesSearch && matchesRole && matchesActive
    })
    .sort((a, b) => {
      if (sortBy === 'joinDate') return new Date(a.joinDate) - new Date(b.joinDate)
      if (sortBy === 'role') return a.role.localeCompare(b.role) || a.name.localeCompare(b.name)
      return a.name.localeCompare(b.name)
    }), [users, debouncedSearch, roleFilter, activeOnly, sortBy])

  const resetFilters = () => {
    setSearchTerm('')
    setDebouncedSearch('')
    setRoleFilter('all')
    setActiveOnly(false)
    setSortBy('name')
  }

  const toggleSelected = (id) => setSelectedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const allVisibleSelected = processedUsers.length > 0 && processedUsers.every((user) => selectedIds.includes(user.id))
  const toggleSelectAll = () => {
    const visibleIds = processedUsers.map((user) => user.id)
    setSelectedIds((current) => allVisibleSelected ? current.filter((id) => !visibleIds.includes(id)) : [...new Set([...current, ...visibleIds])])
  }
  const updateSelectedStatus = (isActive) => setUsers((current) => current.map((user) => selectedIds.includes(user.id) ? { ...user, isActive } : user))
  const deleteSelected = () => {
    setUsers((current) => current.filter((user) => !selectedIds.includes(user.id)))
    setSelectedIds([])
  }
  const restoreUsers = () => {
    setUsers(initialUsers)
    setSelectedIds([])
    setError(null)
  }

  if (loading) return <section className="exercise-panel"><LoadingSpinner label="Loading users..." /></section>
  if (error) return <section className="exercise-panel"><ErrorMessage error={error} onRetry={() => setError(null)} /></section>

  return (
    <section className="exercise-panel" aria-labelledby="task2-heading">
      <div className="section-heading">
        <div><span className="eyebrow">Task 2 + Bonuses</span><h2 id="task2-heading">User Management System</h2><p>Search, filtering, sorting, state handling, bulk actions, and local persistence.</p></div>
        <div className="heading-actions"><button className="button ghost" onClick={() => setError('Simulated network error for the error-state requirement.')}>Test error</button><button className="button ghost" onClick={restoreUsers}>Restore sample data</button></div>
      </div>

      <div className="toolbar" role="search" aria-label="User filters">
        <label className="field"><span>Search name or email</span><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="e.g. Alice" /></label>
        <label className="field"><span>Role</span><select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}><option value="all">All roles</option><option value="admin">Admin</option><option value="editor">Editor</option><option value="user">User</option></select></label>
        <label className="field"><span>Sort by</span><select value={sortBy} onChange={(event) => setSortBy(event.target.value)}><option value="name">Name</option><option value="joinDate">Join date</option><option value="role">Role</option></select></label>
        <label className="check-field"><input type="checkbox" checked={activeOnly} onChange={(event) => setActiveOnly(event.target.checked)} />Active users only</label>
      </div>

      <div className="bulk-bar">
        <label className="check-field"><input type="checkbox" checked={allVisibleSelected} onChange={toggleSelectAll} disabled={processedUsers.length === 0} />Select all visible</label>
        <span>{selectedIds.length} selected</span>
        <div className="bulk-actions">
          <button className="button small secondary" disabled={!selectedIds.length} onClick={() => updateSelectedStatus(true)}>Mark active</button>
          <button className="button small secondary" disabled={!selectedIds.length} onClick={() => updateSelectedStatus(false)}>Mark inactive</button>
          <button className="button small danger-button" disabled={!selectedIds.length} onClick={deleteSelected}>Delete</button>
        </div>
      </div>

      {users.length === 0 ? (
        <EmptyState type="no-users" onReset={restoreUsers} />
      ) : processedUsers.length === 0 ? (
        <EmptyState type="no-results" onReset={resetFilters} />
      ) : (
        <UserList users={processedUsers} selectedIds={selectedIds} onToggleSelected={toggleSelected} onToggleStatus={(id) => setUsers((current) => current.map((user) => user.id === id ? { ...user, isActive: !user.isActive } : user))} />
      )}
      <p className="microcopy" aria-live="polite">Showing {processedUsers.length} of {users.length} users. Search uses a 300 ms debounce.</p>
    </section>
  )
}
