import { Col, Image, Row, Space, Tabs, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Appearences from "../components/creator/Appearences";
import ChannelTabs from "../components/creator/ChannelTabs";
import Videography from "../components/creator/Videography";
import Guests from "../components/channel/Guests";
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import { getCreatorFn } from "../services/creatorApi.ts";
import CreatorGraphsPanel from "../components/creator/CreatorGraphsPanel";



const { Title, Text } = Typography;


const CreatorPage = () => {

  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [creator, setCreator] = useState([]);
  const [channelIds, setChannelIds] = useState([]);
  // const {state} = useLocation();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();



  useEffect(() => {
    asyncFetch();
  }, [id]);

  const asyncFetch = async () => {
    await getCreatorFn(id).then((res) => {
      if (res.result) {
        setCreator(res.result);
        setIsFetched(true);
        setChannelIds(res.result.channels.map(channel => { return channel.channel_id }));
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

  const OverviewTab = (
    <Row gutter={16}>
      <Col span={24}>
        <ChannelTabs _creator={creator} _channels={creator.channels}></ChannelTabs>
      </Col>
    </Row>
  );

  const filters = {
    channels: channelIds,
    onlyShorts: false,
    excludeShorts: true,
    search: true
  }

  const shortsFilters = {
    channels: channelIds,
    onlyShorts: true,
    excludeShorts: false,
    search: true
  };

  const appearencesFilters = {
    // channels: channelIds,
    excludedChannels: channelIds,
    castMember: [creator.id],
    onlyShorts: false,
    excludeShorts: true,
    search: true
  }

  const guestsFilters = {
    channels: channelIds,
    notInCastMember: [creator.id],
    onlyShorts: false,
    excludeShorts: true,
    search: true
  }


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
                    items={[{
                      label: 'Overview', key: '_overview', children: <> <Row gutter={16}>
                        <Col span={24}>
                          <ChannelTabs _creator={creator} _channels={creator.channels}></ChannelTabs>
                        </Col>
                      </Row></>
                    },
                    { label: 'Graphs', key: '_graphs', children: <><CreatorGraphsPanel title="Graphs" _channels={creator.channels} /></> },
                    { label: 'Videography', key: '_videography', children: <><Videography _filters={filters} /></> },
                    {
                      label: 'Shorts', key: '_shorts', children: <><Videography title="Shorts" _filters={shortsFilters} /></>
                    },
                    { label: 'Appearences', key: '_appearences', children: <><Appearences title="Appearences" _filters={appearencesFilters} /> </> },
                    { label: 'Guests', key: '_guests', children: <><Guests title="Guests" _filters={guestsFilters} /> </> }


                      // { label: 'Series', key: '_series', children: <><Videography /></> }, { label: 'Games', key: '_games' }, { label: 'Appearences', key: '_appearences' }, 
                    ]}
                  />
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

// headStyle={{
//   textOverflow: 'ellipsis',
//   overflow: 'hidden',
//   whiteSpace: 'nowrap'
// }}
export default CreatorPage;
