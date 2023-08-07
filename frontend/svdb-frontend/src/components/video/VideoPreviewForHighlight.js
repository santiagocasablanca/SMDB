import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Divider, Popover, Avatar, Table, Typography, Space, Spin, Tooltip } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, UserOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from 'antd';
import insertCss from 'insert-css';
import VideoDrawer from './VideoDrawer'
import { useNavigate } from 'react-router-dom';


import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideoFn } from "../../services/videoApi.ts";
import { getChannelFn } from "../../services/channelApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoPreviewForHighlight = ({ _video, index }) => {
    const navigate = useNavigate();


    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [video, setVideo] = useState(_video);
    const [channel, setChannel] = useState();
    const [directedBy, setDirectedBy] = useState();
    const [logo, setLogo] = useState();
    const [open, setOpen] = useState(false);


    useEffect(() => {

        async function fetchData() {
            setVideo(_video);
                    setLogo(_video?.channel.logo_url);
                    setDirectedBy(_video?.directedBy);
                    setChannel(_video?.channel);
                    setIsLoaded(true);
            // await getVideoFn(_video.video_id).then(res => {
            //     if (res.result) {
            //         setVideo(res.result);
            //         setLogo(res.result.channel.logo_url);
            //         setDirectedBy(res.result.directedBy);
            //         setChannel(res.result.channel);
            //         setIsLoaded(true);
            //     }
            // })
        }
        fetchData();
    }, [_video]);

    const showDrawer = () => {
        console.log('show drawer')
        setOpen(true);
    };

    const childToParent = (childdata) => {
        setOpen(childdata);
    }

    const goToChannel = () => {
        console.log('go to channel')
        const url = '/channel/' + _video.channel_id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: _video.channel_id } });
    }
    

    insertCss(`

    .videoPreviewForHighlight:hover {
        cursor: pointer;
      }
       
        .videoPreviewForHighlight h5, p {
            color: black;
        }
        .videoPreviewForHighlight span {
            color: black;
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


    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                {/* <Popover content={video.title} placement="top" onClick={showDrawer}> */}
                <div className="videoPreviewForHighlight">

                    <Row>
                        <Col span={24}>
                            <div style={{ borderRadius: '8px', height: '270px' }}>
                                <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='100%' height="100%" preview={false} onClick={() => showDrawer()} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={18}>
                            <Title level={5} ellipsis={true}>{video.title}</Title>
                        </Col>
                        <Col span={6}>
                            <Text style={{ float: 'right' }}>{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Space onClick={goToChannel}>
                                <Avatar src={logo} style={{
                                    backgroundColor: '#f56a00',
                                }} />
                                {/* <Image src={video.channel?.logo_url}></Image> */}
                                <Text>{video.channel_title}</Text>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space size="small" style={{ float: 'right' }}>
                                <EyeOutlined />{intToStringBigNumber(video.views)}
                                <LikeOutlined />{intToStringBigNumber(video.likes)}
                                <CommentOutlined />{intToStringBigNumber(video.comments)}
                            </Space>
                        </Col>
                    </Row>
                    <Row>
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
                                    video?.cast.length > 0 ? (
                                        <>
                                            <Divider></Divider>
                                            <Text strong>Cast</Text>
                                            <Popover placement="bottom" title="Cast" content={castContent(video.cast)} trigger="click">

                                                <Avatar.Group maxCount={5} maxStyle={{ color: '#000000', backgroundColor: variables.primary }}>
                                                    {video.cast.map(cast_creator => {
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
                <VideoDrawer _video={video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer>
            </>
            ) : (
                <Spin />
                // <Skeleton />
            )
        }
        </>
    );
}
{/* <div>
    <Space split={<Divider type="vertical" />} size="small" style={{ marginLeft: '5px' }}>
        <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(video.views)}</p>
        <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(video.likes)}</p>
        <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(video.comments)}</p>

    </Space>
</div> */}

export default VideoPreviewForHighlight;