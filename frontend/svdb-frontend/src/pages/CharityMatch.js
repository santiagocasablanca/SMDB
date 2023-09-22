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
import LatestVideosGrowthLine from '../components/graphs/LatestVideosGrowthLine';

const { Title, Text, Link } = Typography;

const CharityMatch = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();

  useEffect(() => {

    async function fetchData() {

      let _params = new URLSearchParams();
      _params.append("sort", "views%desc")
      _params.append("title", "charity match")
      await getVideosFn(1, 10, _params)
        .then((result) => {
          // console.log(result);
          setVideos(result.videos);
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
    <Title style={{ color: 'black', marginLeft: '100px' }} level={3}>Sidemen Charity Match 2023</Title>
    <Text style={{ color: 'black', marginLeft: '100px' }}>The Sidemen Charity Match 2023 in stats </Text> 
    <br></br>
    <Link style={{marginLeft: '100px' }}target="_blank" href="https://www.teenagecancertrust.org/events/music-and-entertainment/sidemen-charity-match">Read More about the event</Link>
    {isLoaded ?
      (
        <>
          <div className="homeContainer">
            <br></br>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <LatestVideosGrowthLine title="Charity Match Videos Views Growth" filter={{ videos: videos }} />
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


export default CharityMatch;
