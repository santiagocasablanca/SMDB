import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import { Treemap } from '@ant-design/plots';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getTreeMapPlotForTagsFn, findGroupedByTagsFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;



const TreeMapPlot = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [likedSeriesData, setLikedSeriesData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);

    insertCss(`
        .ant-card .ant-card-head .ant-tabs-top {
            color: black;
        }
    `);


    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", filter.channels);
            params.append("sort", filter.sort)
            findGroupedByTagsFn(params)
                .then((result) => {

                    // Transform the fetched data into the required format
                    const transformedData = result.results.map((item) => {
                        return {
                            name: item.tag, // Assuming the title property holds the name
                            value: item.views, // Assuming the likes property holds the value
                            // Additional properties can be added here if needed
                            likes: item.likes,
                            views: item.views,
                            comments: item.comments,
                            totalVideos: item.videos
                        };
                    });

                    const transformedLikedData = result.results.map((item) => {
                        return {
                            name: item.tag, // Assuming the title property holds the name
                            value: item.likes, // Assuming the likes property holds the value
                            // Additional properties can be added here if needed
                            likes: item.likes,
                            views: item.views,
                            comments: item.comments,
                            totalVideos: item.videos
                        };
                    });
                    setData(transformedData);
                    setLikedSeriesData(transformedLikedData);
                    setIsLoaded(true);
                });
        }
        fetchData();

    }, [refreshKey, filter]);

    const handleClick = () => {
        const url = '/videography';
        navigate(url, { state: { filter } });
    }
    // insertCss(`

    // `);
    const mostViewedSeries = {
        name: 'Most Viewed Series',
        children: data
    };
    const config = {
        data: mostViewedSeries,
        colorField: 'name',
        legend: {
            position: 'bottom',
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
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
    };
    const mostLikedSeries = {
        name: 'Most Liked Series',
        children: likedSeriesData
    };
    const configLikedSeries = {
        data: mostLikedSeries,
        colorField: 'name',
        legend: {
            position: 'bottom',
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
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
    };

    const tabListNoTitle = [
        {
            key: 'views',
            tab: 'Views',
        },
        {
            key: 'likes',
            tab: 'Likes',
        }
    ];
    const contentListNoTitle = {
        views: <Treemap key={refreshKey} {...config} />,
        likes: <Treemap key={refreshKey} {...configLikedSeries} />
    };
    const [activeTabKey2, setActiveTabKey2] = useState('views');
    const onTab2Change = (key) => {
        setActiveTabKey2(key);
    };

    return (
        <>
            <Row>
                <Col span={24}>
                    <Title style={{ color: "black" }} level={4}>{title}</Title>
                </Col>
            </Row>
            <Card size="small"
                style={{
                    head: { color: 'black' },
                    body: { paddingRight: '0px', paddingLeft: '0px' },
                    padding: '0px', border: 'none', backgroundColor: 'transparent', color: 'black'
                }}
                tabList={tabListNoTitle}
                activeTabKey={activeTabKey2}
                onTabChange={onTab2Change}>
                {isLoaded ? (
                    data.length > 0 ? (
                        contentListNoTitle[activeTabKey2]
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
    // return (
    //     <> {isLoaded ?
    //         (
    //             <>
    //                 <Card title={title} bordered={false} size="small"
    //                     tabList={tabListNoTitle}
    //                     activeTabKey={activeTabKey2}
    //                     onTabChange={onTab2Change}>
    //                     {contentListNoTitle[activeTabKey2]}
    //                 </Card>
    //             </>

    //         ) : (
    //             <Spin />
    //         )
    //     }
    //     </>
    // );
}

export default TreeMapPlot;