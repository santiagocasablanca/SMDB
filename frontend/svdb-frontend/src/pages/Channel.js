import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Typography, Space, Tabs, Spin } from 'antd';
import insertCss from 'insert-css';
import {
  useParams, useLocation
} from "react-router-dom";

import { getChannelFn } from "../services/channelApi.ts";

import ChannelTabs from "../components/channel/ChannelOverviewTab"
import Videography from "../components/creator/Videography";
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import ChannelOverviewTab from '../components/channel/ChannelOverviewTab';


const { Title, Text } = Typography;


const ChannelPage = () => {

  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const [channel, setChannel] = useState();
  // const {state} = useLocation();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();



  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = async () => {
    await getChannelFn(id).then((res) => {
      if (res.result) {
        setChannel(res.result);
        console.log(res.result);
        setIsFetched(true);      }
    });
  }



  // background-color: #ddd;
  // border: 2px solid #ffffff;

  insertCss(`
  .banner {
    background-color: #222;
    width: 100%;
    display: grid;
    color: #fff;
    font-size: 24px;
  }

  .banner img {
    height: 300px;
    object-fit: cover;
  }

  .profile {
    display: flex;
    margin: 20px 100px;
  }

  .profilePicture {
    width: 128px;
    height: 128px;
    background-size: cover;    
    background-repeat: no-repeat;
    float:right;
  }
  
  .radius {
    border-radius: 50%;
  }

  .name {
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
    color: `+ variables.oxfordBlue + `;
  }

  .stats-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .stats-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stats-list-item {
    display: flex;
    align-items: center;
  }

  .stats-list-item-icon {
    margin-right: 10px;
  }

  .stats-list-item-label {
    font-weight: bold;
  }

  .stats-list-item-value {
    margin-left: auto;
  }

  .heatmap-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .carousel {
    padding: 20px;
  }

  .carousel-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .carousel-card-title {
    font-size: 18px;
    font-weight: bold;
  }

  .carousel-card-created-at {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .carousel-card-total-videos {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .carousel-card-subs,
  .carousel-card-likes {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .yearly-heatmap {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
    height: 200px;
  }

  .channelContainer {
    margin: 0 100px auto;
    
  }

  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  .channel_info {
    align-items: flex-start;
    padding: 20px 10px;
  }

  .channel_info h3 {
    color: `+ variables.oxfordBlue + `;
    text-wrap: nowrap;
  }

  .channel_info h5 {
    color: `+ variables.oxfordBlue + `;
    text-wrap: nowrap;
    margin-top: -10px !important;
  }

  .channel_info p {
    color: `+ variables.oxfordBlue + `;
    text-wrap: nowrap;
    font-size: 13px;
    font-weight: 500;
    margin-top: 0px !important;
  }

  @media (max-width: 600px) {
    .channelContainer {
      margin: 0 20px;
    }

    .banner img {
      height: auto;
    }

    .profilePicture {
      width: 64px;
      height: 64px;
      float: left;
    }

    .channel_info {
      padding: 0px 10px;
    }
    
  }

  `)

  const filters = {

    channels: [channel?.channel_id],
    search: true
  }

  const shortsFilters = {
    channels: [channel?.channel_id],
    onlyShorts: true,
    excludeShorts: false,
    search: true
  };



  const bannerUrl = channel?.banner_url + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';
  return (
    <>
      {!isFetched ? (
        // <LoadingAnimation />
        <Spin />
      ) : (
          <div>
            <div className="banner">
              <Image src={bannerUrl}
                preview={false} />
            </div>

            <div className="channelContainer">
              <Row className="profile" gutter={16} justify="center">
                <Col span={4}>
                  <div className="profilePicture">
                    <Image className="radius" src={channel.logo_url} />
                  </div>
                </Col>
                <Col span={20}>
                  <div className="channel_info">
                    <Title level={3}>{channel.title}</Title>
                    <Space>
                      <Title level={5}>{channel.custom_url}</Title>
                      <p>{intToStringBigNumber(channel.subs)} subs</p>
                      <p>{intToStringBigNumber(channel.videos)} videos</p>
                    </Space>
                  </div>
                </Col>
              </Row>

              {/* TODO */}
              <Row gutter={16}>
                <Col span={24}>
                  <Tabs
                    defaultActiveKey="1"
                    // type="card"
                    size="large"
                    style={{
                      color: 'black',
                    }}
                    items={[{
                      label: 'Overview', key: '_overview', children: <> <Row gutter={16}>
                        <Col span={24}>
                          <ChannelOverviewTab _channel={channel}></ChannelOverviewTab>
                        </Col>
                      </Row></>
                    },
                    // { label: 'Graphs', key: '_graphs', children: <><CreatorGraphsPanel _filters={filters} /></> },
                    { label: 'Videography', key: '_videography', children: <><Videography _filters={filters} /></> },
                    {
                      label: 'Shorts', key: '_shorts', children: <><Videography title="Shorts" _filters={shortsFilters} /></>
                    },

                      // { label: 'Series', key: '_series', children: <><Videography /></> }, { label: 'Games', key: '_games' }, { label: 'Appearences', key: '_appearences' },
                    ]}
                  />
                </Col>
              </Row>
            </div>
          </div>
        )}
    </>
  );
};

export default ChannelPage;
