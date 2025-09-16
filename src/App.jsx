import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import authService from './appwriteservices/auth';
import { login, logout } from './features/auth/authSlice';
// import Header from './components/Header'; // Assuming you have Header/Footer
// import Footer from './components/Footer';

function App() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    authService.getCurrentUser()
      .then((userData) => {
        if (userData) {
          dispatch(login(userData));
        } else {
          dispatch(logout());
        }
      })
      .finally(() => setLoading(false));
  }, [dispatch]);
  
  // Conditionally render a loading screen or the app content
  return !loading ? (
    <div className='min-h-screen flex flex-wrap content-between bg-gray-50'>
      <div className='w-full block'>
        {/* <Header /> */}
        <main>
          <Outlet />
        </main>
        {/* <Footer /> */}
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
    </div>
  );
}

export default App;