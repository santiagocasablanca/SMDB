import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Divider, Popover, Avatar, Table, Typography, Space, Spin } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, UserOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Skeleton } from 'antd';
import insertCss from 'insert-css';
import VideoDrawer from './VideoDrawer'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideoFn } from "../../services/videoApi.ts";
import { getChannelFn } from "../../services/channelApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoPreviewForHighlight = ({ _video, index }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [video, setVideo] = useState(_video);
    const [channel, setChannel] = useState();
    const [logo, setLogo] = useState();
    const [open, setOpen] = useState(false);

    useEffect(() => {
        
        async function fetchData() {
            await getVideoFn(_video.video_id).then(res => {
                if (res.result) {
                    setVideo(res.result);
                    setLogo(res.result.channel.logo_url);
                    setChannel(res.result.channel);
                    setIsLoaded(true);
                }
            })
        }
        fetchData();
    }, [_video]);

    const showDrawer = () => {
        setOpen(true);
    };

    const childToParent = (childdata) => {
        setOpen(childdata);
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
                    <Row style={{marginTop: '20px'}}>
                        <Col span={18}>
                            <Title level={5} ellipsis={true}>{video.title}</Title>
                        </Col>
                        <Col span={6}>
                            <Text style={{float: 'right'}}>{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Space>
                                <Avatar src={logo} style={{
                                    backgroundColor: '#f56a00',
                                }} />
                                {/* <Image src={video.channel?.logo_url}></Image> */}
                                <Text>{video.channel_title}</Text>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space size="small" style={{float: 'right'}}>
                                <EyeOutlined />{intToStringBigNumber(video.views)}
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