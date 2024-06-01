import { CSSProperties,} from 'react';

const style: CSSProperties = {
  padding: '24px 0',
};

function HomePageUnAuthed() {
  
  return (
    <div style={style}>
        Şu anda herhangi bir siteye/apartmana kayıtlı değilsiniz.
    </div>
  );
}

export default HomePageUnAuthed;