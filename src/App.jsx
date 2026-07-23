/*
The root React Component 
Determines which page the users sees
*/
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useState } from "react";

function App() {
  
  const { currentUser } = useAuth();
  const [page, setPage] = useState("login");

  if (!currentUser) {

    if (page === "signup") {
      return ( <SignUp setPage={setPage} />);
    }

    return (<Login setPage={setPage} />);
  }

  return <Home />
}

export default App;