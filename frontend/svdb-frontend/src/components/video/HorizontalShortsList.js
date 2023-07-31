import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, CommentOutlined, ClockCircleOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined, ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ShortPreview from './ShortPreview';
import { useNavigate } from 'react-router-dom';



const { Title, Text } = Typography;



const HorizontalShortsList = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState();


    useEffect(() => {

        async function fetchData() {
            let _params = new URLSearchParams();
            _params.append("excludeShorts", false);
            _params.append("onlyShorts", true);
            for (const property in filter) {
                if (filter[property] && filter[property] != '' && filter[property].length >= 1)
                    _params.append(property, filter[property]);
            }

            await getVideosFn(1, 10, _params)
                .then((result) => {
                    setVideos(result.videos);
                })
        }
        fetchData();

        setIsLoaded(true);
    }, [filter]);

    const handleClick = () => {
        const url = '/shorts';
        navigate(url, { state: { filter } });
    }

    return (
        <> {isLoaded ?
            (
                <>
                    <Row><Col span={18}><Title style={{ color: 'black' }} level={5}>{title}</Title></Col> <Col span={6}><Button onClick={() => handleClick()} style={{ float: 'right' }} type="link">See all</Button></Col></Row>
                    <List
                        grid={{
                            gutter: 10,
                            column: 10,
                        }}
                        className="scrollmenu"
                        itemLayout="horizontal"
                        dataSource={videos}
                        renderItem={(item) => (
                            <List.Item>
                                <ShortPreview _video={item}></ShortPreview>
                            </List.Item>
                        )}
                    />
                </>

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default HorizontalShortsList;