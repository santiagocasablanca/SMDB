import { Typography, Row, Col, Space, Spin } from 'antd';
import { YoutubeOutlined } from '@ant-design/icons';

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

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title } = Typography;

const CreatorGraphsPanel = ({ title, _channels }) => {

    const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();

    const [channels, setChannels] = useState(_channels);
    const [top10videos, setTop10videos] = useState([]);


    useEffect(() => {
        async function fetchData() {
            let _paramsTop10 = new URLSearchParams();
            _paramsTop10.append("channels", _channels.map(it => { return it.channel_id; }))
            _paramsTop10.append("sort", "views%desc")
            await getVideosFn(1, 10, _paramsTop10)
                .then((result) => {
                    setTop10videos(result.videos);
                })
        }
        fetchData();
    }, [title]);

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
                {/* <Col span="24">
            <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} />
          </Col> */}
            </Row>

            <Row gutter={[16, 16]}>
                <Col span={24} md={24} lg={24} xl={24}>
                    <CastScatterPlot title={_channels?.length > 1 ? 'Appearences on the channels' : 'Appearences on the channel'} filter={{ channels: _channels.map(it => { return it.channel_id; }) }} />
                </Col>
            </Row>

            {_channels?.length > 1 ? (
                <>
                    <br></br>
                    <Row gutter={[16, 16]}>
                        <Col span={24} md={24} lg={12} xl={12}>
                            <ChannelTagRadar title={'Channel Video Frequency by Year'} filter={{ channels: _channels.map(it => { return it.channel_id; }), groupByChannel: true }}
                                options={{
                                    xField: 'channel_title',
                                    yField: 'frequency',
                                    seriesField: 'year'
                                }} />
                        </Col>
                        <Col span={24} md={24} lg={12} xl={12}>
                            <ChannelTagRadarForViews title={'Channel Video Views by Year'} filter={{ channels: _channels.map(it => { return it.channel_id; }), groupByChannel: true }}
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
                    <StatsGroupedByYearColumns title={_channels?.length > 1 ? 'Creator Stats by Year' : 'Channel Stats by Year'} filter={{ channels: _channels.map(it => { return it.channel_id; }), groupByChannel: true }} />
                </Col>
            </Row>

            <br></br>
            <Row gutter={[16, 16]}>
                <Col span={24} xl={24}>
                    <TreeMapPlot title="Videos Grouped by Tags" filter={{ channels: _channels.map(it => { return it.channel_id; }), sort: "views%desc" }} />
                </Col>
            </Row>
            <br></br>

            <Row gutter={[16, 16]}>
                <Col span={24} md={24} lg={12} xl={12}>
                    <StatsGroupedByDurationBar title={'Videos grouped by Duration'} filter={{ channels: _channels.map(it => { return it.channel_id; }) }} />
                    {/* <StatsGroupedByChannelAndYearColumns title={_channels?.length > 1 ? 'Creator Stats by Year' : 'Channel Stats by Year'} filter={{ channels: _channels.map(it => { return it.channel_id; }), groupByChannel: true }} /> */}
                </Col>
                <Col span={24} md={24} lg={12} xl={12}>
                    <UploadTimeFrequencyCard _channels={channels}></UploadTimeFrequencyCard>
                </Col>
            </Row>
            <br></br>

            {/* fetchGroupedByCast */}
            <Row gutter={[16, 16]} className="hide-on-small-screen">
                <Col span={24} xl={24}>
                    <FrequencyCard _channels={_channels}></FrequencyCard>
                </Col>
            </Row>
            <br></br>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    {/* <AppIntro /> */}
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
