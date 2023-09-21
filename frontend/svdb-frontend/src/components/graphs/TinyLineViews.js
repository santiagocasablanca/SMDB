import { TinyArea } from '@ant-design/plots';
import React, { useState, useEffect, useMemo } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { fetchVideoStatsFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';

const TinyLineViews = ({ video }) => {

    const [data, setData] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        asyncFetch();
    }, [video]);

    const asyncFetch = () => {
        let params = new URLSearchParams();
        params.append("video_ids", video.video_id);

        const _data = [];
        fetchVideoStatsFn(params)
            .then((result) => {
                result.results?.forEach(video_stat => {
                    // console.log(parseInt(video_stat.views));
                    _data.push(parseInt(video_stat.views));
                });


            }).then((cont) => {
                // console.log(cont);
                // console.log(_data);
                setData(_data);
                setIsLoaded(true);
            });
    }

    // const data = [
    //     264, 417, 438, 887, 309, 397, 550, 575, 563, 430, 525, 592, 492, 467, 513, 546, 983, 340, 539, 243, 226, 192,
    // ];
    const config = {
        height: 50,
        autoFit: true,
        data,
        smooth: true,
        color: '#E5EDFE',
        pattern: {
            type: 'line',
            cfg: {
                stroke: '#5B8FF9',
            },
        },
    };
    return (<>
        {
            isLoaded ? (
                data.length > 0 ? (
                    <div className="">
                        <TinyArea {...config} />
            </div>
                ) : (
                        <Empty description="No data available" />
                        // <Text>No data available.</Text>
                    )
            ) : (
                    <Spin />
                )
        }
    </>);

};



export default TinyLineViews;