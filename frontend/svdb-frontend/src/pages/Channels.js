import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Row, Col, Image, Table, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Tooltip, Input, notification } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, UserOutlined, FilterOutlined,ReloadOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';

import { getChannelsFn } from "../services/channelApi.ts";

import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import dayjs from "dayjs";

const { Title } = Typography;

const ChannelsPage = () => {
  const navigate = useNavigate();

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);

  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

  useEffect(() => {
    asyncFetch(1);
    setInitLoading(false);
  }, []);

  const asyncFetch = (page = 1) => {
    let params = new URLSearchParams();
    params.append("sort", "views%desc");

    setIsLoading(true);
    console.log(page)
    getChannelsFn(page, 10, params).then((result) => {
      if (result.results) {
        if(result.results && result.results.length > 0) {
          setFetchedData((prevData) => [...prevData, ...result.results]);
          // setTotalResults(result.count);
  
          let _page = page + 1;
          setPage(_page);
          setIsLoading(false);
        } else {
          setHasMore(false);
        }
      }
    });
  };

  const onLoadMore = () => {
    asyncFetch(page);
  };

  insertCss(`
  .channelsBodyContainer {
    margin: 10px 100px auto;
  }

  .channelsHeaderPanel {
    padding: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .channelsHeaderPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }
 
  .channelsHeaderPanel button span {
    background: `+ variables.sdmnBlack + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .channels-list {
    padding: 10px;
  }

  @media (max-width: 600px) {
    .channelsBodyContainer {
      margin: 0 20px;
    }

    .channelsHeaderPanel {
      margin: 10px 10px auto;
    }
  }

  `)

  const HeaderPanel = ({ title, filters, onChange }) => {
    // style={{ color: 'black' }}
    return (
      <Row className="channelsHeaderPanel">
        <Col span="22">
          <Title level={3}><Space><UserOutlined /> {title}</Space></Title>
        </Col>
        <Col span="2">
          <div style={{ float: 'right' }}>
            {/* <Space.Compact block>
              {isAdmin ? (<Tooltip title="Add Channel">
                <AddCreatorModal />
              </Tooltip>) : ('')}
              <Tooltip title="Filter">
                <Button icon={<FilterOutlined />} />
              </Tooltip>
            </Space.Compact> */}

          </div>
        </Col>
      </Row>
    );
  };

  const handleClickChannel = (id) => {
    console.log(id);
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const loadMore =
    !initLoading && !loading && hasMore ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore}><ReloadOutlined /></Button>
        
      </div>
    ) : null;

  return (<>
    <div className="channelsBodyContainer">

      <HeaderPanel title="Channels"></HeaderPanel>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 5,
        }}
        className="channels-list"
        itemLayout="horizontal"
        loading={initLoading}
        loadMore={loadMore}
        // style={{
        //   background: variables.sdmnPink,
        //   padding: 20,
        //   marginTop: 20,
        //   marginBottom: 20,
        //   borderRadius: '5px'
        // }}
        // loading={isTop10VideosLoaded}
        dataSource={fetchedData}
        renderItem={(item, index) => (
          <List.Item>
            <Card title={item.title}
              style={{ width: '100%', maxWidth: '450px' }}
              bodyStyle={{ padding: 0 }}

              cover={
                // <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Image alt={item.name}
                  // style={{ maxHeight: '100%', objectFit: 'cover' }} borderRadius: '5px'
                  style={{ height: '300px', objectFit: 'cover' }}
                  src={item.logo_url}
                  onClick={() => handleClickChannel(item.channel_id)}
                  preview={false}
                  fallback="data:image/png;base64,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"
                />
                // </div>
              }
              hoverable
              // onClick={() => handleClickChannel(item.id)}
              key={item.channel_id}>

            </Card>
          </List.Item>
        )}
      />
    </div>
  </>);
};


export default ChannelsPage;
