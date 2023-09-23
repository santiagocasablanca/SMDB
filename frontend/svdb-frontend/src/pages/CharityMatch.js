import { HomeOutlined } from '@ant-design/icons';
import { Carousel, Col, Row, Space, Spin, Typography, Tag, Table } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import FrequencyCardByYear from '../components/home/FrequencyCardByYear';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn } from "../services/channelApi.ts";
import { getVideosFn, getHighlightedVideosFn } from "../services/videoApi.ts";
import LatestVideosGrowthLine from '../components/graphs/LatestVideosGrowthLine';
import VideoRate from '../components/video/VideoRate';
import Locations from '../components/video/Locations';
import FrequencyCard from '../components/home/FrequencyCard';


const { Title, Text, Link } = Typography;

const CharityMatch = () => {
  const navigate = useNavigate();

  const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSecondsWithLegend } = useFormatter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [channels, setChannels] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });


  useEffect(() => {

    async function fetchData() {
      // let now = dayjs();
      // let oldDate = dayjs().subtract(2, 'months');
      // let range = [];
      // range.push(oldDate.format());
      // range.push(now.format());

      let _params = new URLSearchParams();
      _params.append("sort", "views%desc")
      _params.append("title", "charity match")
      // _params.append("publishedAtRange", range)
      await getVideosFn(1, 1000, _params)
        .then((result) => {
          // console.log(result);
          setVideos(result.videos);
          setIsLoaded(true);
        });
    }
    fetchData();
  }, []);

  insertCss(`  
  .ant-pagination {
    background: #202020;
    padding: 10px 5px;
    margin-top: 0px !important;
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

  const handleClickVideo = (id) => {
    console.log(id);
    const url = '/video/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }


  const columns = [
    {
      key: 'channel_title',
      dataIndex: 'channel_title',
      title: 'Channel',
      width: '10%',
      ellipsis: true,
    },
    {
      key: 'rating',
      dataIndex: 'video_id',
      title: 'Rating',
      width: '6%',
      render: (video_id) => (
        (
          <span>
            <VideoRate _video={getVideoById(video_id)} small={true} />
          </span>)
      ),
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      width: '30%'
    },
    { key: 'duration_parsed', title: 'Duration', dataIndex: 'duration_parsed', align: 'right', render: (text) => <p>{displayVideoDurationFromSecondsWithLegend(text)}</p> },
    { key: 'published_at', title: 'Published At', dataIndex: 'published_at', render: (text) => <p style={{whiteSpace: 'nowrap'}}>{dayjs(text).format("DD MMM YYYY")}</p> },
    { key: 'views', title: 'Views', dataIndex: 'views', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'likes', title: 'Likes', dataIndex: 'likes', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'comments', title: 'Comments', dataIndex: 'comments', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    // {
    //   key: 'tags',
    //   width: '10%',
    //   title: "Tags",
    //   dataIndex: 'tags',
    //   render: (tags) => (
    //     (
    //       Array.isArray(tags) ?
    //         <span>
    //           {tags.map((tag) => {
    //             // let color = tag.length > 5 ? variables.sdmnYellow : 'green';
    //             return (
    //               <Tag color={variables.sdmnBlack} key={tag}>
    //                 {tag}
    //               </Tag>
    //             );
    //           })}
    //         </span> : ''
    //     )
    //   ),
    // },
    {
      key: 'locations',
      width: '10%',
      title: "Locations",
      dataIndex: 'locations',
      render: (locations) => (
        (
          <span>
            <Locations video={{ locations: locations }} _showLabel={false} />
          </span>
        )
      ),
    }
  ]

  const getVideoById = (id) => {
    return videos.find(it => it.video_id === id);
  }

  return (<>
    <br></br>
    <Title style={{ color: 'black', marginLeft: '100px' }} level={3}>Sidemen Charity Match 2023</Title>
    <Text style={{ color: 'black', marginLeft: '100px' }}>The Sidemen Charity Match 2023 (and other editions) in stats </Text>
    <br></br>
    <Link style={{ marginLeft: '100px' }} target="_blank" href="https://www.teenagecancertrust.org/events/music-and-entertainment/sidemen-charity-match">Read More about the event</Link>
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
            <Row>
                <Col span={24}>
                    <Title style={{ color: "black" }} level={5}>Charity Match related Videography</Title>
                </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Table columns={columns} dataSource={videos}
                  rowKey={(record) => record.video_id}
                  onRow={(record, rowIndex) => {
                    return {
                      // onClick: (event) => {}, // click row
                      onDoubleClick: (event) => { handleClickVideo(record.video_id) }, // double click row
                      // onContextMenu: (event) => {}, // right button click row
                      // onMouseEnter: (event) => {}, // mouse enter row
                      // onMouseLeave: (event) => {}, // mouse leave row
                    };
                  }} />
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


export default CharityMatch;
