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
                            <Card
                                style={{ width: '220px', fontSize: '12px' }}
                                bodyStyle={{ padding: 0 }}>
                                <Popover content={item.title} placement="top">
                                    <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={item.url} width='218px' height='168px' preview={false} />
                                    <p style={{ color: 'white', fontSize: '10px', margin: '0px 5px' }}>{item.title}</p>
                                    <div>
                                        <Space split={<Divider type="vertical" />} size="small" style={{marginLeft:'5px'}}>
                                            <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(item.views)}</p>
                                            <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(item.likes)}</p>
                                            <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(item.comments)}</p>

                                        </Space>
                                    </div>

                                    <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{parseDate(item.published_at, "DD MMM YYYY")}</p>
                                </Popover>
                                {/* TODO onclick? */}
                                {/* <ReactPlayer url={item.player.embedHtml} width='100%' height='150px'></ReactPlayer> */}
                            </Card>
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