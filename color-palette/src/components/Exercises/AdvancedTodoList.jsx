import { useEffect, useMemo, useState } from 'react'

const STORAGE_KEY = 'lab4-todos'
const seedTodos = [
  { id: 1, text: 'Learn React', completed: true, category: 'education', priority: 'high', dueDate: '2024-01-15' },
  { id: 2, text: 'Prepare sprint review', completed: false, category: 'work', priority: 'high', dueDate: '2026-11-03' },
  { id: 3, text: 'Read component patterns', completed: false, category: 'education', priority: 'medium', dueDate: '2026-11-12' },
  { id: 4, text: 'Book dentist appointment', completed: false, category: 'personal', priority: 'low', dueDate: '2026-11-20' },
  { id: 5, text: 'Refactor dashboard styles', completed: true, category: 'work', priority: 'medium', dueDate: '2026-10-22' },
  { id: 6, text: 'Plan weekend walk', completed: false, category: 'personal', priority: 'low', dueDate: '2026-11-01' },
]
const priorityWeight = { high: 0, medium: 1, low: 2 }

const getInitialTodos = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? JSON.parse(saved) : seedTodos
  } catch { return seedTodos }
}

export default function AdvancedTodoList() {
  const [todos, setTodos] = useState(getInitialTodos)
  const [category, setCategory] = useState('all')
  const [priority, setPriority] = useState('all')
  const [status, setStatus] = useState('all')
  const [search, setSearch] = useState('')
  const [sortPriority, setSortPriority] = useState(true)
  const [draft, setDraft] = useState({ text: '', category: 'work', priority: 'medium', dueDate: '' })

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(todos)) } catch { /* keep app usable without storage */ }
  }, [todos])

  const filteredTodos = useMemo(() => todos
    .filter((todo) => category === 'all' || todo.category === category)
    .filter((todo) => priority === 'all' || todo.priority === priority)
    .filter((todo) => status === 'all' || (status === 'completed' ? todo.completed : !todo.completed))
    .filter((todo) => todo.text.toLowerCase().includes(search.trim().toLowerCase()))
    .sort((a, b) => sortPriority ? priorityWeight[a.priority] - priorityWeight[b.priority] || a.dueDate.localeCompare(b.dueDate) : a.dueDate.localeCompare(b.dueDate)),
  [todos, category, priority, status, search, sortPriority])

  const stats = useMemo(() => ({
    total: todos.length,
    completed: todos.filter((todo) => todo.completed).length,
    pending: todos.filter((todo) => !todo.completed).length,
    categories: ['work', 'education', 'personal'].map((name) => ({ name, count: todos.filter((todo) => todo.category === name).length })),
    priorities: ['high', 'medium', 'low'].map((name) => ({ name, count: todos.filter((todo) => todo.priority === name).length })),
  }), [todos])

  const addTodo = (event) => {
    event.preventDefault()
    if (!draft.text.trim()) return
    setTodos((current) => [...current, { id: Date.now(), text: draft.text.trim(), category: draft.category, priority: draft.priority, dueDate: draft.dueDate || new Date().toISOString().slice(0, 10), completed: false }])
    setDraft({ text: '', category: 'work', priority: 'medium', dueDate: '' })
  }

  return (
    <section className="exercise-panel" aria-labelledby="task3-heading">
      <div className="section-heading"><div><span className="eyebrow">Task 3 + Local Storage</span><h2 id="task3-heading">Advanced Todo List</h2><p>Combined filters, category badges, priority sorting, statistics, and persistent data.</p></div><button className="button ghost" onClick={() => setTodos(seedTodos)}>Restore sample todos</button></div>

      <div className="stats-grid" aria-label="Todo statistics">
        <article className="stat-card"><span>Total</span><strong>{stats.total}</strong></article>
        <article className="stat-card"><span>Completed</span><strong>{stats.completed}</strong></article>
        <article className="stat-card"><span>Pending</span><strong>{stats.pending}</strong></article>
        <article className="stat-card wide"><span>By category</span><div className="stat-pills">{stats.categories.map((item) => <span key={item.name} className={`badge category-${item.name}`}>{item.name}: {item.count}</span>)}</div></article>
        <article className="stat-card wide"><span>By priority</span><div className="stat-pills">{stats.priorities.map((item) => <span key={item.name} className={`badge priority-${item.name}`}>{item.name}: {item.count}</span>)}</div></article>
      </div>

      <form className="todo-form" onSubmit={addTodo} aria-label="Add todo">
        <label className="field grow"><span>New todo</span><input required value={draft.text} onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))} placeholder="What needs to be done?" /></label>
        <label className="field"><span>Category</span><select value={draft.category} onChange={(e) => setDraft((d) => ({ ...d, category: e.target.value }))}><option value="work">Work</option><option value="education">Education</option><option value="personal">Personal</option></select></label>
        <label className="field"><span>Priority</span><select value={draft.priority} onChange={(e) => setDraft((d) => ({ ...d, priority: e.target.value }))}><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
        <label className="field"><span>Due date</span><input type="date" value={draft.dueDate} onChange={(e) => setDraft((d) => ({ ...d, dueDate: e.target.value }))} /></label>
        <button className="button primary align-end" type="submit">Add todo</button>
      </form>

      <div className="toolbar compact" role="search" aria-label="Todo filters">
        <label className="field grow"><span>Search todos</span><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search text" /></label>
        <label className="field"><span>Category</span><select value={category} onChange={(e) => setCategory(e.target.value)}><option value="all">All</option><option value="work">Work</option><option value="education">Education</option><option value="personal">Personal</option></select></label>
        <label className="field"><span>Status</span><select value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All</option><option value="pending">Pending</option><option value="completed">Completed</option></select></label>
        <label className="field"><span>Priority</span><select value={priority} onChange={(e) => setPriority(e.target.value)}><option value="all">All</option><option value="high">High</option><option value="medium">Medium</option><option value="low">Low</option></select></label>
        <label className="check-field align-end"><input type="checkbox" checked={sortPriority} onChange={(e) => setSortPriority(e.target.checked)} />Priority sort</label>
      </div>

      <div className="todo-list" aria-live="polite">
        {filteredTodos.length === 0 ? <div className="mini-empty"><strong>No todos match these filters.</strong><button className="button small ghost" onClick={() => { setCategory('all'); setPriority('all'); setStatus('all'); setSearch('') }}>Clear filters</button></div> : filteredTodos.map((todo) => (
          <article className={`todo-item ${todo.completed ? 'completed' : ''}`} key={todo.id}>
            <input type="checkbox" aria-label={`Mark ${todo.text} as ${todo.completed ? 'pending' : 'completed'}`} checked={todo.completed} onChange={() => setTodos((current) => current.map((item) => item.id === todo.id ? { ...item, completed: !item.completed } : item))} />
            <div className="todo-main"><strong>{todo.text}</strong><div className="todo-meta"><span className={`badge category-${todo.category}`}>{todo.category}</span><span className={`badge priority-${todo.priority}`}>{todo.priority}</span><span>Due {todo.dueDate}</span></div></div>
            <button className="icon-button" aria-label={`Delete ${todo.text}`} onClick={() => setTodos((current) => current.filter((item) => item.id !== todo.id))}>×</button>
          </article>
        ))}
      </div>
    </section>
  )
}
