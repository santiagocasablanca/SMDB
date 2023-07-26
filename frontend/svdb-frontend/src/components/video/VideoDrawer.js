import React, { useState, useEffect } from 'react';

import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin, Drawer, Button } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, UserOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoDrawer = ({ _video, _channel, _open, childToParent }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [video, setVideo] = useState(_video);
    const [channel, setChannel] = useState(_channel);
    const [open, setOpen] = useState(_open);

    useEffect(() => {
        // console.log(_channel);
        setVideo(_video);
        setChannel(_channel);
        setOpen(_open);
        // console.log('video drawer')
    }, [_video, _open]);


    const onClose = () => {
        // console.log('video drawer on close')

        childToParent(false);
        setOpen(false);
    };

    const title = (
        <>
            {video.title}
        </>
    );

    insertCss(`
       
        .videoDrawerContainer {
            padding: 0 80px 0 80px;
        }
        @media (max-width: 800px) {
            .videoDrawerContainer {
                padding: 0 20px 0 20px;
            }
        }
    `);


    return (
        <> {
            open ? (
                <Drawer title={title}
                    placement="bottom"
                    width={500}
                    height="80%"
                    onClose={onClose}
                    open={open}
                    extra={
                        <Space>
                            <Text>{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                            {/* <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>OK</Button> */}
                        </Space>
                    }>
                    <div className="videoDrawerContainer">

                        <Row>
                            <Col span={24}>
                                <ReactPlayer url={video.player.embedHtml} width='100%' height='460px'></ReactPlayer>
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
                                <Space>
                                    <Avatar src={channel?.logo_url} style={{
                                        backgroundColor: '#f56a00',
                                    }} />
                                    <Text>{video.channel_title}</Text>
                                </Space>
                            </Col>
                            <Col span={4}>
                                <Space size="small" style={{ float: 'right' }}>
                                    <EyeOutlined />{intToStringBigNumber(video.views)}
                                </Space>
                            </Col>
                        </Row>
                    </div>
                </Drawer>
            ) : ('')
        }
        </>
    );
}

export default VideoDrawer;