import { Button, Col, List, Row, Spin, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ShortPreview from './ShortPreview';




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
                    {/* <Row><Col span={18}><Title style={{ color: 'black', marginBottom: '25px'  }} level={4}>{title}</Title></Col> <Col span={6}><Button onClick={() => handleClick()} style={{ float: 'right' }} type="link">See all</Button></Col></Row> */}
                    <Row>
                        <Col span={18}><Title style={{ color: 'black', marginBottom: '25px' }} level={4}>{title}</Title></Col>
                        <Col span={6}>
                            <div style={{ float: 'right' }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 80%)';
                                    e.currentTarget.style.borderRadius = '8px';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'inherit';
                                    e.currentTarget.style.borderRadius = 'inherit';
                                }}>
                                <Button onClick={() => handleClick()} type="link">See all</Button></div>
                        </Col>
                    </Row>
                    <List
                        grid={{
                            gutter: 10,
                            column: videos?.lenght,
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