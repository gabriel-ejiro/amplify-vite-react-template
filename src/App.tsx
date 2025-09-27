import { useEffect, useState } from "react";
import type { Schema } from "../amplify/data/resource";
import { useAuthenticator } from '@aws-amplify/ui-react';
import { useEffect, useState } from 'react';
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

function App() {

  const { signOut } = useAuthenticator();	
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

 
  useEffect(() => {
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });

    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id }).then(() => {
      // Update local state after deletion
      setTodos((prev) => prev.filter((todo) => todo.id !== id));
    });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li
            key={todo.id}
            onClick={() => deleteTodo(todo.id)}
            style={{ cursor: "pointer" }} // optional: makes it clear it's clickable
          >
            {todo.content}
          </li>
        ))}
	<button onClick={signOut}>Sign Out</button>
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;

