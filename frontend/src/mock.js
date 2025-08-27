// Mock git commit data for testing
export const mockCommits = [
  {
    id: "c1a2b3c4",
    message: "Add user authentication system",
    author: "Alice Johnson", 
    date: "2024-07-15T10:30:00Z",
    type: "feature",
    files: ["auth.js", "login.jsx", "middleware.js"],
    additions: 245,
    deletions: 12,
    description: "Implemented complete user authentication with JWT tokens and password hashing"
  },
  {
    id: "d5e6f7g8", 
    message: "Fix memory leak in data processing",
    author: "Bob Smith",
    date: "2024-07-14T14:20:00Z", 
    type: "bug",
    files: ["processor.py", "utils.js"],
    additions: 8,
    deletions: 15,
    description: "Resolved memory leak caused by unclosed database connections in batch processing"
  },
  {
    id: "h9i0j1k2",
    message: "Refactor API response structure", 
    author: "Carol Davis",
    date: "2024-07-13T09:45:00Z",
    type: "refactor", 
    files: ["api.js", "response.js", "handlers.js"],
    additions: 156,
    deletions: 203,
    description: "Restructured API responses for better consistency and error handling"
  },
  {
    id: "l3m4n5o6",
    message: "Implement dark mode toggle",
    author: "David Wilson", 
    date: "2024-07-12T16:15:00Z",
    type: "feature",
    files: ["theme.css", "toggle.jsx", "context.js"],
    additions: 89,
    deletions: 3,
    description: "Added system-wide dark mode with user preference persistence"
  },
  {
    id: "p7q8r9s0",
    message: "Fix broken image uploads on mobile",
    author: "Eve Martinez",
    date: "2024-07-11T11:30:00Z", 
    type: "bug",
    files: ["upload.js", "mobile.css"],
    additions: 23,
    deletions: 7,
    description: "Resolved image upload failures on iOS Safari and Android Chrome browsers"
  },
  {
    id: "t1u2v3w4",
    message: "Optimize database queries for performance",
    author: "Frank Brown", 
    date: "2024-07-10T13:20:00Z",
    type: "refactor",
    files: ["queries.sql", "orm.js", "cache.js"], 
    additions: 67,
    deletions: 89,
    description: "Improved query performance by 40% through indexing and caching strategies"
  }
];

export const commitTypes = {
  feature: {
    color: "bg-emerald-500",
    lightColor: "bg-emerald-100", 
    darkColor: "bg-emerald-600",
    icon: "Plus",
    label: "Feature",
    description: "New functionality added"
  },
  bug: {
    color: "bg-red-500", 
    lightColor: "bg-red-100",
    darkColor: "bg-red-600", 
    icon: "Bug",
    label: "Bug Fix",
    description: "Issue resolution"
  },
  refactor: {
    color: "bg-blue-500",
    lightColor: "bg-blue-100", 
    darkColor: "bg-blue-600",
    icon: "RefreshCw", 
    label: "Refactor",
    description: "Code improvement"
  }
};