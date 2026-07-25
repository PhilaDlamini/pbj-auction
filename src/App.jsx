/*
The root React Component 
Determines which page the users sees
*/
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { useState } from "react";

function App() {

  const { currentUser } = useAuth();
  const [authPage, setAuthPage] = useState("login");
  const [appPage, setAppPage] = useState("home");

  if (!currentUser) {

    if (authPage === "signup") {
      return ( <SignUp setPage={setAuthPage} />);
    }

    return (<Login setPage={setAuthPage} />);
  }

  if (appPage === "account") {
    return <Account onNavigate={setAppPage} />;
  }

  return <Home onNavigate={setAppPage} />
}

export default App;