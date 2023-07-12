import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Typography, Space, Spin } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import CreatorStatsPanel from './CreatorStatsPanel'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'
import { FormItemPrefixContext } from 'antd/es/form/context';
import VideoPreview from '../video/VideoPreview';



const { Title, Text } = Typography;



const HorizontalVideoList = ({ _videos }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState(_videos);




    useEffect(() => {
        setIsLoaded(true);
    }, []);
    // title={item.title}
    return (
        <> {isLoaded ?
            (
                <List
                    grid={{
                        gutter: 4,
                        column: 10,
                    }}
                    className="scrollmenu"
                    itemLayout="horizontal"
                    dataSource={videos}
                    renderItem={(item) => (
                        <List.Item>
                            <VideoPreview _video={item}></VideoPreview>

                        </List.Item>
                    )}
                />

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default HorizontalVideoList;