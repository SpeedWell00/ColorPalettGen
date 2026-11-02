# React Lab 4 — Dynamic User Interfaces

Complete solution for **Lab 4: Building Dynamic User Interfaces with Conditional Rendering and Lists**.

## Included requirements

### Task 1 — Conditional Rendering (`Task1.jsx`)
- `&&` operator for premium badge
- ternary operator for Login/Logout
- multiple conditions for guest/admin/user sections
- early return loading state
- notification count with conditional styling

### Task 2 — User Management (`UserManagement.jsx`)
- required state variables and realistic starter data
- search by name + email
- role and active filters
- sort by name, join date, and role
- loading, error, no-users, no-results, and success states
- reusable loading/error/empty components

### Task 3 — Advanced Todo List (`AdvancedTodoList.jsx`)
- work / education / personal category filters and badges
- high / medium / low priorities and priority sorting
- text, completion, category, and priority filters that combine
- total, completed, pending, category, and priority statistics
- add / complete / delete todo interactions

### Task 4 — Performance Optimization (`OptimizedUserList.jsx`)
- stable unique IDs as React keys
- visible explanation of why index keys are problematic
- `useMemo` for expensive filtering/sorting
- `React.memo` for user rows
- manual fixed-row windowing for a 1,000-item list

## Bonus challenges
- 300 ms debounced real-time user search
- select-all, bulk delete, and bulk active/inactive operations
- user and todo persistence in `localStorage`
- ARIA labels, focus styles, semantic table markup, keyboard-operable controls, and arrow-key tab navigation

## Run locally

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
```

## Project structure

```text
src/
├── components/
│   ├── common/
│   │   └── StatusComponents.jsx
│   └── Exercises/
│       ├── Task1.jsx
│       ├── UserManagement.jsx
│       ├── AdvancedTodoList.jsx
│       └── OptimizedUserList.jsx
├── App.jsx
├── main.jsx
└── styles.css
```
