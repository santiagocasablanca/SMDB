import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, List, Row, Space, Typography, Divider, Avatar, Empty, Popover, Tag, Spin } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import ReactPlayer from 'react-player';
import Locations from '../components/video/Locations';
import UpdateVideoModal from '../components/video/UpdateVideoModal';
import { getVideoFn } from "../services/videoApi.ts";



const { Title, Text } = Typography;
const { Search } = Input;

const VideoPage = () => {
  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
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
  .videoBodyContainer {
    padding: 10px 80px 0px 80px;
  }

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
   
  }

  .headerPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }

  .divider {
    margin: 0px 10px;
  }

.videoContainer {
    height: 600px;
    border-radius: 8px;
    overflow: hidden;
}

.panelContainer {
  height: 600px;
  overflow: auto;
}

.infoStatsComponent {
  float: right; 
  background-color: black;
  opacity: 0.9;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 8px;
  margin-top: 12px;
}

.infoStatsComponent span {
  color: white; 
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
        padding: 0 20px 0 20px;
    }
    .videoContainer {
        height: 600px;
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
        height: 400px;
    }
}

@media (max-width: 600px) {
    .videoContainer {
        height: 240px;
    }

    .panelContainer {
        height: 350px;
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

  const goToCreator = (id) => {
    console.log('heere: ', id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  {/* <YoutubeOutlined />  */ }
  return (<>
    {isFetched && video ?
      <div className="videoBodyContainer">
        <Row gutter={[16, 12]}>
          <Col span={24} md={24} lg={24} xl={16}>
            <Row gutter={[8, 12]}>
              <Col span={24}>
                <Title level={3} className="headerPanel" style={{ color: 'black' }}>
                  <Space>
                    <UpdateVideoModal video={video} _icon={<YoutubeOutlined />} _color="black" big={true} /> {video?.title}
                  </Space>
                </Title>
              </Col>
              <Col span={24}>
                <div className="videoContainer">
                  <ReactPlayer url={video.player.embedHtml} width='100%' height="100%"></ReactPlayer>
                </div>
              </Col>
            </Row>
          </Col>

          <Col span={24} md={24} lg={24} xl={8}>
            <Row gutter={[8, 12]}>
              <Col span={24}>
                <div className="infoStatsComponent">
                  <span>{parseDate(video?.published_at, "DD MMM YYYY")}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <span><EyeOutlined /> {intToStringBigNumber(video.views)}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <span><LikeOutlined /> {intToStringBigNumber(video.likes)}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <span><CommentOutlined /> {intToStringBigNumber(video.comments)}</span>
                  <Divider type="vertical" className="divider"></Divider>
                  <Popover title={video.title} content={<VideoGrowthLine _video={video} />} placement="bottomRight">
                    <span style={{ fontSize: '16px', color: 'white' }}><LineChartOutlined style={{ fontSize: '16px' }} /></span>
                  </Popover>
                  <Divider type="vertical"></Divider>
                  <VideoRate _video={video}></VideoRate>
                </div>
              </Col>
              <Col span={24}>
                <Card bodyStyle={{ padding: '10px', paddingTop: '25px' }} className="panelContainer">
                <Row gutter={[8, 10]}>
                  {video?.serie ?
                    <Col span={24}>
                      <Space>
                        <Text strong style={{ marginLeft: '20px' }}>Series </Text>
                        <Space size={[0, 6]} wrap>
                          {video.serie && [video.serie]?.map((tag, index) => {
                            return (
                              <Tag
                                key={tag + 'series'}
                                color={variables.sdmnPink}
                                closable={false}
                                style={{
                                  userSelect: 'none',
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

                    </Col> : null
                  }
                  {video?.game ?
                    <Col span={24}>
                      <Space>
                        <Text strong style={{ marginLeft: '20px' }}>Game </Text>
                        <Space size={[0, 6]} wrap>
                          {video.game && [video.game]?.map((tag, index) => {
                            return (
                              <Tag
                                key={tag + 'game'}
                                color={variables.sdmnLightBlue}
                                closable={false}
                                style={{
                                  userSelect: 'none',
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

                    </Col> : null
                  }
                  {/* <br></br> */}
                  {video?.locations ?
                    <Col span={24}>
                      <Locations video={video} />
                    </Col> : null
                  }
                  </Row>
                  <Row gutter={[8, 10]}>
                    <Col span={24}>
                      <List
                        header={<Text strong style={{ marginLeft: '20px' }}>Directed by</Text>}
                        size="small"
                        empty={<p style={{color:'yellow'}}>No Data</p>}
                        locale={{ emptyText: 'No data', emptyImage: Empty.PRESENTED_IMAGE_SIMPLE }}

                        itemLayout="horizontal"
                        dataSource={video?.directedBy}
                        //   style={{ width: '100%' }}
                        renderItem={(creator, index) => (
                          <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer">
                            <List.Item.Meta
                              avatar={<Avatar key={"drawerDirector" + index} src={creator.profile_picture} />}
                              title={creator.name}

                            />
                          </List.Item>
                        )} >
                      </List>
                    </Col>
                    </Row>
                    <Row 
                    gutter={[8, 10]}>
                    <Col span={24}>
                      <List
                        header={<Text strong style={{ marginLeft: '20px' }}>Cast</Text>}
                        size="small"
                        locale={{ emptyText: <Empty text="No data" image={Empty.PRESENTED_IMAGE_SIMPLE} imageStyle={{padding: '2px', height: '32px'}}></Empty> }}
                        itemLayout="horizontal"
                        dataSource={video?.cast}
                        renderItem={(creator, index) => (
                          <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer">
                            <List.Item.Meta
                              avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                              title={<><Text>{creator.name}</Text> <Text italic type="secondary"> as {creator.video_creator.role}</Text></>}

                            />
                          </List.Item>
                        )} >
                      </List>
                    </Col>
                    {video?.tags ?
                      <Col span={24}>
                        <Space>
                          <Text strong style={{ marginLeft: '20px' }}>Tags </Text>
                          <Space size={[0, 6]} wrap>
                            {video.tags && video.tags?.map((tag, index) => {
                              return (
                                <Tag
                                  key={tag + 'tags'}
                                  closable={false}
                                  style={{
                                    userSelect: 'none',
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

                      </Col> : null
                    }
                  </Row>
                </Card>
              </Col>

            </Row>
          </Col>
        </Row>
        <br></br>
      </div>
      : <Spin />
    }
  </>);
};




export default VideoPage;
