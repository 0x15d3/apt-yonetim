import { CSSProperties,} from 'react';
import { useParams } from 'react-router-dom';
import SiteList from '../site/site-main';

const style: CSSProperties = {
  padding: '24px 0',
};

function HomePage() {
  const { uid } = useParams<{ uid:any }>();
  
  return (
    <div style={style}>
        <SiteList id={uid}/>
    </div>
  );
}

export default HomePage;