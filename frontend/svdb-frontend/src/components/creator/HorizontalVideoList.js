import { Button, Col, List, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import VideoPreview from '../video/VideoPreview';





const { Title, Text } = Typography;



const HorizontalVideoList = ({ title, filter }) => {
    const navigate = useNavigate();
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState();


    useEffect(() => {

        async function fetchData() {
            let _params = new URLSearchParams();
            // console.log(filter)
            for (const property in filter) {
                if (filter[property] && filter[property] != '' && filter[property].length >= 1)
                    _params.append(property, filter[property]);
            }
            // console.log(_params);

            await getVideosFn(1, 10, _params)
                .then((result) => {
                    setVideos(result.videos);
                })
        }
        fetchData();

        setIsLoaded(true);
    }, [filter]);

    const handleClick = () => {
        const url = '/videography';
        console.log(filter);
        navigate(url,{ state: { filter } });
    }

    return (
        <> {isLoaded ?
            (
                <>
                    <Row><Col span={18}><Title style={{ color: 'black' }} level={5}>{title}</Title></Col> <Col span={6}><Button onClick={() => handleClick()} style={{ float: 'right' }} type="link">See all</Button></Col></Row>
                    <List
                        grid={{
                            gutter: 6,
                            column: videos?.lenght,
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
                </>

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default HorizontalVideoList;