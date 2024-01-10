import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchStatsGroupedByYearFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

import { Column } from '@ant-design/plots';

const { Title } = Typography;

const StatsGroupedByChannelAndYearColumns = ({ title, filter }) => {
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

                        groupedData.push({
                            year: item.year,
                            attribute: 'Total Views',
                            channel_title: item.channel_title,
                            value: parseInt(item.views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Max Views',
                            channel_title: item.channel_title,
                            value: parseInt(item.max_views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Avg Views',
                            channel_title: item.channel_title,
                            value: parseInt(item.avg_views),
                            sum: parseInt(item.views),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Total Likes',
                            channel_title: item.channel_title,
                            value: parseInt(item.likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Max Likes',
                            channel_title: item.channel_title,
                            value: parseInt(item.max_likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Avg Likes',
                            channel_title: item.channel_title,
                            value: parseInt(item.avg_likes),
                            sum: parseInt(item.likes),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Total Comments',
                            channel_title: item.channel_title,
                            value: parseInt(item.comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Max Comments',
                            channel_title: item.channel_title,
                            value: parseInt(item.max_comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });
                        groupedData.push({
                            year: item.year,
                            attribute: 'Avg Comments',
                            channel_title: item.channel_title,
                            value: parseInt(item.avg_comments),
                            sum: parseInt(item.comments),
                            frequency: parseInt(item.frequency),
                        });

                        return groupedData;

                        
                    });



                    setData(groupedData);
                    setIsLoaded(true);
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
        xField: 'year',
        yField: 'value',
        isGroup: true,
        isStack: true,
        stackField: 'channel_title',
        groupField: 'attribute',
        seriesField: 'attribute',
        // columnStyle: {
        //     radius: [20, 20, 0, 0],
        // },
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
        yAxis: {
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
                    <Title style={{ color: "black" }} level={4}>{title}</Title>
                </Col>
            </Row>
            <Card style={{padding: '0px', border: 'none', backgroundColor: 'transparent', color: 'black'}}
                headStyle={{color: 'black'}}
                bodyStyle={{paddingRight: '0px', paddingLeft: '0px'}} size="small">
                {isLoaded ? (
                    data.length > 0 ? (
                        <Column {...config} />
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

export default StatsGroupedByChannelAndYearColumns;
