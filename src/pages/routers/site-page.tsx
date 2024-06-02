import { useEffect, useState } from 'react';
import { Layout, Menu, Modal, Skeleton } from 'antd';
import { Link, useParams, useLocation, Routes } from 'react-router-dom';
import { HomeOutlined, NotificationOutlined, SettingOutlined } from '@ant-design/icons';
import { logEvent } from 'firebase/analytics';
import { getAnalytic, getAuthService } from '../../firebase';
import { SiteEntity, getSiteById } from '../../firebase/site';


function SitePage() {
  const [isNarrow, setIsNarrow] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [site,setSite] = useState<SiteEntity | null>(null);

  const selectedRoute = () => {
    const parts = location.pathname.match(/\/apt\/[^/]+\/(.+)/i) || ['', 'overview'];
    return [parts[1]];
  };
  const showError = (error: string) => {
    logEvent(getAnalytic(), 'unauthorized_site_page_error');
    Modal.error({
      content: error,
    });
  };

  useEffect(() => {
    const fetchSite = async () => {
      try {
        const fetchedSite = await getSiteById(id as string);
        const currentUser = getAuthService().currentUser;
        if(!currentUser)return
        if(!currentUser.uid.includes(fetchedSite.yoneticiid) && !(await currentUser.getIdTokenResult()).claims.admin) return showError("Bu siteye erişemezsin!")
        if(fetchedSite){
            setSite(fetchedSite);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Error fetching site:', error);
      }
    };

    fetchSite();
    
  }, [id]);
  return (
    <div>
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
            <Menu.Item key="overview" icon={<HomeOutlined />}>
              <Link to={`/apt/${id}`}>Başlangıç</Link>
            </Menu.Item>
            <Menu.Item key="logs" icon={<NotificationOutlined />}>
              <Link to={`/apt/${id}/logs`}>Duyurular</Link>
            </Menu.Item>
            <Menu.Item key="settings" icon={<SettingOutlined />}>
              <Link to={`/apt/${id}/settings`}>Ayarlar</Link>
            </Menu.Item>
          </Menu>
        </Layout.Sider>
        <Layout.Content style={isNarrow ? { marginLeft: 0, padding: '8px' } : { marginLeft: '200px', padding: '24px' }}>
          {isLoading ? <Skeleton active /> : (
          <Routes>
        </Routes>
          )}  
        </Layout.Content>
      </Layout>
    </div>
  );
}

export default SitePage;