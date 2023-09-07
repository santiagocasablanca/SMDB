import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, List, Row, Space, Typography, Divider, Avatar, Popover, Tag, Spin } from 'antd';
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

.videoContainer {
    height: 550px;
}

.showPointer:hover {
    cursor: pointer;
}

@media (max-width: 1480px) {
    .videoBodyContainer {
        padding: 0 20px 0 20px;
    }
    .videoContainer {
        height: 450px;
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
}

  `)

  const goToCreator = (id) => {
    console.log('heere: ', id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

{/* <YoutubeOutlined />  */}
  return (<>
    {isFetched && video ?
      <div className="videoBodyContainer">
        <Row className="headerPanel">
          <Col span={24} md={24} lg={18} xl={20}>
            <Title level={3}><Space><UpdateVideoModal video={video} _icon={<YoutubeOutlined />} _color="black" big={true} />{video?.title}</Space></Title>

          </Col>
          <Col span={24} md={24} lg={6} xl={4}>
            <span style={{ float: 'right', backgroundColor: 'black', opacity: '0.9', borderRadius: '8px', padding: '5px' }}>
              <span style={{ color: 'white', fontSize: '13px' }}>{parseDate(video?.published_at, "DD MMM YYYY")}</span>
              <Divider type="vertical"></Divider>
              <Popover title={video.title} content={<VideoGrowthLine _video={video} />}>
                <span style={{ fontSize: '16px', color: 'white' }}><LineChartOutlined /></span>
              </Popover>
              <Divider type="vertical"></Divider>
              <VideoRate _video={video}></VideoRate>
            </span>
            {/* <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} /> */}
          </Col>
        </Row>

        <Row gutter={[8, 12]}>
          <Col span={24} md={24} lg={14} xl={16}>
            <Row gutter={[8, 12]}>
              <Col span={24}>
                <div className="videoContainer">
                  <ReactPlayer url={video.player.embedHtml} width='100%' height="100%"></ReactPlayer>
                </div>
              </Col>
              <Col span={24}>
                <Space size="small" style={{ float: 'right' }}>
                  <EyeOutlined />{intToStringBigNumber(video.views)}
                  <LikeOutlined />{intToStringBigNumber(video.likes)}
                  <CommentOutlined />{intToStringBigNumber(video.comments)}
                </Space>
              </Col>
            </Row>
          </Col>

          <Col span={24} md={24} lg={10} xl={8}>
            <Card>
              <Row style={{
                height: "550px",
                overflow: "auto"
              }}>
                <Col span={24}>
                  <Space style={{ float: 'right' }} >
                    {/* <MapLocations /> */}
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

                </Col>
                {video?.locations ?
                  <Col span={24}>
                    <Locations video={video} />
                  </Col> : null
                }
                <Col span={24}>
                  <List
                    header={<Text strong style={{ marginLeft: '20px' }}>Directed by</Text>}
                    size="small"
                    itemLayout="vertical"
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
                <Col span={24}>
                  <List
                    header={<Text strong style={{ marginLeft: '20px' }}>Cast</Text>}
                    size="small"
                    itemLayout="vertical"
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
              </Row>
            </Card>
          </Col>
        </Row>


      </div>

      : <Spin />
    }
  </>);
};




export default VideoPage;
