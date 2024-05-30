
import { Link } from 'react-router-dom';


function Logo() {
  return (
    <Link to="/">
      <div>
      <span style={{fontSize: '24px',fontWeight: 'bold',color: '#fff'}}> 
        Apt Yönetim
      </span>
      </div>
    </Link>
  );
}

export default Logo;