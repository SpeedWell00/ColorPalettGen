import { useRef, useState } from 'react'
import Task1 from './components/Exercises/Task1.jsx'
import UserManagement from './components/Exercises/UserManagement.jsx'
import AdvancedTodoList from './components/Exercises/AdvancedTodoList.jsx'
import OptimizedUserList from './components/Exercises/OptimizedUserList.jsx'

const tabs = [
  { id: 'conditional', label: 'Task 1', title: 'Conditional Rendering' },
  { id: 'users', label: 'Task 2', title: 'User Management' },
  { id: 'todos', label: 'Task 3', title: 'Advanced Todos' },
  { id: 'performance', label: 'Task 4', title: 'Performance' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState(tabs[0].id)
  const tabRefs = useRef([])

  const handleTabKeyDown = (event, index) => {
    if (!['ArrowRight', 'ArrowLeft', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    let nextIndex = index
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length
    if (event.key === 'Home') nextIndex = 0
    if (event.key === 'End') nextIndex = tabs.length - 1
    setActiveTab(tabs[nextIndex].id)
    tabRefs.current[nextIndex]?.focus()
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div className="hero-copy"><span className="kicker">React Lab 4</span><h1>Dynamic Interfaces<br /><span>Conditional Rendering & Lists</span></h1><p>A complete implementation of every required exercise plus all four bonus challenges.</p></div>
        <div className="hero-summary" aria-label="Project summary"><div><strong>4</strong><span>Core tasks</span></div><div><strong>4</strong><span>Bonuses</span></div><div><strong>1000</strong><span>Virtualized rows</span></div></div>
      </header>

      <nav className="tab-nav" role="tablist" aria-label="Lab exercises">
        {tabs.map((tab, index) => (
          <button key={tab.id} ref={(element) => { tabRefs.current[index] = element }} role="tab" aria-selected={activeTab === tab.id} aria-controls={`panel-${tab.id}`} id={`tab-${tab.id}`} tabIndex={activeTab === tab.id ? 0 : -1} className={activeTab === tab.id ? 'tab active' : 'tab'} onClick={() => setActiveTab(tab.id)} onKeyDown={(event) => handleTabKeyDown(event, index)}>
            <span>{tab.label}</span>{tab.title}
          </button>
        ))}
      </nav>

      <main>
        <div id={`panel-${activeTab}`} role="tabpanel" aria-labelledby={`tab-${activeTab}`}>
          {activeTab === 'conditional' && <Task1 />}
          {activeTab === 'users' && <UserManagement />}
          {activeTab === 'todos' && <AdvancedTodoList />}
          {activeTab === 'performance' && <OptimizedUserList />}
        </div>
      </main>
      <footer><span>Lab 4 complete implementation</span><span>Built with React + Vite</span></footer>
    </div>
  )
}
