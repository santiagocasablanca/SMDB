import React, { useState, useEffect } from 'react';
import { Rose } from '@ant-design/plots';
import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Divider, Popover, Button, Typography, Space, Spin, Empty } from 'antd';
import { Treemap } from '@ant-design/plots';

import insertCss from 'insert-css';
import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getTreeMapPlotForTagsFn } from "../../services/videoApi.ts";
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;




const TitleRose = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [data, setData] = useState([]);
    const [refreshKey, setRefreshKey] = useState(0);



    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", filter.channels);
            params.append("sort", filter.sort)
            getTreeMapPlotForTagsFn(params)
                .then((result) => {

                    // Transform the fetched data into the required format
                    const transformedData = result.results.map((item) => {
                        return {
                            name: item.serie, // Assuming the title property holds the name
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
                    setLikedSeriesData(transformedLikedData);
                    setIsLoaded(true);

                    console.log("finished fetching");
                });
        }
        fetchData();

    }, [refreshKey, filter]);

    // insertCss(`

    // .videoPreviewForHighlight:hover {
    //     cursor: pointer;
    //   }
       
    //     .videoPreviewForHighlight h5, p {
    //         color: black;
    //     }
    //     .videoPreviewForHighlight span {
    //         color: black;
    //     }
    // `);

    const config = {
        data,
        xField: 'type',
        yField: 'value',
        seriesField: 'type',
        radius: 0.9,
        legend: {
          position: 'bottom',
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

export default TitleRose;

