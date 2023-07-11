import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Typography, Space, Tabs } from 'antd';
import insertCss from 'insert-css';
import ReactPlayer from 'react-player'
import {
  useParams, useLocation
} from "react-router-dom";

import { getCreatorFn, getCreatorsFn } from "../services/creatorApi.ts";
import { getVideosFn } from "../services/videoApi.ts";

import ChannelTabs from "../components/creator/ChannelTabs"
import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';


const { Title, Text } = Typography;


const CreatorPage = () => {

  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [creator, setCreator] = useState([]);
  // const {state} = useLocation();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();



  useEffect(() => {
    console.log(id);
    asyncFetch();
  }, []);

  const asyncFetch = async () => {
    await getCreatorFn(id).then((res) => {
      if (res.result) {
        console.log(res.result);
        setCreator(res.result);
        setIsFetched(true);
      }
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

  .creatorContainer {
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
    .creatorContainer {
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

  const bannerUrl = creator.banner_picture + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';
  return (
    <>
      {!isFetched ? (
        // <LoadingAnimation />
        <p>Loading...</p>
      ) : (
          <div>
            <div className="banner">
              <Image src={bannerUrl}
                preview={false} />
            </div>

            <div className="creatorContainer">
              <Row className="profile" gutter={16} justify="center">
                <Col span={4}>
                  <div className="profilePicture">
                    <Image className="radius" src={creator.profile_picture} />
                  </div>
                </Col>
                <Col span={20}>
                  <div className="channel_info">
                    <Title level={3}>{creator.name}</Title>
                    <Space>
                      <Title level={5}>{creator.custom_url}</Title>
                      <p>{intToStringBigNumber(creator.subs)} subs</p>
                      <p>{intToStringBigNumber(creator.videos)} videos</p>
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
                    items={[{ label: 'Overview', key: '_overview' }, { label: 'Graphs?', key: '_graphs' },
                    { label: 'Series', key: '_series' }, { label: 'Games', key: '_games' }, { label: 'Appearences/Crossover', key: '_appearences' },
                    { label: 'Shorts', key: '_shorts' }, { label: 'Videography', key: '_videography' }]}
                  />
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <ChannelTabs _creator={creator} _channels={creator.channels}></ChannelTabs>
                </Col>
              </Row>






              {/* <div className="yearly-heatmap"> */}
              {/* <FrequencyCard /> */}
              {/* </div> */}
            </div>
          </div>
        )}
    </>
  );
};


{/* <Row gutter={16}>
<Col span={24}>
  <List
    grid={{
      gutter: 8,
      column: 8,
    }}
    title="this could work as channel filters for the 'body' of the page"
    className="scrollmenu"
    itemLayout="horizontal"
    style={{
      background: variables.sdmnPink,
      padding: 10,
      marginTop: 20,
      marginBottom: 20
    }}
    // loading={isTop10VideosLoaded}
    dataSource={creator.channels}
    renderItem={(item) => (
      <List.Item>
        {/* title={item.title} */}
// <Card
//   bodyStyle={{ padding: 0 }}
//   cover={
// <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
// <Image alt={item.name}
// style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
//   src={item.logo_url}
//   preview={false}
//   fallback="data:image/png;base64,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"
// />
// </div>
// }>
// {/* <span>{item.likes}</span> */}
//         </Card>
//       </List.Item>
//     )}
//   />
// </Col>
// </Row> */}

// headStyle={{
//   textOverflow: 'ellipsis',
//   overflow: 'hidden',
//   whiteSpace: 'nowrap'
// }}
export default CreatorPage;
