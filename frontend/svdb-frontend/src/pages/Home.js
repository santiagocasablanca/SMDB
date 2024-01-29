import { HomeOutlined } from '@ant-design/icons';
import { Carousel, Col, Row, Space, Spin, Typography, Popover } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import HorizontalHighlightedList from '../components/video/HorizontalHighlightedList';
import HorizontalShortsList from '../components/video/HorizontalShortsList';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn, fetchMostSubChannelByMonth } from "../services/channelApi.ts";
import { getVideosFn, getHighlightedVideosFn } from "../services/videoApi.ts";
import LatestVideosGrowthLine from '../components/graphs/LatestVideosGrowthLine';
import MonthlyHighlightedCreators from '../components/home/MonthlyHighlightedCreators';
import AppLoading from '../components/AppLoading';


const { Title, Text } = Typography;

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [top10videos, setTop10videos] = useState([]);
  // const [top10videoIds, setTop10videoIds] = useState([]);
  const [topChannelIds, setTopChannelIds] = useState([]);
  const [channelsGrowth, setChannelsGrowth] = useState([]);


  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  const [paramsTop10, setParamsTop10] = useState({ sort: "views%desc" });
  const [paramsRecent, setParamsRecent] = useState({ sort: "published_at%desc" });
  const [paramsTop10Liked, setParamsTop10Liked] = useState({ sort: "likes%desc" });
  const [shortsParamsRecent, setShortsParamsRecent] = useState({ sort: "published_at%desc", onlyShorts: true, excludeShorts: false });

  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();

  useEffect(() => {

    async function fetchData() {
      let now = dayjs();
      let oldDate = dayjs().subtract(30, 'days');
      let range = [];
      range.push(oldDate.format());
      range.push(now.format());

      fetchMostSubChannelByMonth(oldDate.format('YYYY-MM'))
        .then((result) => {
          // console.log(result);
          setChannelsGrowth(result.results);//calculateGrowthStatsForEachChannel(result.results));
        })


      let _paramsTop10 = new URLSearchParams();
      _paramsTop10.append("sort", "views%desc")
      _paramsTop10.append("publishedAtRange", range)
      getHighlightedVideosFn(1, 10, _paramsTop10)
        .then((result) => {
          // console.log(result);
          setTop10videos(result.videos);
          // setTop10videoIds(result.videos.map(video => { return video.video_id; }));
          setTopChannelIds(result.videos.map(video => { return video.channel_id; }));
        })


      getChannelsFn(1, 1000, null).then((result) => {
        const _channels = result.results.map(it => {
          return {
            label: it.title,
            key: it.channel_id
          };
        });

        setChannels(result.results);
        setFilters({ channels: _channels });
        // setSelectedChannels(_channels.map(it => { return it.channel_id; }))

      });


      await delay(550);
      setIsLoaded(true);


    }
    fetchData();
  }, []);

  async function delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  insertCss(`  
  .spinContent {
    padding: 50px;
    background: rgba(0, 0, 0, 0.01);
    border-radius: 4px;
  }
  
  .ant-spin-nested-loading >div>.ant-spin .ant-spin-text {
    text-shadow: 0px 0px;
    
  }

  .ant-picker-dropdown .ant-picker-content {
    width: auto;
  }


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
    margin-top: 25px;
  }

  .ant-carousel .slick-dots-bottom {
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
      margin-top: 25px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }

    .ant-carousel .slick-dots-bottom {
      bottom: 67px !important;
    }
  }
  `
  );

  return (<>
    {/* <HeaderPanel title="Home" channels={channels}></HeaderPanel> */}
    {/* isLoaded */}
    {isLoaded ?
      (
        <>
          <div className="homeContainer">
            {/* 
            <ChannelGrowthByMonth />
            <br></br> */}

            <MonthlyHighlightedCreators top10videos={top10videos} topChannelIds={topChannelIds} channelsGrowth={channelsGrowth} />
            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalHighlightedList title="Most Recent" filter={paramsRecent} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <LatestVideosGrowthLine title="Highlighted Videos Growth" filter={{ videos: top10videos }} />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalShortsList title="Most Recent Shorts" filter={shortsParamsRecent} />
              </Col>
            </Row>

            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalHighlightedList title="Most Viewed" filter={paramsTop10} />
              </Col>
            </Row>

            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalHighlightedList title="Most Liked" filter={paramsTop10Liked} />
              </Col>
            </Row>
            <br></br>

          </div>
        </>
      ) : (
        <AppLoading />
      )
    }
  </>);
};


export default HomePage;
