import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Divider, Popover, Avatar, Table, Typography, Space, Spin } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

import insertCss from 'insert-css';
import VideoDrawer from './VideoDrawer'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideoFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoPreview = ({ _video }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [video, setVideo] = useState(_video);
    const [channel, setChannel] = useState();
    const [logo, setLogo] = useState();
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


    useEffect(() => {
        async function fetchData() {
            setVideo(_video);
            setLogo(_video?.channel.logo_url);
            setChannel(_video?.channel);
            setIsLoaded(true);
            // await getVideoFn(_video.video_id).then(res => {
            //     if (res.result) {
            //         setVideo(res.result);
            //         setLogo(res.result.channel.logo_url);
            //         setChannel(res.result.channel);
            //         setIsLoaded(true);
            //     }
            // })
        }
        fetchData();
    }, [_video]);
    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                <Card
                    style={{ width: '220px', fontSize: '12px' }}
                    onClick={showDrawer}
                    bodyStyle={{ padding: 0, cursor: 'pointer' }}>
                    {/* <Popover content={video.title} placement="top" onClick={showDrawer}> */}

                    <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='218px' height='168px' preview={false} />
                    <p style={{ color: 'white', fontSize: '10px', margin: '0px 5px' }}>{video.title}</p>
                    <div>
                        <Space split={<Divider type="vertical" />} size="small" style={{ marginLeft: '5px' }}>
                            <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(video.views)}</p>
                            <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(video.likes)}</p>
                            <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(video.comments)}</p>

                        </Space>
                    </div>
                    <Avatar src={logo} onClick={goToChannel} style={{
                        backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px'
                    }} />
                    <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{parseDate(video.published_at, "DD MMM YYYY")}</p>
                    {/* </Popover> */}
                </Card>
                <VideoDrawer _video={video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer>
            </>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default VideoPreview;