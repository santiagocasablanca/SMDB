import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin } from 'antd';
import insertCss from 'insert-css';
import CreatorStatsPanel from './CreatorStatsPanel'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const CreatorChannel = ({ creator, channel }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [channels, setChannels] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAllChannels, setIsAllChannels] = useState(true);
    const [top10videos, setTop10videos] = useState([]);




    useEffect(() => {
        if (channel !== null) {
            setIsAllChannels(false);
        }
        fetchChannels();
    }, []);
    
    const fetchChannels = async () => {
        let creatorChannels = [];
        if(isAllChannels) {
            creatorChannels = await creator.channels?.map((channel) => {
                return channel.channel_id;
            });
        } else {
            creatorChannels.push(channel.channel_id);
        }
        
        let paramsTop10 = new URLSearchParams();
        paramsTop10.append("sort", "views%desc")
        paramsTop10.append("channels", creatorChannels);
        console.log('videos paramsTop10', creatorChannels);
        
        await getVideosFn(1, 10, paramsTop10)
        .then((result) => {
            setIsLoaded(true);
                console.log('videos creator', result);
                setTop10videos(result.videos);
            })
    }

    return (
        <> {isLoaded ?
            (
                <Row gutter={16}>
                    <Col span={12}>
                        <CreatorStatsPanel creator={creator} channel={channel} isAllChannels={isAllChannels}></CreatorStatsPanel>
                    </Col>
                    <Col span={12}>
                        <Row gutter={16}>
                            <Col span={24}>
                                <List
                                    grid={{
                                        gutter: 4,
                                        column: 10,
                                    }}
                                    className="scrollmenu"
                                    itemLayout="horizontal"
                                    style={{
                                        padding: 10,
                                        marginTop: 20,
                                        marginBottom: 20
                                    }}
                                    dataSource={top10videos}
                                    renderItem={(item) => (
                                        <List.Item>
                                            <Card title={item.title}
                                                style={{ width: '200px', height: '150px' }}
                                                bodyStyle={{ padding: 0, width: '200px' }}>
                                                <ReactPlayer url={item.player.embedHtml} width='100%'></ReactPlayer>
                                            </Card>
                                        </List.Item>
                                    )}
                                />
                            </Col>
                        </Row>
                    </Col>
                </Row>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default CreatorChannel;