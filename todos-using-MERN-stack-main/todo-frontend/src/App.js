import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Todo from './Todo';

function App() {
  return (
    <div className="app-shell">
      <div className="container app-container">
        <Todo />
      </div>
    </div>
  );
}

export default App;
