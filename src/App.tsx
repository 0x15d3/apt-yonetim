import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { initializeFirebase } from './firebase';
import { AuthContext, AuthProvider } from './providers/AuthProvider';
import FullPageLoading from './components/page/page-loading';
import LoginPage from './pages/auth/login-page';
import LogoutPage from './pages/auth/logout-page';
import AdminPage from './pages/routers/admin-page';
import Header from './components/header/header';
import Footer from './components/footer/footer';
import HomePage from './pages/roles/manager/home-page';
import HomePageUnAuthed from './pages/main/home-page-unauthed';
import AptRouter from './pages/routers/apt-router';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    initializeFirebase().then(() => {
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return <FullPageLoading />;
  }

  return (
    <AuthProvider>
      <Router>
        <Layout style={{ minHeight: '100vh' }}>
        <Header />
          <Layout.Content style={{ margin: '64px 0' }}>
          <AuthContext.Consumer>
            {({ userState }) => (
              <Routes>
                {userState ? (
                  <>
                    {userState.isAdmin && [
                      <Route key="home" path="/:uid?" element={<HomePage/>} />,
                      <Route key="admin" path="/admin/*" element={<AdminPage />} />
                    ]}
                    {userState.isManager && [
                      <Route key="home" path="/" element={<HomePage />} />,
                      <Route path="/apt/:id/*" element={<AptRouter/>} />
                    ]}
                    {!userState.isAdmin && !userState.isManager && (
                      <Route key="home" path="/" element={userState.isMember ? <HomePage /> : <HomePageUnAuthed />} />
                    )}
                    <Route key="logout" path="/logout" element={<LogoutPage />} />
                  </>
                ) : (
                  <>
                    <Route path="/logout" element={<LogoutPage />} />
                    <Route path="/*" element={<Navigate to="/" />} />
                    <Route path="/" element={<LoginPage />} />
                  </>
                )}
              </Routes>
            )}
          </AuthContext.Consumer>
          </Layout.Content>
          <Footer />
        </Layout>
      </Router>
    </AuthProvider>
  );
}

export default App;
