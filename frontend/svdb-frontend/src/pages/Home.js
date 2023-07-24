import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, Row, Col, Image, Select, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Tooltip, Input, notification } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined, HomeOutlined } from '@ant-design/icons';
import insertCss from 'insert-css';
import { getCreatorsFn } from "../services/creatorApi.ts";
import { getChannelsFn } from "../services/channelApi.ts";


import variables from '../sass/antd.module.scss'
import useFormatter from '../hooks/useFormatter';
import HorizontalVideoList from '../components/creator/HorizontalVideoList'
import StatisticsCards from '../components/creator/StatisticsCards'

import FrequencyCard from '../components/home/FrequencyCard';
import UploadTimeFrequencyCard from '../components/home/UploadTimeFrequencyCard';
import TopCreators from '../components/home/TopCreators'




const { Title, Text } = Typography;

const HomePage = () => {
  // const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [creators, setCreators] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState();
  const [top10videos, setTop10videos] = useState([]);
  const [mostRecentVideos, setMostRecentVideos] = useState([]);

  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  const [paramsTop10, setParamsTop10] = useState({sort: "views%desc"});
  const [paramsRecent, setParamsRecent] = useState({sort: "published_at%desc"});
  
  useEffect(() => {
    asyncFetch();
  }, []);
  
  const asyncFetch = () => {

    let params = new URLSearchParams();
    params.limit = 100;
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    // getCreatorsFn(params).then((result) => {
    //   if (result.results) {
    //     setCreators(result.results);
    //     const _creatorChannels = result.results.map(it => { return it.channels; });

    //     const allChannels = [];
    //     const channels = _creatorChannels.map((_channels) => {
    //       _channels.map((_channel) => {
    //         allChannels.push({
    //           label: _channel.title,
    //           key: _channel.channel_id,
    //         });
    //       });
    //     });
    //     console.log(allChannels)
    //     setChannels(allChannels);
    //     setSelectedChannels(allChannels.map(it => { return it._channe_id; }))
    //   }
    // })

    getChannelsFn(params).then((result) => {
      const _channels = result.results.map(it => {
        return {
          label: it.title,
          key: it.channel_id
        };
      });
      console.log(_channels)
      setChannels(result.results);
      setFilters({ channels: _channels });
      // setSelectedChannels(_channels.map(it => { return it.channel_id; }))

    });


    setIsLoaded(true);
  }


  insertCss(`  


  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  .homeHeaderPanel {
    margin: 10px 100px auto;
    color: `+ variables.sdmnYellow + `;
  }

  .homeHeaderPanel h3 {
    color: `+ variables.richBlack + `;
  }
  .homeHeaderPanel span {
    color: `+ variables.richBlack + `;
    gap: 5px;
  }
 
  .homeHeaderPanel button span {
    background: `+ variables.richBlack + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .homeContainer {
    margin: 0 100px auto;
  }

  @media (max-width: 600px) {
    .homeContainer {
      margin: 0 20px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }
  }
  `
  );
  const handleHomeChannelChange = (channel) => {
    console.log('handeling ', channel)
    // setSelectedChannels(channel);
  };

  const HeaderPanel = ({ title, creators }) => {
    useEffect(() => {
      console.log(creators)
    }, []);

    const content = (
      <p>{creators.length}</p>
    );

    return (
      <Row className="homeHeaderPanel">
        <Col span="22">
          <Title level={3}><Space><HomeOutlined /> {title}</Space></Title>
        </Col>
        <Col span="2">
          {/* TODO */}
          {/* <Popover content={content}>
            <Text italic>information</Text> 
          </Popover>*/}
        </Col>
      </Row>
    );
  };

  return (<>
    <HeaderPanel title="Home" creators={channels}></HeaderPanel>
    {isLoaded ?
      (
        <>
          <div className="homeContainer">

            <Row gutter={[16, 16]}>
              <Col span={24} md={24} lg={14} xl={14}>
                <Row gutter={16}>
                  <Col span={24}>                    
                    <HorizontalVideoList title="Most Recent" filter={paramsRecent}/>

                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10}/>
                  </Col>
                </Row>
              </Col>
              <Col span={24} md={24} lg={10} xl={10}>
                {/* <UploadTimeFrequencyCard _channels={channels}></UploadTimeFrequencyCard> */}
                <TopCreators></TopCreators>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]}>
              <Col span={24} xl={24}>
                <FrequencyCard _channels={channels}></FrequencyCard>
              </Col>
            </Row>

            <br></br>
            <Row gutter={[16, 16]}>
              <Col span={24} md={24} lg={12} xl={8}>
                <UploadTimeFrequencyCard _channels={channels}></UploadTimeFrequencyCard>
              </Col>
              <Col span={24} md={24} lg={12} xl={16}>
                <Row gutter={16}>
                  <Col span={24}>
                    <HorizontalVideoList title="Most Recent" filter={paramsRecent} />

                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10} />
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </>
      ) : (<Spin />)
    }
  </>);
};


export default HomePage;
