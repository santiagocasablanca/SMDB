import React, { useState, useEffect, useMemo } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Skeleton, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchVideoStatsFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

import { Line } from '@ant-design/plots';

const { Title } = Typography;

const LatestVideosGrowthLine = ({ title, filter, start = 0 }) => {
    const [data, setData] = useState([]);
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        asyncFetch();
    }, [title]);

    const asyncFetch = () => {
        let params = new URLSearchParams();
        params.append("video_ids", filter.videos.map(video => { return video.video_id; }));
        // params.append("groupByChannel", false);
        fetchVideoStatsFn(params)
            .then((result) => {
                const data = result.results?.map((video_stat) => {
                    // console.log(video_stat)
                    let video = filter.videos.find((v) => v.video_id === video_stat.video_id);
                    if (video) {
                        // console.log(video_stat.fetched_date, parseDate(video.published_at, 'YYYY-MM-DD'), video_stat.fetched_date === parseDate(video.published_at, 'YYYY-MM-DD'));
                        if (video_stat.fetched_date === parseDate(video.published_at, 'YYYY-MM-DD')) {
                            return {
                                video_id: video_stat.video_id,
                                video_title: video?.title,
                                views: parseInt(0),
                                fetched_at: video_stat.fetched_date
                            }
                        } else {
                            return {
                                video_id: video_stat.video_id,
                                video_title: video?.title,
                                views: parseInt(video_stat.views),
                                fetched_at: video_stat.fetched_date
                            }
                        }
                    } else { return null; }
                })

                setData(data);
                setIsLoaded(true);
            });
    }

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
        // theme: 'default',
        padding: 'auto',
        xField: 'fetched_at',
        seriesField: 'video_id',
        yField: 'views',
        xAxis: {
            tickCount: 5,
        },
        slider: {
            start: start,
            end: 1,
            style: { fill: 'white' }
        },
        // smooth: true,
        animation: {
            appear: {
                animation: 'path-in',
                duration: 5000,
            },
        },
        legend: {
            position: 'bottom',
            offsetX: 8,
            offsetY: 5,
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
        meta: {
            video_id: {
                type: 'cat',
                values: filter.videos.map((v) => { return v.video_id; }),
                formatter: (val) => {
                    let video = filter.videos.find((v) => v.video_id === val);
                    return video.channel_title + ' - ' + video.title;
                    //   <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='100%' height="100%" preview={false}/>              }
                }
            }
        }
    };


    // const config = {
    //     data,
    //     xField: 'year',
    //     yField: 'value',
    //     isGroup: true,
    //     // isStack: true,
    //     seriesField: 'attribute',
    //     groupField: 'attribute',
    //     columnStyle: {
    //         radius: [20, 20, 0, 0],
    //     },
    //     tooltip: {
    //         customContent: (title, items) => {
    //             // console.log(JSON.stringify(data));
    //             // return (`<div>${JSON.stringify(data)}</div>`);
    //             return (
    //                 `<div class='container'>
    //                 <div class='title'>${title}</div>
    //                 <div class='tooltip-item'><span>Number of videos published: </span><span>${items[0]?.data?.frequency}</span></div>

    //                 <Divider/>
    //                 <div class='tooltip-item'><span>Total Views: </span><span>${intToStringBigNumber(items[0]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Max Views: </span><span>${intToStringBigNumber(items[1]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Avg Views: </span><span>${intToStringBigNumber(items[2]?.data?.value)}</span></div>

    //                 <Divider/>
    //                 <div class='tooltip-item'><span>Total Likes: </span><span>${intToStringBigNumber(items[3]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Max Likes: </span><span>${intToStringBigNumber(items[4]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Avg Likes: </span><span>${intToStringBigNumber(items[5]?.data?.value)}</span></div>

    //                 <Divider/>
    //                 <div class='tooltip-item'><span>Total Comments: </span><span>${intToStringBigNumber(items[6]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Max Comments: </span><span>${intToStringBigNumber(items[7]?.data?.value)}</span></div>
    //                 <div class='tooltip-item'><span>Avg Comments: </span><span>${intToStringBigNumber(items[8]?.data?.value)}</span></div>

    //                 </div>`
    //             );
    //         }
    //     },
    //     label: false,
    //     yAxis: {
    //         formatter: (val) => {
    //             return intToStringBigNumber(val);
    //         }
    //     },
    //     legend: {
    //         position: 'bottom',
    //         offsetX: 8,
    //         pageNavigator: {
    //             marker: {
    //                 style: { fill: 'white' }
    //             }
    //         }
    //         // title: {
    //         //   text: '产品类别 (平均销售量）',
    //         //   spacing: 8,
    //         // },

    //     },
    // };


    return (
        <>
            <Row>
                <Col span={24}>
                    <Title style={{ color: "black", marginBottom: '25px' }} level={4}>{title}</Title>
                </Col>
            </Row>
            {/* <Card bordered={false} size="small"> */}
            {isLoaded ? (
                data.length > 0 ? (
                    <Line {...config} style={{ marginTop: '10px' }} />
                ) : (
                        <Card bordered={false} size="small">
                            <Empty description="No data available" />
                        </Card>
                        // <Text>No data available.</Text>
                    )
            ) : (
                    <Skeleton.Image active size="large" width="100%" height="300px" />

                    // <Spin />
                )}
            {/* </Card> */}
        </>
    );

}

export default LatestVideosGrowthLine;
