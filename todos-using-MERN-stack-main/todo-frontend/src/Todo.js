import { useEffect, useState } from "react";

const API_URL = "http://localhost:8000";

export default function Todo() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState({ title: "", description: "" });
  const [editForm, setEditForm] = useState({ id: null, title: "", description: "" });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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
  const handleSubmit = async () => {
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

    try {
      await fetch(`${API_URL}/todos/${id}`, { method: "DELETE" });
      setTodos((prev) => prev.filter((todo) => todo._id !== id));
    } catch {
      setError("Unable to delete todo");
    }
  };

  const showMessage = (msg) => {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  };

  return (
    <>
      <div className="row p-3 bg-primary text-white">
        <h1>TODO Project (MERN Stack)</h1>
      </div>

      <div className="row mt-3">
        <h3>Add Item</h3>
        {message && <p className="text-success">{message}</p>}
        {error && <p className="text-danger">{error}</p>}

        <div className="d-flex gap-3">
          <input
            className="form-control"
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            className="form-control"
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <button className="btn btn-success" onClick={handleSubmit}>
            Add
          </button>
        </div>
      </div>

      <div className="row mt-4">
        <h3>Tasks</h3>
        <ul className="list-group col-md-6">
          {todos.map((todo) => (
            <li key={todo._id} className="list-group-item d-flex justify-content-between">
              {editForm.id === todo._id ? (
                <>
                  <div className="d-flex gap-2 w-100">
                    <input
                      className="form-control"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                    <input
                      className="form-control"
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({ ...editForm, description: e.target.value })
                      }
                    />
                  </div>
                  <button className="btn btn-success" onClick={handleUpdate}>
                    Save
                  </button>
                  <button
                    className="btn btn-danger"
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
                  <div className="d-flex gap-2">
                    <button className="btn btn-info" onClick={() => handleEdit(todo)}>
                      Edit
                    </button>
                    <button
                      className="btn btn-danger"
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
    </>
  );
}
