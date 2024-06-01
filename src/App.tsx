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
            {({ userState }) => userState ? (
                <>
                  <Routes>
                  <Route path="/logout" element={<LogoutPage/>} />
                  {userState.isAdmin ?? [
                    <Route key="admin" path="/admin/*" element={<AdminPage/>} />,
                    <Route key="home" path="/:uid?" element={<HomePage />} />,
                    <Route key="manager" path="/manager" element={<AdminPage/>} />,
                  ]}
                  
                  {userState.isMember ? [
                    <Route key="home" path="/" element={<HomePage/>} />
                  ] : [
                    <Route key="home" path="/" element={<HomePageUnAuthed/>} />
                  ]}

                  {userState.isManager ?? [
                    <Route key="manager" path="/" element={<AdminPage/>} />
                  ]}
                </Routes>
                </>
              ) : (
                <Routes>
                  <Route path="/*" element={<Navigate to="/"/>} />
                  <Route path="/logout" element={<LogoutPage/>} />
                  <Route path="/" element={<LoginPage/>} />
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