import { HomeOutlined } from '@ant-design/icons';
import { Carousel, Col, Row, Space, Spin, Typography } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import HorizontalVideoList from '../components/creator/HorizontalVideoList';
import FrequencyCard from '../components/home/FrequencyCard';
import TopCreators from '../components/home/TopCreators';
import UploadTimeFrequencyCard from '../components/home/UploadTimeFrequencyCard';
import HorizontalHighlightedList from '../components/video/HorizontalHighlightedList';
import HorizontalShortsList from '../components/video/HorizontalShortsList';
import VideoPreviewForHighlight from '../components/video/VideoPreviewForHighlight';
import variables from '../sass/antd.module.scss';
import { getChannelsFn } from "../services/channelApi.ts";
import { getVideosFn } from "../services/videoApi.ts";


const { Title, Text } = Typography;

const HomePage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [top10videos, setTop10videos] = useState([]);
  const [topChannelIds, setTopChannelIds] = useState([]);

  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });

  const [paramsTop10, setParamsTop10] = useState({ sort: "views%desc" });
  const [paramsRecent, setParamsRecent] = useState({ sort: "published_at%desc" });
  const [paramsTop10Liked, setParamsTop10Liked] = useState({ sort: "likes%desc" });
  const [shortsParamsRecent, setShortsParamsRecent] = useState({ sort: "published_at%desc", onlyShorts: true, excludeShorts: false });

  useEffect(() => {

    async function fetchData() {
      let now = dayjs();
      let oldDate = dayjs().subtract(7, 'days');
      let range = [];
      range.push(oldDate.format());
      range.push(now.format());


      let _paramsTop10 = new URLSearchParams();
      _paramsTop10.append("sort", "views%desc")
      _paramsTop10.append("publishedAtRange", range)
      await getVideosFn(1, 10, _paramsTop10)
        .then((result) => {
          setTop10videos(result.videos);
          setTopChannelIds(result.videos.map(video => { return video.channel_id; }));
        })

      let params = new URLSearchParams();
      params.limit = 100;
      await getChannelsFn(params).then((result) => {
        const _channels = result.results.map(it => {
          return {
            label: it.title,
            key: it.channel_id
          };
        });

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

  const HeaderPanel = ({ title, creators }) => {
    useEffect(() => {
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

  const HighlightedVideos = ({ title, videos }) => {
    return (
      <>
        <Row><Col span={24}><Title style={{ color: 'black' }} level={5}>{title}</Title></Col></Row>

        <Carousel dots={false} style={{ color: variables.richBlack }} autoplay>
          {videos?.map((video, index) => {
            return (
              <VideoPreviewForHighlight _video={video} key={video.video_id}></VideoPreviewForHighlight>
            )

          })}
        </Carousel>
      </>
    );
  }


  return (<>
    <HeaderPanel title="Home" creators={channels}></HeaderPanel>
    {isLoaded ?
      (
        <>
          <div className="homeContainer">

            <Row gutter={[16, 16]}>
              <Col span={24} md={24} lg={12} xl={12}>
                <Row gutter={12}>
                  <Col span={24}>
                    <HighlightedVideos title="Highlighted" videos={top10videos}></HighlightedVideos>
                  </Col>
                </Row>
              </Col>
              <Col span={24} md={24} lg={12} xl={12}>
                <TopCreators channel_ids={topChannelIds} />
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalHighlightedList title="Most Recent" filter={paramsRecent} />
              </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]} className="hide-on-small-screen">
              <Col span={24} xl={24}>
                <FrequencyCard _channels={channels}></FrequencyCard>
              </Col>
            </Row>
            <br></br>
            <Row>
              <Col span={24}>
                <HorizontalShortsList title="Most Recent Shorts" filter={shortsParamsRecent} />
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
                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10} />

                    <HorizontalVideoList title="Most Liked" filter={paramsTop10Liked} />
                  </Col>
                </Row>
              </Col>
            </Row>

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


export default HomePage;
