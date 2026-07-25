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
  const [page, setPage] = useState(APP_PAGES.HOME);

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

  if (page === AUTH_PAGES.LOGIN) {
    return <Login setPage={setPage} />;
  }

  if (page === AUTH_PAGES.SIGNUP) {
    return <SignUp setPage={setPage} />;
  }

  if (page === APP_PAGES.ACCOUNT && !currentUser) {
    return <Login setPage={setPage} />;
  }

  function renderPage() {
    switch(page) {
      case APP_PAGES.HOME:
        return <Home onNavigate={setPage} />;
      case APP_PAGES.ACCOUNT:
        return <Account />;
      case APP_PAGES.PAST_WINNERS:
        return <PastWinners />;
      default:
        return <Home onNavigate={setPage} />;
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
        onNavigate={setPage}
      />
      {renderPage()}
    </div>
  );
}

export default App;
