import { HomeOutlined } from '@ant-design/icons';
import { Carousel, Col, Row, Space, Spin, Typography, Popover } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import FrequencyCardByYear from '../components/home/FrequencyCardByYear';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn } from "../services/channelApi.ts";
import { getVideosFn, getHighlightedVideosFn } from "../services/videoApi.ts";

const { Title, Text } = Typography;

const Display = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);

  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();

  useEffect(() => {

    async function fetchData() {
      

      let params = new URLSearchParams();
      params.append("channels", "UCvwgF_0NOZe2vN4Q3g1bY-A,UCmbnlwXAdGYACzvStDjquaA,UCBXG9Hl9f94Zfoceh1a8otQ,UC0OevbYhRrD3UP1jJlYB7qw");
      await getChannelsFn(1, 1000, params).then((result) => {
        const _channels = result.results.map(it => {
          return {
            label: it.title,
            key: it.channel_id
          };
        });
console.log(result.results);
        setChannels(result.results);
        setFilters({ channels: _channels });
        // setSelectedChannels(_channels.map(it => { return it.channel_id; }))

        setIsLoaded(true);
      });


    }
    fetchData();
  }, []);

  insertCss(`  


  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  .homeHeaderPanel {
    margin: 20px 100px auto;
    margin-bottom: 20px;
    
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

  :where(.css-dev-only-do-not-override-kda5v0).ant-carousel .slick-dots-bottom {
    bottom: 55px !important;
  }

  @media (max-width: 768px) {
    .hide-on-small-screen {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .homeContainer {
      margin: 0 20px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }

    :where(.css-dev-only-do-not-override-kda5v0).ant-carousel .slick-dots-bottom {
      bottom: 67px !important;
    }
  }
  `
  );




  return (<>
    <br></br>
    <Title style={{color: 'black', marginLeft: '100px'}} level={3}>Was Vikk bullshitting?</Title>
    <Text style={{color: 'black', marginLeft: '100px'}}>Answering Simon calling out Vikk's Upload Streak claim!</Text>
    {isLoaded ?
      (
        <>
          <div className="homeContainer">

            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2010'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2011'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2012'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2013'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2014'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2015'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2016'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2017'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2018'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2019'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2020'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2021'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2022'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCardByYear _channels={channels} year='2023'></FrequencyCardByYear>
              </Col>
            </Row>
            <br></br>

            
          </div>
        </>
      ) : (
        <Row justify="center">
          <Spin />
        </Row>
      )
    }
  </>);
};


export default Display;
