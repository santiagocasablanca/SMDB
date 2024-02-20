import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, List, Row, Space, Typography, Divider, Avatar, Empty, Popover, Tooltip, Tag, Spin } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import ReactPlayer from 'react-player/youtube';
import LocationsMap from '../components/video/LocationsMap';
import UpdateVideoModal from '../components/video/UpdateVideoModal';
import { getVideoFn } from "../services/videoApi.ts";
import TinyLineViews from '../components/graphs/TinyLineViews';
import AppLoading from '../components/AppLoading';



const { Title, Text } = Typography;
const { Search } = Input;

const VideoPage = () => {
  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDateToFromNow, parseDuration, displayVideoDurationInMinutes } = useFormatter();
  const [video, setVideo] = useState();
  const [channel, setChannel] = useState();

  useEffect(() => {
    asyncFetch();
  }, [id]);

  const asyncFetch = async () => {
    await getVideoFn(id).then((res) => {
      // console.log(res)
      if (res.result) {
        setVideo(res.result);
        setChannel(res.result.channel);
        setIsFetched(true);
      }
    });
  }
  // width: 100%; /* Adjust the width as needed */
  // white-space: nowrap;
  // text-overflow: ellipsis;
  insertCss(`

  .ant-list-sm .ant-list-item {
    padding: 5px 16px;
}

  .videoBodyContainer {
    padding: 10px 80px 0px 80px;
  }

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .headerPanel h4 {
    color: `+ variables.sdmnBlack + `;
  }

  .divider {
    background-color: black;
    margin: 0px 10px;
  }

.videoContainer {
    height: 550px;
   
    overflow: hidden;
}

.videoMapContainer {
  height: 250px;
  overflow: hidden;
}

.panelContainer span, h4 {
  color: black; 
}
.tagsContainer {
  display: flex;
}

.tagsContainer span {
  color: black; 
}

.infoStatsComponent {
  float: right; 
  padding: 5px;
  margin-bottom: 8px;
  margin-top: 0px;
}

.infoStatsComponent span {
  color: black; 
  font-size: 13px;
}

.evenMoreInfoComponent{
  height: 352px;
  overflow: auto
}

.showPointer:hover {
    cursor: pointer;
}

@media (max-width: 1480px) {
    .videoBodyContainer {
        padding: 10px 20px 0 20px;
    }
    .videoContainer {
        height: 300px;
    }

    .divider {
      margin: 0px 6px;
    }

}

@media (max-width: 900px) {
    .videoBodyContainer {
        padding: 0 20px 0 20px;
    }
    .videoContainer {
      margin: 0 -20px 0 -20px;        
      border-radius: 0px;
      height: 400px;
    }
}

@media (max-width: 600px) {
  .headerPanel {
    padding: 5px;
    color: `+ variables.sdmnYellow + `;
    overflow: hidden;
    text-wrap: nowrap;
    width: 100%;
    text-overflow: ellipsis;
  }
  
  .headerPanel h4 {
    margin-bottom: 0px !important;
    text-overflow: ellipsis;
  }

  .videoBodyContainer {
    padding: 0 8px 0 8px;
}

    .videoContainer {
      margin: 0 -8px 0 -8px;
        height: 240px;
        border-radius: 0px;
    }


    .divider {
      margin: 0px 4px;
    }

    .infoStatsComponent  {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .infoStatsComponent span {
      font-size: 10px;
    }

    .evenMoreInfoComponent{
      height: 250px;
    }
}

  `)

  const VideoCardChannelBody = ({ item }) => {

    // const navigate = useNavigate();
    const goToChannel = (id) => {
      // console.log('going to channel?');
      const url = '/channel/' + id;
      // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
      navigate(url, { state: { id: id } });
    };

    return (
      <div style={{
        color: 'black', display: 'flex',
        alignItems: 'center'
      }}>
        <div
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
            e.currentTarget.style.borderRadius = '8px';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'inherit';
            e.currentTarget.style.borderRadius = 'inherit';
          }}>
          <Avatar src={item.channel.logo_url} onClick={() => goToChannel(item.channel.channel_id)} style={{
            marginRight: '5px', cursor: 'pointer'
          }} />
          <Text style={{ color: 'black', marginRight: '5px', cursor: 'pointer' }} strong
            onClick={() => goToChannel(item.channel.channel_id)}>{item.channel.title}</Text>
          <Text style={{ color: 'gray', cursor: 'pointer', fontSize: '12px', }}
            onClick={() => goToChannel(item.channel.channel_id)}>{intToStringBigNumber(item.channel.subs)} subs</Text>
        </div>
        <Divider style={{ backgroundColor: 'gray', cursor: 'pointer', fontSize: '12px' }} type="vertical"></Divider>
        <Text style={{ color: 'gray', fontSize: '12px' }}>{displayVideoDurationInMinutes(video.duration)} min</Text>
      </div>
    );
  };

  const goToCreator = (id) => {
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  {/* <YoutubeOutlined />  */ }
  return (<>
    {isFetched && video ?
      <>
        <div className="videoContainer">
          <ReactPlayer url={video.player.embedHtml} controls={true} width='100%' height="100%"></ReactPlayer>
        </div>
        <div className="videoBodyContainer">
          <Row>
            <Col span={24} md={24} lg={12} xl={12}>
              <Tooltip title={video?.title}>
                <Title level={4} className="headerPanel" style={{ color: 'black' }}>
                  <UpdateVideoModal video={video} _icon={<YoutubeOutlined />} _color="black" big={false} /> {video?.title}
                </Title>
              </Tooltip>
              <div className="tagsContainer">
                <VideoCardChannelBody item={video} />
                {video?.tags ?
                  <Space>
                    <Text strong style={{ marginLeft: '20px', fontSize: '11px' }}>Tags </Text>
                    <Space size={[0, 6]} wrap>
                      {video.tags && video.tags?.map((tag, index) => {
                        return (
                          <Tag
                            key={tag + 'tags'}
                            closable={false}
                            style={{
                              userSelect: 'none', fontSize: '11px'
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

              </div>
            </Col>
            <Col span={24} md={24} lg={12} xl={12}>
              <div className="infoStatsComponent showPointer">
                <Tooltip title={parseDate(video?.published_at, "DD MMM YYYY HH:MM")}>
                  <span> {parseDateToFromNow(video?.published_at)}</span>
                </Tooltip>
                <Divider type="vertical" className="divider"></Divider>
                <Popover title={video.title} content={<VideoGrowthLine _video={video} />} placement="bottomRight"><span><EyeOutlined /> {intToStringBigNumber(video.views)}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <span><LikeOutlined /> {intToStringBigNumber(video.likes)}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <span><CommentOutlined /> {intToStringBigNumber(video.comments)}</span></Popover>
                <Divider type="vertical" className="divider"></Divider>
                <VideoRate _video={video}></VideoRate>
              </div>
            </Col>
          </Row>
          <Divider style={{ backgroundColor: 'black' }}></Divider>
          <Row>
            <Col span={24} md={12} lg={12} xl={12}>
              {video?.serie ?
                <Space>
                  <Text strong style={{ color: 'black' }}>Series </Text>
                  <Space size={[0, 6]} wrap>
                    {video.serie && [video.serie]?.map((tag, index) => {
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
                : null
              }
              {video?.game ?
                <Space>
                  <Text strong style={{ color: 'black' }}>Game </Text>
                  <Space size={[0, 6]} wrap>
                    {video.game && [video.game]?.map((tag, index) => {
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
            </Col>
          </Row>
          <br></br>
          <Row>
            <Col span={24} md={24} lg={24} xl={24}>
              <Space>
                <Text strong style={{ color: 'black' }}>Directed By </Text>
                <Space size={[0, 6]} wrap>
                  {video.directedBy && video.directedBy.length > 0 ?
                    video.directedBy.map((item, index) => {
                      return (
                        <div style={{ color: 'black' }}>
                          <div
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                              e.currentTarget.style.borderRadius = '8px';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'inherit';
                              e.currentTarget.style.borderRadius = 'inherit';
                            }}>
                            <Avatar src={item.profile_picture} size="large" onClick={() => goToCreator(item.id)} style={{
                              marginRight: '5px', cursor: 'pointer'
                            }} />
                            <Text style={{ color: 'black', marginRight: '5px', cursor: 'pointer' }} strong
                              onClick={() => goToCreator(item.id)}>{item.name}</Text>

                          </div>
                        </div>

                      )
                    }) : <Text style={{ color: 'black' }}>No Data</Text>
                  }
                </Space>
              </Space>
            </Col>
          </Row>
          <Row>
            <Col span={24} md={24} lg={12} xl={12}>
              {video.cast && video.cast.length > 0 ?
                <List
                  header={<Text strong style={{ color: 'black' }}>Cast</Text>}
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
                  dataSource={video?.cast}
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
                        avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} size="large" />}
                        title={<><Text style={{ color: 'black' }}>{creator.name}</Text> <Text italic type="secondary" style={{ color: 'gray' }}> as {creator.video_creator.role}</Text></>}

                      />
                    </List.Item>
                  )} >
                </List>
                :
                <>
                  <br></br>
                  <Space>
                    <Text strong style={{ color: 'black' }}>Cast </Text>
                    <Space size={[0, 6]} wrap><Text style={{ color: 'black' }}>No Data</Text></Space>
                  </Space>
                </>
              }
            </Col>
            <Col span={24} md={24} lg={12} xl={12}>
              <div className="videoMapContainer">
                <LocationsMap video={video} />
              </div>
            </Col>
          </Row>
        </div>
        <br></br>

      </>
      : <AppLoading />
    }
  </>);
};




export default VideoPage;
