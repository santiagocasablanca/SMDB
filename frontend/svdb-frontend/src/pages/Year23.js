
import { EyeOutlined, LikeOutlined, LineChartOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Space, Spin, Typography, List, Divider, Timeline, Tag, Grid, Drawer, Image } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalHighlightedList from '../components/video/HorizontalHighlightedList';
import HorizontalShortsList from '../components/video/HorizontalShortsList';
import VideoPreviewForHighlight from '../components/video/VideoPreviewForHighlight';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn, fetchMostSubChannelByMonth } from "../services/channelApi.ts";
import { getVideosFn, getVideoFn } from "../services/videoApi.ts";
// import VideoDrawer from './VideoDrawer';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';

const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const Year23Page = () => {
  const navigate = useNavigate();
  const { xs } = useBreakpoint(); // xs is one of the elements returned if screenwidth exceeds 991
  const myDrawerSize = xs ? 'small' : 'large';

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [top10videos, setTop10videos] = useState([]);
  const [open, setOpen] = useState(false);


  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow, displayVideoDurationInMinutes } = useFormatter();

  useEffect(() => {

    async function fetchData() {
      let now = dayjs();
      let oldDate = dayjs('2023-01-01');  //.subtract(1, 'year');
      let range = [];
      range.push(oldDate.format());
      range.push(now.format());




      let _paramsTop = new URLSearchParams();
      _paramsTop.append("sort", "views%desc")
      _paramsTop.append("publishedAtRange", range)
      await getVideosFn(1, 100, _paramsTop)
        .then((result) => {
          // console.log(result);
          const sorted = result.videos?.sort(
            (a, b) => new Date(a.published_at) - new Date(b.published_at)
          );
          setTop10videos(sorted.map(video => {
            return {
              dot: (
                <YoutubeOutlined
                  style={{
                    fontSize: '19px',
                  }}
                />
              ),
              label: parseDate(video.published_at),
              color: 'red',
              children: <VideoCard video={video} childToParent={childToParent} />,
            }
          }));
          // setTop10videoIds(result.videos.map(video => { return video.video_id; }));
          setIsLoaded(true);
          // setTopChannelIds(result.videos.map(video => { return video.channel_id; }));
        })

    }
    fetchData();
  }, []);

  const fetchVideo = async (video_id) => {
    await getVideoFn(video_id)
      .then((result) => {
        console.log(result);
        setSelectedVideo(result.result);
        setOpen(true);
      });

  }

  const childToParent = (childdata) => {
    fetchVideo(childdata.video_id);
  }

  const onClose = () => {
    setOpen(false);
  };

  const handleClickVideo = (id) => {
    console.log(id);
    const url = '/video/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const goToChannel = (id) => {
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const goToCreator = (id) => {
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
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

  .ant-timeline .ant-timeline-item-head-custom {
    background-color: transparent;
  }

  .respText {
    font-size: 12px;
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

  .year23Container {
    margin: 0 100px auto;
    margin-top: 25px;
  }

  .ant-carousel .slick-dots-bottom {
    bottom: 55px !important;
  }

  .drawerThumbnail {
    width: 100% !important;
    height: 400px !important;
  }

  .outerDiv {
    margin-right: 10px; 
    max-width: 100%;
  }

  .headerDiv {
    width: 100%;
    display: flex;
    justify-content: flex-start;
    gap: 5px;
    color: black;
    margin-bottom: 5px;
    align-items: baseline;
  }


  .thumbDivBig {
    width: 100%;
    height: 349px;
  }

  .titleDiv {
    color: black; 
    width: 520px; 
    margin-top: 10px;
    margin-bottom: 5px;
    cursor: pointer;
  }


  @media (max-width: 1400px) {
    .year23Container {
      margin: 0 20px;
      margin-top: 25px;
    }

    .outerDiv {
      max-width: 100%; 
    }
  
    .headerDiv {
      width: 100%;
    }
  
    .thumbDivBig {
      width: 100%;
      height: 249px;
    }
  
    .titleDiv {
      color: black; 
      width: 100%;
    }
  }


  @media (max-width: 600px) {
    .year23Container {
      margin: 0 10px;
      margin-top: 25px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }

    .respText {
      font-size: 10px;
    }

    .respChannelTitle {
      font-size: 11px;
    }

    .outerDiv {
      max-width: 240px;
    }

    .headerDiv {
      width: 100%;
      display: flex;
      flex-wrap: wrap;
    }

    .titleDiv {
      width: 100%;
      
    }

    .thumbDivBig {
      width: 100%;
      height: 100px;
    }

    .drawerThumbnail {
      width: 312px !important;
      height: 200px !important;
    }

    .ant-carousel .slick-dots-bottom {
      bottom: 67px !important;
    }
  }
  `
  );


  const VideoCard = ({ video, childToParent }) => {
    const [channel, setChannel] = useState(video?.channel);
    const [logo, setLogo] = useState(video?.channel?.logo_url);
    const [opacity, setOpacity] = useState('1');


    useEffect(() => {

      setChannel(video?.channel);
      setLogo(video?.channel?.logo_url);
    }, [video]);

    const goToChannel = () => {
      const url = '/channel/' + video.channel_id;
      // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
      navigate(url, { state: { id: video.channel_id } });
    }

    const handleClickVideo = (id) => {
      console.log(id);
      childToParent(video);
      // const url = '/video/' + id;
      // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
      // navigate(url, { state: { id: id } });
    }

    return (
      <div style={{ opacity: opacity }} className="outerDiv"
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '1';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = opacity;
        }}>
        <div style={{ padding: '5px' }}>
          <div className="headerDiv">
            <div onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
              e.currentTarget.style.borderRadius = '8px';
            }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'inherit';
                e.currentTarget.style.borderRadius = 'inherit';
              }}>
              <Avatar src={logo} onClick={goToChannel} size="small" style={{ marginRight: '5px', cursor: 'pointer' }} />
              <Text className="respChannelTitle" style={{ color: 'black', cursor: 'pointer' }} strong onClick={goToChannel}>{video.channel.title}</Text>
            </div>
            <Text className="respText" style={{ color: 'gray' }}> released</Text>
          </div>
          <div>
            <div className="thumbDivBig">
              <Image onClick={() => handleClickVideo(video.video_id)} style={{ borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                placeholder={true}
                src={video.url} width="100%" height="100%" preview={false} />
            </div>

            <Title className="titleDiv" style={{ color: 'black' }}
              ellipsis={{ tooltip: video.title }}
              onClick={() => handleClickVideo(video.video_id)}
              level={5}>{video.title}</Title>

            <div style={{ color: 'black', display: 'inline-flex', gap: '5px', flexWrap: 'wrap', alignItems: 'center' }}>
              <Text style={{ color: 'gray' }}> {intToStringBigNumber(video.views)} views</Text>
              <Divider style={{ backgroundColor: 'gray', cursor: 'pointer', fontSize: '12px' }} type="vertical"></Divider>
              <Text style={{ color: 'gray', fontSize: '12px' }}>{displayVideoDurationInMinutes(video.duration)} min</Text>
              <div style={{ color: 'white', fontSize: '10px', backgroundColor: 'black', opacity: '0.8', borderRadius: '8px', padding: '3px' }}>
                <VideoRate _video={video} />
              </div>
            </div>
          </div>
        </div>
        <br></br>
      </div>
    );
  };


  return (<>
    {/* <HeaderPanel title="Home" channels={channels}></HeaderPanel> */}
    {isLoaded ?
      (
        <>
          <div className="year23Container">
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                <Title style={{ color: 'black', justify: 'center' }} level={1}>'23 Top 100</Title>
                <Timeline
                  mode="alternate"
                  items={top10videos}
                />
              </Col>
            </Row>
            <br></br>
          </div>
          <Drawer title={parseDate(selectedVideo?.published_at, 'DD MMM YYYY')} placement="right" size={myDrawerSize} onClose={onClose} open={open}>
            <div style={{ marginRight: '10px' }}>
              <div style={{ padding: '5px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '5px', color: 'black', marginBottom: '5px', alignItems: 'baseline' }}>
                  <div onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                    e.currentTarget.style.borderRadius = '8px';
                  }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'inherit';
                      e.currentTarget.style.borderRadius = 'inherit';
                    }}>
                    <Avatar src={selectedVideo?.channel?.logo_url} onClick={() => goToChannel(selectedVideo?.channel.channel_id)} style={{ marginRight: '5px', cursor: 'pointer' }} />
                    <Text style={{ color: 'white', cursor: 'pointer' }} strong onClick={() => goToChannel(selectedVideo?.channel.channel_id)}>{selectedVideo?.channel?.title}</Text>
                  </div>
                  <Text style={{ color: 'gray' }}> released</Text>
                </div>

                <div>
                  <Image onClick={() => handleClickVideo(selectedVideo.video_id)} style={{ borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                    placeholder={true}
                    src={selectedVideo.url} className="drawerThumbnail" preview={false} />

                  <Title style={{ color: 'white', marginTop: '10px', marginBottom: '5px', cursor: 'pointer' }}
                    ellipsis={{ tooltip: selectedVideo?.title }}
                    onClick={() => handleClickVideo(selectedVideo?.video_id)}
                    level={5}>{selectedVideo?.title}</Title>

                  <div style={{ color: 'black', display: 'inline-flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
                    <Text style={{ color: 'gray' }}> {intToStringBigNumber(selectedVideo?.views)} views</Text>
                    <Divider style={{ backgroundColor: 'gray', cursor: 'pointer', fontSize: '12px' }} type="vertical"></Divider>
                    <Text style={{ color: 'gray', fontSize: '12px' }}>{displayVideoDurationInMinutes(selectedVideo.duration)} min</Text>
                    <div style={{ color: 'white', fontSize: '10px', backgroundColor: 'black', opacity: '0.8', borderRadius: '8px', padding: '3px' }}>
                      <VideoRate _video={selectedVideo} />
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {selectedVideo?.tags ?
                    <>
                      <Space>
                        <Text strong style={{ color: 'white' }}>Tags </Text>
                        <Space size={[0, 6]} wrap>
                          {selectedVideo.tags && selectedVideo.tags?.map((tag, index) => {
                            return (
                              <Tag
                                key={tag + 'tags'}
                                closable={false}
                                style={{
                                  userSelect: 'none'
                                }}>
                                <span>
                                  {tag}
                                </span>
                              </Tag>
                            )
                          })
                          }
                        </Space>
                      </Space>
                    </>
                    : null
                  }

                  {selectedVideo?.serie ?
                    <>
                      <Space>
                        <Text strong style={{ color: 'white' }}>Series </Text>
                        <Space size={[0, 6]} wrap>
                          {selectedVideo.serie && [selectedVideo.serie]?.map((tag, index) => {
                            return (
                              <Tag
                                key={tag + 'series'}
                                color={variables.sdmnPink}
                                closable={false}
                                style={{
                                  userSelect: 'none',
                                  color: 'black'
                                }}>
                                <span>
                                  {tag}
                                </span>
                              </Tag>
                            )
                          })
                          }
                        </Space>
                      </Space>
                    </> : null
                  }
                  {selectedVideo?.game ?
                    <Space>
                      <Text strong style={{ color: 'white' }}>Game </Text>
                      <Space size={[0, 6]} wrap>
                        {selectedVideo.game && [selectedVideo.game]?.map((tag, index) => {
                          return (
                            <Tag
                              key={tag + 'game'}
                              color={variables.sdmnLightBlue}
                              closable={false}
                              style={{
                                userSelect: 'none',
                                color: 'black'
                              }}>
                              <span>
                                {tag}
                              </span>
                            </Tag>
                          )
                        })
                        }
                      </Space>
                    </Space>

                    : null
                  }

                  <Space>
                    <Text strong style={{ color: 'white' }}>Directed By </Text>
                    <Space size={[0, 6]} wrap>
                      {selectedVideo.directedBy && selectedVideo.directedBy.length > 0 ?
                        selectedVideo.directedBy.map((item, index) => {
                          return (
                            <div style={{ color: 'white' }}>
                              <div
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                                  e.currentTarget.style.borderRadius = '8px';
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.backgroundColor = 'inherit';
                                  e.currentTarget.style.borderRadius = 'inherit';
                                }}>
                                <Avatar src={item.profile_picture} size="small" onClick={() => goToCreator(item.id)} style={{
                                  marginRight: '5px', cursor: 'pointer'
                                }} />
                                <Text style={{ color: 'white', marginRight: '5px', cursor: 'pointer' }} strong
                                  onClick={() => goToCreator(item.id)}>{item.name}</Text>

                              </div>
                            </div>

                          )
                        }) : <Text style={{ color: 'white' }}>No Data</Text>
                      }
                    </Space>
                  </Space>

                  {selectedVideo.cast && selectedVideo.cast.length > 0 ?
                    <List
                      style={{ marginTop: '-12px' }}
                      header={<Text strong style={{ color: 'white' }}>Cast</Text>}
                      size="small"
                      grid={{
                        gutter: 16,
                        xs: 1,
                        sm: 1,
                        md: 1,
                        lg: 2,
                        xl: 2,
                        xxl: 2,
                      }}
                      // locale={{ emptyText: <Empty text="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{ padding: '2px', height: '32px' }}></Empty> }}
                      itemLayout="horizontal"
                      dataSource={selectedVideo?.cast}
                      renderItem={(creator, index) => (
                        <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer" style={{ color: 'black' }}>
                          <List.Item.Meta onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                            e.currentTarget.style.borderRadius = '8px';
                          }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'inherit';
                              e.currentTarget.style.borderRadius = 'inherit';
                            }}
                            avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} size="small" />}
                            title={<><Text style={{ color: 'white' }}>{creator.name}</Text> <Text italic type="secondary" style={{ color: 'gray' }}> as {creator.video_creator.role}</Text></>}

                          />
                        </List.Item>
                      )} >
                    </List>
                    :
                    <>
                      <Space>
                        <Text strong style={{ color: 'white' }}>Cast </Text>
                        <Space size={[0, 6]} wrap><Text style={{ color: 'white' }}>No Data</Text></Space>
                      </Space>
                    </>
                  }
                </div>
                <br></br>
              </div>
            </div>
          </Drawer>
        </>
      ) : (
        <Row justify="center" style={{ marginTop: '70px' }}>
          <Spin spining="true" tip="Loading..." size="large" >
            <div className="spinContent" />
          </Spin>
        </Row>
      )
    }
  </>);
};


export default Year23Page;
