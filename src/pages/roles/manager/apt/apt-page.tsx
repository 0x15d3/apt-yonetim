import { Calendar, Card } from 'antd';
import { CSSProperties,} from 'react';
import { useParams } from 'react-router-dom';

const style: CSSProperties = {
  padding: '24px 0',
};

function AptPage() {
  const { uid } = useParams<{ uid:any }>();

  return (
    <div style={style}>
        <Card
                  data-testid="takvim-card"
                  title={"Takvim"}
                >
          <Calendar />;
        </Card>
    </div>
  );
}

export default AptPage;
