import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchStatsGroupedByDurationRangeFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

import { Bar } from '@ant-design/plots';

const { Title } = Typography;

const StatsGroupedByDurationBar = ({ title, filter }) => {
    const [data, setData] = useState([]);
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    const durationRangeLabel = (value) => {
        switch (value) {
            case "1000":
                return 'Less than 10 minutes';
            case "1200":
                return '10 to 20 minutes';
            case "1800":
                return '20 to 30 minutes';
            case "3600":
                return '30 minutes to 1 hour';
            case "7200":
                return '1 to 2 hours';
            case "7201":
                return 'Longer than 2 hours';
        }
    }


    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", filter.channels);
            // params.append("groupByChannel", false);
            fetchStatsGroupedByDurationRangeFn(params)
                .then((result) => {
                    const groupedData = [];
                    // Transform the fetched data into the required format
                    const transformedData = result.results.map((item) => {

                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Total Views',
                            value: parseInt(item.views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Max Views',
                            value: parseInt(item.max_views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Avg Views',
                            value: parseInt(item.avg_views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Total Likes',
                            value: parseInt(item.likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Max Likes',
                            value: parseInt(item.max_likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Avg Likes',
                            value: parseInt(item.avg_likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Total Comments',
                            value: parseInt(item.comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Max Comments',
                            value: parseInt(item.max_comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            durationGroup: durationRangeLabel(item.durationGroup),
                            attribute: 'Avg Comments',
                            value: parseInt(item.avg_comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });

                        return groupedData;

                        // return {
                        //     year: item.year, // Assuming the title property holds the name
                        //     value: item.frequency ? parseInt(item.frequency) : 0, // Assuming the likes property holds the value
                        //     // Additional properties can be added here if needed
                        //     views: parseInt(item.views),
                        //     avg_views: parseInt(item.avg_views),
                        //     max_views: parseInt(item.max_views),
                        //     likes: parseInt(item.likes),
                        //     avg_likes: parseInt(item.avg_likes),
                        //     max_likes: parseInt(item.lmax_ikes),
                        //     comments: parseInt(item.comments),
                        //     avg_comments: parseInt(item.avg_comments),
                        //     max_comments: parseInt(item.max_comments)
                        // };
                    });



                    setData(groupedData);
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
        height: 450,
        xField: 'value',
        yField: 'durationGroup',
        isGroup: true,
        // isStack: true,
        seriesField: 'attribute',
        groupField: 'attribute',
        columnStyle: {
            radius: [20, 20, 0, 0],
        },
        tooltip: {
            customContent: (title, items) => {
                // console.log(JSON.stringify(data));
                // return (`<div>${JSON.stringify(data)}</div>`);
                return (
                    `<div class='container'>
                    <div class='title'>${title}</div>
                    <div class='tooltip-item'><span>Number of videos published: </span><span>${items[0]?.data?.frequency}</span></div>

                    <Divider/>
                    <div class='tooltip-item'><span>Total Views: </span><span>${intToStringBigNumber(items[0]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Max Views: </span><span>${intToStringBigNumber(items[1]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Avg Views: </span><span>${intToStringBigNumber(items[2]?.data?.value)}</span></div>

                    <Divider/>
                    <div class='tooltip-item'><span>Total Likes: </span><span>${intToStringBigNumber(items[3]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Max Likes: </span><span>${intToStringBigNumber(items[4]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Avg Likes: </span><span>${intToStringBigNumber(items[5]?.data?.value)}</span></div>
                    
                    <Divider/>
                    <div class='tooltip-item'><span>Total Comments: </span><span>${intToStringBigNumber(items[6]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Max Comments: </span><span>${intToStringBigNumber(items[7]?.data?.value)}</span></div>
                    <div class='tooltip-item'><span>Avg Comments: </span><span>${intToStringBigNumber(items[8]?.data?.value)}</span></div>
                    
                    </div>`
                );
            }
        },
        label: false,
        xAxis: {
            formatter: (val) => {
                return intToStringBigNumber(val);
            }
        },
        legend: {
            position: 'bottom',
            offsetX: 8,
            pageNavigator: {
                marker: {
                    style: { fill: 'white' }
                }
            }
            // title: {
            //   text: '产品类别 (平均销售量）',
            //   spacing: 8,
            // },

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
                        <Bar {...config} />
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

export default StatsGroupedByDurationBar;
