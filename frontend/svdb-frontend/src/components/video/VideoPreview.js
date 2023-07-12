import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Divider, Popover, Avatar, Table, Typography, Space, Spin } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import VideoDrawer from './VideoDrawer'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoPreview = ({ _video }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [video, setVideo] = useState(_video);
    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        console.log('show')
        setOpen(true);
    };

    const childToParent = (childdata) => {
        console.log('video preview childtoparent ', childdata);

        setOpen(childdata);
      }


    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <> {isLoaded ?
            (<>
                <Card
                    style={{ width: '220px', fontSize: '12px' }}
                    onClick={showDrawer}
                    bodyStyle={{ padding: 0 }}>
                    <Popover content={video.title} placement="top" onClick={showDrawer}>

                        <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='218px' height='168px' preview={false} />
                        <p style={{ color: 'white', fontSize: '10px', margin: '0px 5px' }}>{video.title}</p>
                        <div>
                            <Space split={<Divider type="vertical" />} size="small" style={{ marginLeft: '5px' }}>
                                <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(video.views)}</p>
                                <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(video.likes)}</p>
                                <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(video.comments)}</p>

                            </Space>
                        </div>

                        <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{parseDate(video.published_at, "DD MMM YYYY")}</p>
                    </Popover>
                </Card>
                <VideoDrawer _video={video} _open={open} childToParent={childToParent}></VideoDrawer>
            </>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default VideoPreview;