import { useState } from 'react'
import { LoadingSpinner } from '../common/StatusComponents.jsx'

const initialUserData = {
  isLoggedIn: true,
  isPremium: false,
  isAdmin: true,
  isLoading: false,
  userProfile: { name: 'John Doe', email: 'john@example.com' },
  notifications: ['Welcome!', 'New message'],
}

export default function Task1() {
  const [userData, setUserData] = useState(initialUserData)

  // Early return pattern: no dashboard markup is rendered while loading.
  if (userData.isLoading) {
    return (
      <section className="exercise-panel" aria-labelledby="task1-heading">
        <LoadingSpinner label="Loading user dashboard..." />
        <button className="button secondary" onClick={() => setUserData((current) => ({ ...current, isLoading: false }))}>
          Finish loading
        </button>
      </section>
    )
  }

  const notificationTone = userData.notifications.length > 3 ? 'danger' : userData.notifications.length > 0 ? 'accent' : 'muted'

  return (
    <section className="exercise-panel" aria-labelledby="task1-heading">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Task 1</span>
          <h2 id="task1-heading">Conditional Rendering Dashboard</h2>
          <p>Five conditional rendering patterns, all visible and testable.</p>
        </div>
        <button className="button ghost" onClick={() => setUserData(initialUserData)}>Reset</button>
      </div>

      <div className="dashboard-card">
        <div className="profile-row">
          <div className="avatar" aria-hidden="true">JD</div>
          <div>
            <div className="inline-title">
              <h3>{userData.userProfile.name}</h3>
              {/* && operator */}
              {userData.isPremium && <span className="badge premium">Premium</span>}
            </div>
            <p>{userData.userProfile.email}</p>
          </div>
          <span className={`notification-count ${notificationTone}`} aria-label={`${userData.notifications.length} notifications`}>
            {userData.notifications.length}
          </span>
        </div>

        <div className="dashboard-actions" aria-label="Dashboard state controls">
          {/* Ternary operator */}
          <button className="button primary" onClick={() => setUserData((current) => ({ ...current, isLoggedIn: !current.isLoggedIn }))}>
            {userData.isLoggedIn ? 'Logout' : 'Login'}
          </button>
          <button className="button secondary" onClick={() => setUserData((current) => ({ ...current, isPremium: !current.isPremium }))}>
            Toggle premium
          </button>
          <button className="button secondary" onClick={() => setUserData((current) => ({ ...current, isAdmin: !current.isAdmin }))}>
            Switch to {userData.isAdmin ? 'user' : 'admin'}
          </button>
          <button className="button secondary" onClick={() => setUserData((current) => ({ ...current, isLoading: true }))}>
            Test loading
          </button>
          <button className="button secondary" onClick={() => setUserData((current) => ({ ...current, notifications: [...current.notifications, `Notification ${current.notifications.length + 1}`] }))}>
            Add notification
          </button>
        </div>

        <div className="role-section">
          {/* Multiple conditions */}
          {!userData.isLoggedIn ? (
            <div className="callout warning"><strong>Guest view</strong><span>Log in to access your dashboard.</span></div>
          ) : userData.isAdmin ? (
            <div className="callout success"><strong>Admin dashboard</strong><span>Manage users, permissions, and system settings.</span></div>
          ) : (
            <div className="callout info"><strong>User dashboard</strong><span>View your account, activity, and preferences.</span></div>
          )}
        </div>

        <div className="notification-list">
          <div className="inline-title">
            <h3>Notifications</h3>
            <span className={`badge ${notificationTone}`}>{userData.notifications.length === 0 ? 'All caught up' : `${userData.notifications.length} unread`}</span>
          </div>
          {userData.notifications.length > 0 ? (
            <ul>{userData.notifications.map((notification, index) => <li key={`${notification}-${index}`}>{notification}</li>)}</ul>
          ) : <p>No notifications.</p>}
        </div>
      </div>
    </section>
  )
}
