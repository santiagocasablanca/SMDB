import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, Row, Col, Image, Select, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Tooltip, Input, notification } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined } from '@ant-design/icons';
import insertCss from 'insert-css';
import { getCreatorsFn } from "../services/creatorApi.ts";
import { getChannelsFn } from "../services/channelApi.ts";

import { getVideosFn } from "../services/videoApi.ts";

import variables from '../sass/antd.module.scss'
import useFormatter from '../hooks/useFormatter';
import HorizontalVideoList from '../components/creator/HorizontalVideoList'
import StatisticsCards from '../components/creator/StatisticsCards'

import CreatorFrequencyCard from '../components/creator/CreatorFrequencyCard';
import CreatorUploadTimeFrequencyCard from '../components/creator/CreatorUploadTimeFrequencyCard';




const { Title, Text } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [creators, setCreators] = useState([]);
  const [channels, setChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState();
  const [top10videos, setTop10videos] = useState([]);
  const [mostRecentVideos, setMostRecentVideos] = useState([]);

  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = async () => {

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

    // TODO remove shorts!? duration > 5 min
    let paramsTop10 = new URLSearchParams();
    paramsTop10.append("sort", "views%desc");
    for (const property in filters) {
      if (filters[property] && filters[property] != '' && filters[property].length >= 1)
        paramsTop10.append(property, filters[property]);
    }
    // paramsTop10.append("channels", creatorChannels);

    await getVideosFn(1, 10, paramsTop10)
      .then((result) => {
        setTop10videos(result.videos);
      })

    let paramsRecent = new URLSearchParams();
    paramsRecent.append("sort", "published_at%desc")
    for (const property in filters) {
      if (filters[property] && filters[property] != '' && filters[property].length >= 1)
        paramsRecent.append(property, filters[property]);
    }
    // paramsRecent.append("channels", creatorChannels);

    await getVideosFn(1, 10, paramsRecent)
      .then((result) => {
        setMostRecentVideos(result.videos);
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
    padding: 10px 30px;
    color: `+ variables.sdmnYellow + `;
  }

  .homeHeaderPanel h3 {
    color: `+ variables.oxfordBlue + `;
  }
  .homeHeaderPanel span {
    color: `+ variables.richBlack + `;
    float: right;
  }
 
  .homeHeaderPanel button span {
    background: `+ variables.oxfordBlue + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .homeContainer {
    padding: 10px 30px;
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
          <Title level={3}>{title}</Title>
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
              <Col span={24} xl={12}>
                <Row gutter={16}>
                  <Col span={24}>
                    <Title style={{ color: 'black' }} level={5}>Most Recent</Title>
                    <HorizontalVideoList _videos={mostRecentVideos} />

                    <Title style={{ color: 'black' }} level={5}>Most Viewed</Title>
                    <HorizontalVideoList _videos={top10videos} />
                  </Col>
                </Row>
              </Col>
              <Col span={24} xl={12}>
                <CreatorUploadTimeFrequencyCard _channels={channels}></CreatorUploadTimeFrequencyCard>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]}>
              <Col span={24} xl={24}>
                <CreatorFrequencyCard _channels={channels}></CreatorFrequencyCard>
              </Col>
            </Row>
          </div>
        </>
      ) : (<Spin />)
    }
  </>);
};


export default HomePage;
