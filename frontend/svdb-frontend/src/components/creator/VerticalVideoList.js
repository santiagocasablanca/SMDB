import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin } from 'antd';
import insertCss from 'insert-css';
import CreatorStatsPanel from './CreatorStatsPanel'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VerticalVideoList = ({ _videos }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState(_videos);




    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <> {isLoaded ?
            (
                <List
                    grid={{
                        gutter: 4,
                        column: 1,
                    }}
                    itemLayout="vertical"
                    dataSource={videos}
                    renderItem={(item) => (
                        <List.Item>
                            <Card bodyStyle={{ padding: 0, maxWidth: '200px' }}>
                                <ReactPlayer url={item.player.embedHtml} width='100%'></ReactPlayer>
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

export default VerticalVideoList;