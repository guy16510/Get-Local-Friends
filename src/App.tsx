// import { useEffect, useState } from "react";
// import type { Schema } from "../amplify/data/resource";
// import { generateClient } from "aws-amplify/data";
// import { useAuthenticator } from '@aws-amplify/ui-react';

// const client = generateClient<Schema>();

// function App() {
//   const { signOut } = useAuthenticator();
//   const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

//   useEffect(() => {
//     client.models.Todo.observeQuery().subscribe({
//       next: (data) => setTodos([...data.items]),
//     });
//   }, []);

//   function createTodo() {
//     client.models.Todo.create({ content: window.prompt("Todo content") });
//   }

//   function doSomething(){
//     client.queries.sayHello({
//       name: "Amplify",
//     });
//   }
    
//   function deleteTodo(id: string) {
//     client.models.Todo.delete({ id })
//   }

//   return (
//     <main>
//       <button onClick={signOut}>Sign out</button>
//       <h1>My todos</h1>
//       <button onClick={createTodo}>+ new</button>
//       <button onClick={doSomething}>+ New Shit</button>

//       <ul>
//         {todos.map((todo) => (
//           <li 
//           onClick={() => deleteTodo(todo.id)}
//           key={todo.id}>{todo.content}</li>
          
//         ))}
//       </ul>
//       <div>
//         🥳 App successfully hosted. Try creating a new todo.
//         <br />
//         <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
//           Review next step of this tutorial.
//         </a>
//       </div>
//     </main>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import HomePage from './components/HomePage';
import SignupForm from './components/SignupForm';
import ContactUs from './components/ContactUs';
import ProfilePage from './components/ProfilePage';

const App: React.FC = () => {
  return (
    <Router>
      <nav style={{ marginBottom: '20px' }}>
        <Link to="/">Home</Link> |{' '}
        <Link to="/signup">Sign Up</Link> |{' '}
        <Link to="/contact">Contact Us</Link> |{' '}
        <Link to="/profile">Profile</Link>
      </nav>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  );
};

export default App;
