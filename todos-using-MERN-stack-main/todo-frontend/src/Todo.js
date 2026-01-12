import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editForm, setEditForm] = useState({ id: null, title: "", description: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  // ================= FETCH TODOS =================
  const fetchTodos = async () => {
    try {
      const res = await fetch(`${API_URL}/todos`);
      const data = await res.json();
      setTodos(data);
    } catch {
      setError("Failed to fetch todos");
    }
  };

  // ================= ADD TODO =================
  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!form.title.trim() || !form.description.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error();
      const newTodo = await res.json();

      setTodos((prev) => [...prev, newTodo]);
      setForm({ title: "", description: "" });
      showMessage("Item added successfully");
    } catch {
      setError("Unable to create todo item");
    }
  };

  // ================= EDIT =================
  const handleEdit = (todo) => {
    setEditForm({ id: todo._id, title: todo.title, description: todo.description });
  };

  // ================= UPDATE =================
  const handleUpdate = async () => {
    const { id, title, description } = editForm;
    if (!title.trim() || !description.trim()) return;

    try {
      const res = await fetch(`${API_URL}/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });

      if (!res.ok) throw new Error();

      setTodos((prev) =>
        prev.map((todo) =>
          todo._id === id ? { ...todo, title, description } : todo
        )
      );

      setEditForm({ id: null, title: "", description: "" });
      showMessage("Item updated successfully");
    } catch {
      setError("Unable to update todo item");
    }
  };

  // ================= DELETE =================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this todo?")) return;

    // Play a quick slide-out animation before removing.
    setDeletingId(id);
    setTimeout(async () => {
      try {
        await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
        setTodos((prev) => prev.filter((todo) => todo._id !== id));
      } catch {
        setError("Unable to delete todo");
      } finally {
        setDeletingId(null);
      }
    }, 220);
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <div className="row g-3 p-4 header-gradient text-white fade-in align-items-center rounded-3">
        <div className="col">
          <h1 className="h3 mb-1">TODO Project (MERN Stack)</h1>
          <p className="mb-0 opacity-75">Plan, add, edit, and complete tasks comfortably on any device.</p>
        </div>
      </div>

      <div className="row mt-3">
        <div className="col-12 col-md-8 col-lg-6 mx-auto">
          <form className="card shadow-sm p-3 fade-in" onSubmit={handleSubmit}>
            <div className="d-flex align-items-center justify-content-between flex-wrap gap-2 mb-2">
              <h3 className="mb-0">Add Item</h3>
              <small className="text-muted">Fields are required</small>
            </div>
            <div className="input-group-responsive">
              <input
                className="form-control input-glow"
                placeholder="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <input
                className="form-control input-glow"
                placeholder="Description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
              <button type="submit" className="btn btn-success hover-lift ripple-btn">
                Add
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="row mt-4">
        <h3>Tasks</h3>
        <ul className="list-group col-12 col-md-8 col-lg-6 mx-auto">
          {todos.map((todo, idx) => (
            <li
              key={todo._id}
              className={`list-group-item d-flex justify-content-between todo-item animate-pop stagger-item ${deletingId === todo._id ? 'slide-out' : ''}`}
              style={{ '--delay': `${idx * 60}ms` }}
            >
              {editForm.id === todo._id ? (
                <>
                  <div className="input-group-responsive expand-in">
                    <input
                      className="form-control input-glow"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                    <input
                      className="form-control input-glow"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                    />
                  </div>
                  <button className="btn btn-success hover-lift ripple-btn" onClick={handleUpdate}>
                    Save
                  </button>
                  <button
                    className="btn btn-danger hover-lift ripple-btn"
                    onClick={() => setEditForm({ id: null })}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <strong>{todo.title}</strong>
                    <p className="mb-0">{todo.description}</p>
                  </div>
                  <div className="d-flex gap-2 todo-actions">
                    <button className="btn btn-info hover-lift ripple-btn" onClick={() => handleEdit(todo)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger hover-lift ripple-btn"
                      onClick={() => handleDelete(todo._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Toast notifications */}
      {message && (
        <div className="toast-message">
          {message}
        </div>
      )}
      {error && (
        <div className="toast-message toast-error">
          {error}
        </div>
      )}
    </>
  );
}
