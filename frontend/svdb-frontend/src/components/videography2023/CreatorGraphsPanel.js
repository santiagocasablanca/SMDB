import { Typography, Row, Col, Space, Spin } from 'antd';
import { YoutubeOutlined } from '@ant-design/icons';
import dayjs from "dayjs";

import insertCss from 'insert-css';
import { React, useEffect, useState } from "react";
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideosFn } from "../../services/videoApi.ts";
import FrequencyCard from "../home/FrequencyCard";
import TreeMapPlot from "../graphs/TreeMapPlot";
import CastRose from "../graphs/CastRose";
import UploadTimeFrequencyCard from '../home/UploadTimeFrequencyCard';
import CastScatterPlot from '../graphs/CastScatterPlot';
import StatsGroupedByYearColumns from '../graphs/StatsGroupedByYearColumns';
import StatsGroupedByChannelAndYearColumns from '../graphs/StatsGroupedByChannelAndYearColumns';
import ChannelTagRadar from '../graphs/ChannelTagRadar';
import ChannelTagRadarForViews from '../graphs/ChannelTagRadarForViews';
import StatsGroupedByDurationBar from '../graphs/StatsGroupedByDurationBar';
import SubGoalBullet from '../graphs/SubGoalBullet';
import LatestVideosGrowthLine from '../graphs/LatestVideosGrowthLine';
import FrequencyCardByYear from '../home/FrequencyCardByYear';
import UploadTimeFrequencyCardByYear from '../home/UploadTimeFrequencyCardByYear';

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title } = Typography;

const CreatorGraphsPanel = ({ title, _channels }) => {

    const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();

    const [channels, setChannels] = useState(_channels.map(item => { return item.channel_id; }));
    const [top10videos, setTop10videos] = useState([]);
    const [latestVideos, setLatestVideos] = useState([]);


    useEffect(() => {
        async function fetchData() {
            if (_channels.length > 0) {
            let _paramsTop10 = new URLSearchParams();
            _paramsTop10.append("channels", _channels.map(item => { return item.channel_id; }))
            _paramsTop10.append("sort", "views%desc")
            await getVideosFn(1, 20, _paramsTop10)
                .then((result) => {
                    setTop10videos(result.videos);
                })

                let latest = new URLSearchParams();
                latest.append("channels", _channels.map(item => { return item.channel_id; }))
                latest.append("sort", "published_at%desc")
                await getVideosFn(1, 20, latest)
                    .then((result) => {
                        setLatestVideos(result.videos);
                    })
                }
        }
        fetchData();
    }, [_channels]);

    insertCss(`
    .graphsTitle h3 {
        color: `+ variables.sdmnBlack + `;
    }
        @media (max-width: 600px) {
        }
    `);
    
    return (
        <>
            <Row className="graphsTitle">
                <Col span="24">
                    <Title level={3}><Space><YoutubeOutlined /> {title ? title : 'Graphs'}</Space></Title>
                </Col>
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24} md={24} lg={24} xl={24}>
                    <CastScatterPlot title={_channels?.length > 1 ? 'Appearences on the channels' : 'Appearences on the channel'} 
                    filter={{ channels: channels, publishedAtRange: [dayjs("2023").format("YYYY-MM-DD"), dayjs("2024").format("YYYY-MM-DD")]}} />
                </Col>
            </Row>

            {_channels?.length > 1 ? (
                <>
                    <br></br>
                    <Row gutter={[16, 16]}>
                        <Col span={24} md={24} lg={12} xl={12}>
                            <ChannelTagRadar title={'Channel Video Frequency by Year'} filter={{ channels: channels, groupByChannel: true }}
                                options={{
                                    xField: 'channel_title',
                                    yField: 'frequency',
                                    seriesField: 'year'
                                }} />
                        </Col>
                        <Col span={24} md={24} lg={12} xl={12}>
                            <ChannelTagRadarForViews title={'Channel Video Views by Year'} filter={{ channels: channels, groupByChannel: true }}
                                options={{
                                    xField: 'channel_title',
                                    yField: 'value',
                                    seriesField: 'year'
                                }} />
                        </Col>
                    </Row>
                </>
            ) : (
                    <></>
                )}

            <br></br>
            <Row gutter={[16, 16]}>
                <Col span={24} xl={24}>
                    <StatsGroupedByYearColumns title={_channels?.length > 1 ? 'Creator Stats by Year' : 'Channel Stats by Year'} filter={{ channels: channels, groupByChannel: true }} />
                </Col>
            </Row>

            <br></br>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {
                        latestVideos?.length > 0 ?
                            <LatestVideosGrowthLine title="Latest Videos View Growth" filter={{ videos: latestVideos }} />
                            : <Spin />
                    }
                </Col>
            </Row>
           

            <br></br>
            <Row gutter={[16, 16]}>
                <Col span={24} xl={24}>
                    <TreeMapPlot title="Videos Grouped by Tags" filter={{ channels: channels, sort: "views%desc" }} />
                </Col>
            </Row>
            <br></br>

            <Row gutter={[16, 16]}>
                <Col span={24} md={24} lg={12} xl={12}>
                    <StatsGroupedByDurationBar title={'Videos grouped by Duration'} filter={{ channels: channels }} />
                    {/* <StatsGroupedByChannelAndYearColumns title={_channels?.length > 1 ? 'Creator Stats by Year' : 'Channel Stats by Year'} filter={{ channels: _channels, groupByChannel: true }} /> */}
                </Col>
                <Col span={24} md={24} lg={12} xl={12}>
                    <UploadTimeFrequencyCardByYear _channels={_channels} year="2023"></UploadTimeFrequencyCardByYear>
                </Col>
            </Row>
            <br></br>

            {/* fetchGroupedByCast */}
            <Row gutter={[16, 16]} className="hide-on-small-screen">
                <Col span={24} xl={24}>
                    <FrequencyCardByYear _channels={_channels} year="2023"/>
                </Col>
            </Row>
            <br></br>
            
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {
                        top10videos?.length > 0 ?
                            <LatestVideosGrowthLine title="Top Videos Growth" filter={{ videos: top10videos }} />
                            : <Spin />
                    }
                </Col>
            </Row>
            <br></br>
        </>
    )
}

export default CreatorGraphsPanel;
