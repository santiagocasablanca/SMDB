import { Col, Image, List, Row, Select, Spin, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getTopCreatorsFn } from "../../services/creatorApi.ts";



const { Option } = Select;
const { Title, Text } = Typography;

const TopCreators = ({ channel_ids }) => {
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);



  useEffect(() => {


    async function fetchData() {
      console.log(channel_ids);
      if (channel_ids !== null && channel_ids.length > 0) {

        let params = new URLSearchParams();
        params.append("channels", channel_ids);
        // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
        await getTopCreatorsFn(1, 10, params).then((result) => {
          if (result.results) {
            setTopCreators(result.results);
          }
          setIsLoading(false);
        })
      }
    }
    fetchData();
  }, [channel_ids]);


  insertCss(`
  .ant-spin-container .ant-row {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
    .creatorCard:hover {
      cursor: pointer;
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

            {/* <Card bordered={false} className="topCreators" bodyStyle={{ padding: 20 }}> */}
              <Row style={{ height: '380px', overflow: 'auto' }} justify="center">
                <Col span={24}>

                  <List
                    grid={{
                      gutter: 10,
                      column: 2,
                    }}
                    itemLayout="vertical"
                    dataSource={topCreators}
                    style={{ marginLeft: 0, marginRight: 0 }}
                    renderItem={(item, index) => (
                      <List.Item
                        className="creatorCard"
                        onClick={() => handleClick(item.id)}>

                        <Image alt={item.name}
                          style={{ height: '100%', borderRadius: '8px', objectFit: 'cover', padding: '0px' }}
                          src={item.profile_picture} width='100%' height='200px' preview={false} />
                        <Title level={5} style={{color: 'black'}}>{item.name}</Title>

                      </List.Item>
                    )}
                  />
                </Col>
              </Row>
            {/* </Card> */}
          </>
        )}
    </>
  )
}

export default TopCreators
