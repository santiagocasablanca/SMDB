import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchStatsGroupedByYearFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

import { Radar } from '@ant-design/plots';

const { Title } = Typography;

const ChannelTagRadarForViews = ({ title, filter, options }) => {
    const [data, setData] = useState([]);
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);


    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", filter.channels);
            params.append("groupByChannel", true);
            fetchStatsGroupedByYearFn(params)
                .then((result) => {
                    const groupedData = [];
                    // Transform the fetched data into the required format
                    const transformedData = result.results.map((item) => {
                        // console.log(item);
                        return {
                            year: item.year,
                            attribute: 'Total Views',
                            channel_title: item.channel_title,
                            value: parseInt(item.views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        };
                    });



                    setData(transformedData);
                    setIsLoaded(true);

                    // console.log("finished fetching");
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
        // tooltip: {
        //     customContent: (title, items) => {
        //         // console.log(JSON.stringify(data));
        //         // return (`<div>${JSON.stringify(data)}</div>`);
        //         return (
        //             `<div class='container'>
        //             <div class='title'>${title}</div>
        //             <div class='tooltip-item'><span>Number of videos published: </span><span>${items[0]?.data?.frequency}</span></div>

        //             <Divider/>
        //             <div class='tooltip-item'><span>Total Views: </span><span>${intToStringBigNumber(items[0]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Max Views: </span><span>${intToStringBigNumber(items[1]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Avg Views: </span><span>${intToStringBigNumber(items[2]?.data?.value)}</span></div>

        //             <Divider/>
        //             <div class='tooltip-item'><span>Total Likes: </span><span>${intToStringBigNumber(items[3]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Max Likes: </span><span>${intToStringBigNumber(items[4]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Avg Likes: </span><span>${intToStringBigNumber(items[5]?.data?.value)}</span></div>

        //             <Divider/>
        //             <div class='tooltip-item'><span>Total Comments: </span><span>${intToStringBigNumber(items[6]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Max Comments: </span><span>${intToStringBigNumber(items[7]?.data?.value)}</span></div>
        //             <div class='tooltip-item'><span>Avg Comments: </span><span>${intToStringBigNumber(items[8]?.data?.value)}</span></div>

        //             </div>`
        //         );
        //     }
        // },

        legend: {
            position: 'right',
            offsetX: 8,
            // flipPage: true,
            selected: {
                '2023': true,
                '2022': true,
                '2021': true,
                '2020': true,
                '2019': true,
                '2018': false,
                '2017': false,
                '2016': false,
                '2015': false,
                '2014': false,
                '2013': false,
                '2012': false,
                '2011': false,
                '2010': false,
                '2009': false,
            },
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
        },
        xField: options.xField,
        yField: options.yField,
        seriesField: options.seriesField,
        area: {},
        xAxis: {
            line: null,
            tickLine: null,
            grid: {
                line: {
                    style: {
                        lineDash: null,
                    },
                },
            },
        },
        // 开启辅助点
        point: {
            size: 2,
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
                        <Radar {...config} />
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

export default ChannelTagRadarForViews;
