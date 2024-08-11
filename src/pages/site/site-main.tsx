import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, Descriptions, List, Result, Skeleton, Tag } from 'antd';
import { getSiteList, SiteEntity } from '../../firebase/site';
import { PageHeader } from '@ant-design/pro-components';
import { getAuthService } from '../../firebase';
import { isMobile } from 'react-device-detect';
import SiteCreationButton from './createbutton';

interface ListPrompts{
  id? : string
}

function SiteList({id}:ListPrompts){
  const [sites, setSites] = useState<SiteEntity[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const userId= getAuthService().currentUser!.uid;
  useEffect(() => {
    if(!userId){
        return
    }
    const fetchSiteList = async () => {
        try {
          if(id){
            const siteList = await getSiteList(id);
            setSites(siteList);
          }
          else{
          const siteList = await getSiteList(userId);
          setSites(siteList);
          }
        } catch (error) {
          console.error('Error fetching site list:', error);
        } finally {
          setIsLoading(false);
        }
      }


      fetchSiteList();
  }, [userId,id]);

  return (
    <div style={isMobile ? {margin: '0 auto'}: {width: '960px',margin: '0 auto'}}>
      <PageHeader
        style={{padding: '16px 0 16px 0'}}
        title={`Sitelerin | Apartmanların`}
        {...(!isLoading && sites.length > 0 ? { extra: <SiteCreationButton /> } : {})}
        //{...(userId ? { tags: <ImmersiveModeTag /> } : {})}
      />

      {isLoading && <Skeleton active />}
      {!isLoading && sites.length > 0 && (
        <List
          data-testid="site-list"
          grid={{ gutter: 16, column: 3, xs: 1, sm: 2, md: 2 }}
          dataSource={sites}
          renderItem={site => (
            <List.Item>
              <Link to={site.type == 'apartman' ? `/apt/${site.id}` : `/site/${site.id}`}>
                <Card
                  data-testid="site-card"
                  title={site.isim}
                  extra={<Tag>{site.type}</Tag>}
                >
                  <Descriptions column={1}>
                    {site.type == 'apartman' ?
                    <Descriptions.Item label="Daire Sayısı">{site.dairesayisi || '(Ayarlanmamış)'}</Descriptions.Item> :
                    <Descriptions.Item label="Blok Sayısı">{site.bloksayisi || '(Ayarlanmamış)'}</Descriptions.Item>
                    }
                    <Descriptions.Item label="Görevli Sayısı">{site.gorevlisayisi || '(Belirsiz)'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Link>
            </List.Item>

          )}
        />
      )}
      {!isLoading && sites.length === 0 && (
        <Result
          data-testid="site-empty-list"
          status="403"
          title="Siten bulunmamakta"
          extra={<SiteCreationButton> {"İlk Siteni Oluştur"}</SiteCreationButton>}
          />
      )}
      </div>
  );
}

export default SiteList;
