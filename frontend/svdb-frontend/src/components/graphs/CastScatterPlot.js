import { Rose } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import { Scatter } from '@ant-design/plots';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { findGroupedByCastFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

const { Title, Text } = Typography;

const CastScatterPlot = ({ title, filter }) => {
    const [data, setData] = useState([]);
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
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
                            views: parseInt(item.views),
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
    // style={{ color: "white", paddingBottom: "2px" }}
    const config = {
        appendPadding: 10,
        data,
        height: 450,
        xField: 'views',
        yField: 'value',
        legend: {
            position: 'right',
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
        tooltip: {
            follow: true,
            enterable: true,
            offset: 1,
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
        colorField: 'name',
        sizeField: 'views',
        // size: 2,
        size: [4, 30],
        shape: 'circle',
        pointStyle: {
            fillOpacity: 0.8,
            stroke: '#bbb',
        },
        yAxis: {
            nice: true,
            min: 0,
            max: Math.max(...data?.map(obj => obj.value)) + 2,
            line: {
                style: {
                    stroke: '#aaa',
                },
            },
        },
        xAxis: {
            min: 0,
            grid: {
                line: {
                    style: {
                        stroke: '#eee',
                    },
                },
            },
            line: {
                style: {
                    stroke: '#aaa',
                },
            },
        },
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
                        <Scatter {...config} />
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

};

export default CastScatterPlot;