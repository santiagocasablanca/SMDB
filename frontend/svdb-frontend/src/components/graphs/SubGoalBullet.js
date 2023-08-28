import { Bullet } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { findGroupedByCastFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;




const SubGoalBullet = ({ channel }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(true);
    // const [data, setData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);



    useEffect(() => {
        // console.log(channel);
    }, [channel]);

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

    const getRangeBasedOnSubs = (num) => {
        if (num === undefined || num === null) return 0;
        const numericString = num.toString().replace(/[^0-9.]/g, '');
        const parsedNum = parseFloat(numericString).toFixed(0);
        console.log(parsedNum);
        if (parsedNum < 1000) {
            return 1000;
        }
        const si = [
            { v: 1E3, s: 'K' },
            { v: 1E6, s: 'M' },
            { v: 1E9, s: 'B' },
            { v: 1E12, s: 'T' },
            { v: 1E15, s: 'P' },
            { v: 1E18, s: 'E' },
        ];
        let index;
        for (index = si.length - 1; index > 0; index--) {
            if (parsedNum >= si[index].v) {
                break;
            }
        }

        if (si[(index)].s === 'K' && parsedNum < 10000) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 10000) / 100) * 100);
            return (Math.ceil((parsedNum/100) / 100) * 100) * 100;
        } else if (si[(index)].s === 'K' && parsedNum >= 10000) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100) / 100) * 10000);
            return (Math.ceil((parsedNum / 1000) / 100) * 100) * 1000;
        }
        else if (si[(index)].s === 'M' && parsedNum < 1*1E6) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100000) / 100) * 100);
            return (Math.ceil((parsedNum / 10000) / 100) * 100) * 10000;
        }
        else if (si[(index)].s === 'M' && parsedNum >= 1*1E6) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100000) / 100) * 100);
            return (Math.ceil((parsedNum / 100000) / 100) * 100) * 100000;
        }
        else if (si[(index)].s === 'B') {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 1000000) / 100) * 100)
            return (Math.ceil((parsedNum / 10000000) / 100) * 100) * 10000000;
        } else if (si[(index)].s === 'T') {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 1000000) / 100) * 100)
            return (Math.ceil((parsedNum / 100000000) / 100) * 100) * 100000000;
        } else {
            return 0;
        }

        const value = Math.ceil((parsedNum / si[index].v) / 100) * 100;
        console.log(value * si[index].v);
        return value * si[index].v;
    }

    const getTargetBasedOnSubs = (num) => {
        if (num === undefined || num === null) return 0;
        const numericString = num.toString().replace(/[^0-9.]/g, '');
        const parsedNum = parseFloat(numericString).toFixed(0);
        console.log(parsedNum);
        if (parsedNum < 500) {
            return parseFloat(500);
        } else if (parsedNum < 1000) {
            return parseFloat(1000);
        }
        const si = [
            { v: 1E3, s: 'K' },
            { v: 1E6, s: 'M' },
            { v: 1E9, s: 'B' },
            { v: 1E12, s: 'T' },
            { v: 1E15, s: 'P' },
            { v: 1E18, s: 'E' },
        ];
        let index;
        for (index = si.length - 1; index > 0; index--) {
            if (parsedNum >= si[index].v) {
                break;
            }
        }
        let value = 0;
        if (si[(index)].s === 'K' && parsedNum < 10000) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 10) / 100) * 10);
            return (Math.ceil((parsedNum / 10) / 100) * 100) * 10;
        } else if (si[(index)].s === 'K' && parsedNum >= 10000) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100) / 100) * 10000);
            return (Math.ceil((parsedNum / 1000) / 100) * 100) * 1000;
        }
        else if (si[(index)].s === 'M' && parsedNum < 10*1E6) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100000) / 100) * 100);
            return (Math.ceil((parsedNum / 10000) / 100) * 100) * 10000;
        }
        else if (si[(index)].s === 'M' && parsedNum >= 10*1E6) {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 100000) / 100) * 100);
            return (Math.ceil((parsedNum / 100000) / 100) * 100) * 100000;
        }
        else if (si[(index)].s === 'B') {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 1000000) / 100) * 100)
            return (Math.ceil((parsedNum / 1000000) / 100) * 100) * 1000000;
        } else if (si[(index)].s === 'T') {
            // console.log(parsedNum, index, si[(index)].s, Math.ceil((parsedNum / 1000000) / 100) * 100)
            return (Math.ceil((parsedNum / 10000000) / 100) * 100) * 10000000;
        } else {
            return 0;
        }
    }


    const dataSubs = [
        {
            title: 'Subscriptions',
            ranges: [getRangeBasedOnSubs(channel?.subs)],
            subs: [parseInt(channel?.subs)],
            target: getTargetBasedOnSubs(channel?.subs),
        },
    ];

    const dataVideos = [
        {
            title: 'Videos',
            ranges: [getRangeBasedOnSubs(channel?.videos)],
            videos: [parseInt(channel?.videos)],
            target: getTargetBasedOnSubs(channel?.videos),
        },
    ];

    const dataViews = [
        {
            title: 'Views',
            ranges: [getRangeBasedOnSubs(channel?.views)],
            views: [parseInt(channel?.views)],
            target: getTargetBasedOnSubs(channel?.views),
        },
    ];

    const configSubs = {
        data: dataSubs,
        measureField: 'subs',
        rangeField: 'ranges',
        targetField: 'target',
        xField: 'title',
        height: '65px',
        color: {
            range: ['#bfeec8'],
            subs: ['#000000'],
            target: '#FCF536',
        },
        label: {
            measure: {
                position: 'left',
                style: {
                    fill: '#fff',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('mKey')) {
                        return intToStringBigNumber(val.subs);
                    }
                }
            },
            target: {
                formatter: (val) => {
                    if (val.hasOwnProperty('tKey')) {
                        return intToStringBigNumber(val.target);
                    } 
                }
            },
            range: {
                position: 'right',
                style: {
                    fill: '#111',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('rKey')) {
                        return intToStringBigNumber(val.ranges);
                    } 
                }
            },
        },
        xAxis: {
            line: null,
        },
        yAxis: false,
        tooltip: {
            showMarkers: false,
            shared: true,
        }
    };

    const configVideos = {
        data: dataVideos,
        measureField: 'videos',
        rangeField: 'ranges',
        targetField: 'target',
        xField: 'title',
        height: '65px',
        color: {
            range: ['#bfeec8'],
            subs: ['#000000'],
            target: '#FCF536',
        },
        label: {
            measure: {
                position: 'left',
                style: {
                    fill: '#fff',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('mKey')) {
                        return intToStringBigNumber(val.videos);
                    }
                }
            },
            target: {
                formatter: (val) => {
                    if (val.hasOwnProperty('tKey')) {
                        return intToStringBigNumber(val.target);
                    } 
                }
            },
            range: {
                position: 'right',
                style: {
                    fill: '#111',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('rKey')) {
                        return intToStringBigNumber(val.ranges);
                    } 
                }
            }
        },
        xAxis: {
            line: null,
        },
        yAxis: false,
        tooltip: {
            showMarkers: false,
            shared: true,
        }
    };

    const configViews = {
        data: dataViews,
        measureField: 'views',
        rangeField: 'ranges',
        targetField: 'target',
        xField: 'title',
        height: '65px',
        color: {
            range: ['#bfeec8'],
            subs: ['#000000'],
            target: '#FCF536',
        },
        label: {
            measure: {
                position: 'left',
                style: {
                    fill: '#fff',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('mKey')) {
                        return intToStringBigNumber(val.views);
                    }
                }
            },
            target: {
                formatter: (val) => {
                    if (val.hasOwnProperty('tKey')) {
                        return intToStringBigNumber(val.target);
                    } 
                }
            },
            range: {
                position: 'right',
                style: {
                    fill: '#111',
                },
                formatter: (val) => {
                    if (val.hasOwnProperty('rKey')) {
                        return intToStringBigNumber(val.ranges);
                    } 
                }
            },
        },
        xAxis: {
            line: null,
        },
        yAxis: false,
        tooltip: {
            showMarkers: false,
            shared: true,
        }
    };
    return (
        <>
            {/* <Row>
                <Col span={24}>
                    <Title style={{ color: "black" }} level={5}>Sub Goal</Title>
                </Col>
            </Row> */}
            {/* <Card bordered={false} size="small"> */}
            {isLoaded ? (
                channel ? (
                    <>
                        <Bullet {...configSubs} style={{ marginBottom: '3px' }} />

                        <Bullet {...configVideos} style={{ marginBottom: '3px' }} />

                        <Bullet {...configViews} />

                    </>
                ) : (
                        <Empty description="No data available" />
                        // <Text>No data available.</Text>
                    )
            ) : (
                    <Spin />
                )}
            {/* </Card> */}
        </>
    );
}

export default SubGoalBullet;

