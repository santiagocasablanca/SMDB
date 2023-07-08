import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin } from 'antd';
import insertCss from 'insert-css';
import CreatorStatsPanel from './CreatorStatsPanel'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const HorizontalVideoList = ({ _videos }) => {

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
                        column: 10,
                    }}
                    className="scrollmenu"
                    itemLayout="horizontal"
                    dataSource={videos}
                    renderItem={(item) => (
                        <List.Item>
                            <Card title={item.title}
                                style={{ width: '200px', fontSize: '12px' }}
                                bodyStyle={{ padding: 0 }}>
                                <Image src={item.url} width='100%' height='150px' preview={false} />
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