import { useState } from 'react';
import { Layout, Menu } from 'antd';
import { Link, Route, Routes} from 'react-router-dom';
import { DashboardOutlined, TeamOutlined } from '@ant-design/icons';
import AdminHomePage from '../roles/admin/admin-home-page';

function AdminPage() {
  const [isNarrow, setIsNarrow] = useState(false);
  
  const selectedRoute = () => {
    const parts = location.pathname.match(/\/admin\/[^/]+\/(.+)/i) || ['', 'home'];
    return [ parts[1] ];
  };

  return (
    <Layout>
    <Layout.Sider
      style={{
        background: '#fff',
        height: '100vh',
        position: 'fixed',
        left: 0,
        zIndex: 2,
      }}
      breakpoint="md"
      collapsedWidth="0"
      onBreakpoint={setIsNarrow}
      zeroWidthTriggerStyle={{
        top: 'auto',
        bottom: '200px',
      }}
    >
      <Menu style={{ paddingTop: '24px', borderRight: 0 }} mode="inline" selectedKeys={selectedRoute()}>
        <Menu.Item key="overview" icon={<DashboardOutlined />}>
            <Link to={`/admin/`}>Ana Sayfa</Link>
          </Menu.Item>
          <Menu.Item key="user" icon={<TeamOutlined />}>
            <Link to={`/admin/users`}>Kullanıcılar</Link>
          </Menu.Item>
        </Menu>
      </Layout.Sider>
      <Layout.Content style={isNarrow ? {marginLeft: 0,padding: '8px',} : {marginLeft: '200px',padding: '24px',}}>
        <Routes>
          <Route path="/admin" element={<AdminHomePage/>} />
        </Routes>
      </Layout.Content>
    </Layout>
  );
}

export default AdminPage;