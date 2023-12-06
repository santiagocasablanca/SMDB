import React, { useState, useEffect, useMemo } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchVideoStatsFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

import { Line } from '@ant-design/plots';

const { Title } = Typography;

const VideoGrowthLine = ({ _video }) => {
    const [data, setData] = useState([]);
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {
        asyncFetch();
    }, [_video]);

    const asyncFetch = () => {
        let params = new URLSearchParams();
        params.append("video_ids", _video.video_id);

        const _data = [];
        fetchVideoStatsFn(params)
            .then((result) => {
                result.results?.forEach(video_stat => {
                    _data.push({
                        category: 'Views',
                        value: parseInt(video_stat.views),
                        fetched_at: video_stat.fetched_date
                    });
                    _data.push({
                        category: 'Likes',
                        value: parseInt(video_stat.likes),
                        fetched_at: video_stat.fetched_date
                    });
                    _data.push({
                        category: 'Comments',
                        value: parseInt(video_stat.comments),
                        fetched_at: video_stat.fetched_date
                    });

                });


            }).then((cont) => {
                console.log(cont);
                // const stats = await getChannelStatsFn(_video?.channel.channel_id);
                // console.log(stats);

                // if (_video !== undefined && stats !== undefined) {
                //     _data.push({
                //         category: 'Avg Comments',
                //         value: parseFloat(stats?.comments.avg),
                //         fetched_at: video_stat.fetched_date
                //     });

                //     const avg_channel_views = parseFloat(stats?.views.avg);
                //     const avg_channel_likes = parseFloat(stats?.likes.avg);
                //     const avg_channel_comments =parseFloat(stats?.comments.avg) ;
                // }

                setData(_data);
                setIsLoaded(true);
            });
    }

    insertCss(`

    .videoGrowthLineContainer {
        width: 600px;
    }

      @media (max-width: 600px) {
        .videoGrowthLineContainer {
            width: 320px;
        }
    }

    
    `);


    const config = {
        data,
        theme: 'dark',
        padding: 'auto',
        xField: 'fetched_at',
        seriesField: 'category',
        yField: 'value',
        xAxis: {
            tickCount: 5,
        },
        slider: {
            start: 0,
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
            position: 'top',
            offsetX: 8,
            offsetY: 1,
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
    };

    return (
        <>
            <Card bordered={false} size="small">
                {isLoaded ? (
                    data.length > 0 ? (
                        <div className="videoGrowthLineContainer">
                            <Line {...config} />
                        </div>
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

export default VideoGrowthLine;
