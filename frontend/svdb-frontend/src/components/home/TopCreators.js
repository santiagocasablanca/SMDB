import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Card, Divider, Button, Select,
  Row, Space, Popover,
  Image,
  Col, List, Typography, Spin
} from 'antd';
import { getTopCreatorsFn } from "../../services/creatorApi.ts"
import insertCss from 'insert-css';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { FilterOutlined } from '@ant-design/icons';


const { Option } = Select;
const { Title, Text } = Typography;

const TopCreators = () => {
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {

    let params = new URLSearchParams();
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    getTopCreatorsFn(1, 10, params).then((result) => {
      if (result.results) {
        setTopCreators(result.results);
      }
    })

    setIsLoading(false);
  }, []);


  insertCss(`
    .topCreators {
      padding: 0px;
    }
  `);

  const handleClick = (id) => {
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }


  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
          <>
            <Row>
              <Col span={24}>
                <Title style={{ color: "black" }} level={5}>Top Creators this week</Title>
              </Col>
            </Row>

            <Card className="topCreators">
              <div style={{ height: '480px', overflow: 'auto' }}>

                <List
                  grid={{
                    gutter: 8,
                    column: 2,
                  }}
                  itemLayout="vertical"
                  dataSource={topCreators}
                  renderItem={(item) => (
                    <List.Item>
                      <Card
                        title={item.name}
                        style={{ borderRadius: '8px', width: '100%', fontSize: '12px', border: '0px' }}
                        onClick={() => handleClick(item.id)}
                        bodyStyle={{ padding: '2px' }}>
                        <Image alt={item.name} 
                          style={{ height: '200px', borderRadius: '8px', objectFit: 'cover', padding: '0px' }} 
                          src={item.profile_picture} width='100%' height='200px' preview={false} />

                      </Card>
                    </List.Item>
                  )}
                />
              </div>
            </Card>
          </>
        )}
    </>
  )
}

export default TopCreators
