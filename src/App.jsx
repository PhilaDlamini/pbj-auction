/*
The root React Component 
Determines which page the users sees
*/
import Home from './pages/Home.jsx';
import Account from './pages/Account.jsx';
import PastWinners from './pages/PastWinners.jsx';
import Login from './pages/Login.jsx';
import SignUp from './pages/Signup.jsx';
import Header from './components/Header.jsx';
import { useAuth } from './context/AuthContext.jsx';
import { logout } from './firebase/auth.js';
import { useEffect, useState } from "react";
import { APP_PAGES, AUTH_PAGES } from './constants/pages.js';

function App() {

  const { currentUser, account } = useAuth();
  const [page, setPage] = useState(APP_PAGES.HOME); //The current page the user is on. Defaults to home.

  //if the user is now logged in and they are on the login or signup page, redirect them to the home page
  useEffect(() => {
    if (
      currentUser &&
      (page === AUTH_PAGES.LOGIN || page === AUTH_PAGES.SIGNUP)
    ) {
      setPage(APP_PAGES.HOME);
    }
  }, [currentUser, page]);

  async function handleLogout() {
    try {
      await logout();
      setPage(APP_PAGES.HOME);
    } catch (error) {
      console.error(error);
    }
  }

  // If the user is on the login page, render the login component
  if (page === AUTH_PAGES.LOGIN) {
    return <Login setPage={setPage} />;
  }

  // If the user is on the signup page, render the signup component
  if (page === AUTH_PAGES.SIGNUP) {
    return <SignUp setPage={setPage} />;
  }

  // If the user is on the account page and they are not logged in, redirect them to the login page
  if (page === APP_PAGES.ACCOUNT && !currentUser) {
    return <Login setPage={setPage} />;
  }

  // Render the appropriate page based on the current page state
  function renderPage() {
    switch(page) {
      case APP_PAGES.HOME:
        return <Home setPage={setPage} />;
      case APP_PAGES.ACCOUNT:
        return <Account />;
      case APP_PAGES.PAST_WINNERS:
        return <PastWinners />;
      default:
        return <Home setPage={setPage} />;
    }
  }

  return (
    <div className="page">
      <Header
        currentUser={currentUser}
        account={account}
        onLogin={() => setPage(AUTH_PAGES.LOGIN)}
        onLogout={handleLogout}
        activePage={page}
        setPage={setPage}
      />
      {renderPage()}
    </div>
  );
}

export default App;
