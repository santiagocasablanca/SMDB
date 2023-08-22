import { Rose } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import { Treemap } from '@ant-design/plots';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { findGroupedByCastFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;




const CastRose = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);



    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", filter.channels);
            findGroupedByCastFn(params)
                .then((result) => {

                    // Transform the fetched data into the required format
                    const transformedData = result.results.map((item) => {
                        return {
                            name: item.creator_name, // Assuming the title property holds the name
                            value: item.videos ? parseInt(item.videos) : 0, // Assuming the likes property holds the value
                            // Additional properties can be added here if needed
                            likes: item.likes,
                            views: item.views,
                            comments: item.comments,
                            totalVideos: item.videos
                        };
                    });

                    const transformedLikedData = result.results.map((item) => {
                        return {
                            name: item.serie, // Assuming the title property holds the name
                            value: item.likes, // Assuming the likes property holds the value
                            // Additional properties can be added here if needed
                            likes: item.likes,
                            views: item.views,
                            comments: item.comments,
                            totalVideos: item.videos
                        };
                    });
                    setData(transformedData);
                    // setLikedSeriesData(transformedLikedData);
                    setIsLoaded(true);

                    console.log("finished fetching");
                });
        }
        fetchData();

    }, [refreshKey, filter]);

    insertCss(`

    .container{
        padding: 16px 0px;
        width: 160px;
        display: flex;
        flex-direction: column;
      }
      .tooltip-item{
        margin-top: 12px;
        display: flex;
        width: 100%;
        justify-content: space-between;
      }
    
    `);

    const config = {
        data,
        height: 450,
        xField: 'name',
        yField: 'value',
        seriesField: 'name',
        colorField: 'name',
        radius: 0.9,
        tooltip: {
            follow: true,
            enterable: true,
            offset: 5,
            customContent: (value, items) => {
                if (!items || items.length <= 0) return;
                const { data: itemData } = items[0];
                return (
                    `<div class='container'>` +
                    `<div class='title'>${itemData.name}</div>` +
                    // `<div class='tooltip-item'><span>${itemData.published_at}</span></div>` +
                    `<div class='tooltip-item'><span>Views: </span><span>${intToStringBigNumber(itemData.views)}</span></div>` +
                    `<div class='tooltip-item'><span>Likes: </span><span>${intToStringBigNumber(itemData.likes)}</span></div>` +
                    `<div class='tooltip-item'><span>Comments: </span><span>${intToStringBigNumber(itemData.comments)}</span></div>` +
                    `<div class='tooltip-item'><span>Number of videos: </span><span>${itemData.totalVideos}</span></div>`
                );
            },
        },
        legend: {
            position: 'bottom',
        },
        label: {
            offset: 10,
        },
        interactions: [
            {
                type: 'element-active',
            },
        ],
    };


    return (
        <>
            <Row>
                <Col span={24}>
                    <Title style={{ color: "black" }} level={5}>{title}</Title>
                </Col>
            </Row>
            <Card bordered={false} size="small">
                {isLoaded ? (
                    data.length > 0 ? (
                        <Rose {...config} />
                    ) : (
                            <Empty description="No data available" />
                            // <Text>No data available.</Text>
                        )
                ) : (
                        <Spin />
                    )}
            </Card>
        </>
    );
}

export default CastRose;

