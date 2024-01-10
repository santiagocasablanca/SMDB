import { CommentOutlined, YoutubeOutlined, EyeOutlined, LikeOutlined, LineChartOutlined } from '@ant-design/icons';
import { Avatar, Col, Divider, Image, List, Popover, Row, Space, Spin, Typography, Tag } from 'antd';
import insertCss from 'insert-css';
import React, { useMemo, useState, useEffect } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
// import VideoDrawer from './VideoDrawer';
import VideoRate from './VideoRate';
import LatestVideosGrowthLine from '../graphs/LatestVideosGrowthLine';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideoDurationOverlay from './VideoDurationOverlay';

const { Title, Text } = Typography;

const VideoPreviewForHighlight = ({ _video, index }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

    const isLoaded = useMemo(() => _video !== undefined, [_video]);
    const channel = useMemo(() => _video?.channel, [_video]);
    // const channelStats = useMemo(async () => await getChannelStatsFn(_video?.channel?.channel_id), [channel]);
    const logo = useMemo(() => _video?.channel.logo_url, [_video]);
    const directedBy = useMemo(() => _video?.directedBy, [_video]);
    const formattedDate = useMemo(() => parseDate(_video?.published_at, "DD MMM YYYY"), [_video]);

    const [open, setOpen] = useState(false);




    const showDrawer = () => {
        setOpen(true);
    };

    const childToParent = (childdata) => {
        setOpen(childdata);
    }

    const goToChannel = () => {
        const url = '/channel/' + _video.channel_id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: _video.channel_id } });
    }


    // padding: 2px;
    insertCss(`
    .responive_label {
        font-size: 12px;
    }

    .videoPreviewForHighlight:hover {
        
        border-radius: 8px;
      }
       
        .videoPreviewForHighlight h5, p {
            color: black;
        }
        .videoPreviewForHighlight span {
            color: black;
        }

        .highlightedThumbnail {
            border-radius: 8px; 
            height: 390px;
          }

        @media (max-width: 990px) {
            .highlightedThumbnail {
              height: 320px;
            }
          }
          @media (max-width: 600px) {
            .highlightedThumbnail {
              height: 200px;
            }

            .responive_label {
                font-size: 11px;
            }
          }
    `);

    const castContent = ({ creators }) => {
        return (
            <List

                header={<Text strong>Cast</Text>}
                size="small"
                itemLayout="vertical"
                dataSource={creators}
                renderItem={(creator, index) => (
                    <List.Item key={creator.id}>
                        <List.Item.Meta
                            avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                            title={creator.name}
                            description={creator.video_creator.role}
                        />
                    </List.Item>
                )} >
            </List>
        )
    };

    const handleClickVideo = (id) => {
        // console.log(id);
        const url = '/video/' + id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: id } });
    }

    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                {/* <Popover content={video.title} placement="top" onClick={showDrawer}> */}
                <div className="videoPreviewForHighlight"
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'inherit';
                    }}>
                    <Row>
                        <Col span={24}>
                            <div style={{ position: 'relative' }} className="highlightedThumbnail">
                                
                                <Image style={{ borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }} src={_video.url} width='100%' height="100%" preview={false}
                                    onClick={() => handleClickVideo(_video.video_id)} />

                                    <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                                        <VideoDurationOverlay duration={_video.duration} />
                                    </div>
                              
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingLeft: '10px', paddingRight: '10px', marginTop: '15px' }}>
                        <Col span={20}>
                            <Title level={5} ellipsis={true}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.cursor = 'pointer';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.cursor = 'inherit';
                                }}
                                onClick={() => handleClickVideo(_video.video_id)}>{_video.title}</Title>
                        </Col>
                        <Col span={4}>
                            <Text className="responive_label" style={{ float: 'right', textAlign: 'end' }} onClick={() => handleClickVideo(_video.video_id)}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.cursor = 'pointer';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.cursor = 'inherit';
                                }}>{formattedDate}</Text>
                        </Col>
                    </Row>
                    <Row style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Col span={19}>
                            <Space onClick={goToChannel}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.cursor = 'pointer';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.cursor = 'inherit';
                                }}>
                                <Avatar src={logo} style={{
                                    backgroundColor: '#f56a00',
                                }} />
                                {/* <Image src={video.channel?.logo_url}></Image> */}
                                {/* */}
                                <Text strong>{_video.channel_title}</Text>
                                <Text className="responive_label">{intToStringBigNumber(channel?.subs)} subs</Text>
                            </Space>
                        </Col>
                        <Col span={5}>
                            <div style={{ float: 'right' }}>
                                <VideoRate _video={_video} color="black" />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Col span={24}>
                            <Space size="small" style={{ float: 'right' }}>
                                <EyeOutlined />{intToStringBigNumber(_video.views)}
                                <LikeOutlined />{intToStringBigNumber(_video.likes)}
                                <CommentOutlined />{intToStringBigNumber(_video.comments)}
                                <Popover title="Views Growth" content={<VideoGrowthLine _video={_video} />}>
                                    <LineChartOutlined />
                                </Popover>
                            </Space>
                        </Col>
                    </Row>

                    <Row style={{ paddingLeft: '10px', paddingRight: '10px' }}>
                        <Col span={24}>
                            <Space style={{ float: 'right' }}>
                                {
                                    (directedBy.length > 0) ? (<>
                                        <Text strong>Directed by</Text>
                                        <Avatar.Group maxCount={2} maxStyle={{ color: '#000000', backgroundColor: '#FFFFFF' }}>
                                            {directedBy?.map(director => {
                                                return (<Avatar key={"director" + director.id} size="small" src={director.profile_picture} />);
                                            })}
                                        </Avatar.Group>

                                    </>) : ('')
                                }
                                {
                                    _video?.cast.length > 0 ? (
                                        <>
                                            <Divider></Divider>
                                            <Text strong>Cast</Text>
                                            <Popover placement="bottom" title="Cast" content={castContent(_video.cast)} trigger="click">

                                                <Avatar.Group maxCount={5} maxStyle={{ color: '#000000', backgroundColor: variables.primary }}>
                                                    {_video.cast.map(cast_creator => {
                                                        return (<Avatar key={"cast_" + cast_creator.id} size="small" src={cast_creator.profile_picture} />);
                                                    })}
                                                </Avatar.Group>
                                            </Popover>
                                        </>) : ('')
                                }
                            </Space>
                        </Col>
                    </Row>

                </div>


                {/* </Popover> */}
                {/* <VideoDrawer _video={_video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer> */}
            </>
            ) : (
                <Spin />
                // <Skeleton />
            )
        }
        </>
    );
}

export default VideoPreviewForHighlight;