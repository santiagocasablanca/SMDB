import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Statistic, Spin } from 'antd';
import insertCss from 'insert-css';
import CreatorStatsPanel from './CreatorStatsPanel'
import HorizontalVideoList from './HorizontalVideoList'
import StatisticsCards from './StatisticsCards'

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
import ReactPlayer from 'react-player'
import { getCreatorStatsFn } from "../../services/creatorApi.ts";




const { Title, Text } = Typography;



const CreatorChannel = ({ creator, channel }) => {

    const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayDurationFromSeconds, displayVideoDurationFromSeconds } = useFormatter();
    const [channels, setChannels] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAllChannels, setIsAllChannels] = useState(true);
    const [top10videos, setTop10videos] = useState([]);
    const [mostRecentVideos, setMostRecentVideos] = useState([]);

    const [stats, setStats] = useState({
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    });

    useEffect(() => {
        if (channel !== null) {
            setIsAllChannels(false);
        }
        fetchChannels();
    }, []);

    const fetchChannels = async () => {
        let creatorChannels = [];

        if (channel === null) {
            creatorChannels = await creator.channels?.map((channel) => {
                return channel.channel_id;
            });
        } else {
            creatorChannels.push(channel.channel_id);
        }

        // TODO remove shorts!? duration > 5 min
        let paramsTop10 = new URLSearchParams();
        paramsTop10.append("sort", "views%desc")
        paramsTop10.append("channels", creatorChannels);

        await getVideosFn(1, 10, paramsTop10)
            .then((result) => {
                setTop10videos(result.videos);
            })

        let paramsRecent = new URLSearchParams();
        paramsRecent.append("sort", "published_at%desc")
        paramsRecent.append("channels", creatorChannels);

        await getVideosFn(1, 10, paramsRecent)
            .then((result) => {
                setMostRecentVideos(result.videos);
            });

        let params = new URLSearchParams();
        params.append("channels", creatorChannels);

        await getCreatorStatsFn(params)
            .then((result) => {
                const data = (result.results)

                let sumTotalVideos = 0;
                let sumViews = 0;
                let sumLikes = 0;
                let sumDuration = 0; // in seconds
                let sumComments = 0;

                for (const result of data) {
                    sumTotalVideos += parseInt(result.total_videos);
                    sumViews += parseInt(result.views);
                    sumLikes += parseInt(result.likes);
                    sumDuration += parseInt(result.duration);
                    sumComments += parseInt(result.comments);
                }

                setStats({
                    subs: {
                        title: 'Total Subscribers',
                        value: channel ? channel.subs : creator.subs,
                        content: <p>{channel ? channel.subs : creator.subs}</p>
                    },
                    views: {
                        title: 'Total Views',
                        value: sumViews,
                        humanized: intToStringBigNumber(sumViews),
                        unparsedAvg: (sumViews / sumTotalVideos),
                        avg: intToStringBigNumber((sumViews / sumTotalVideos))
                    },
                    likes: {
                        title: 'Total Likes',
                        value: sumLikes,
                        humanized: intToStringBigNumber(sumLikes),
                        unparsedAvg: (sumLikes / sumTotalVideos),
                        avg: intToStringBigNumber(sumLikes / sumTotalVideos)
                    },
                    comments: {
                        title: 'Total Comments',
                        value: sumComments,
                        humanized: intToStringBigNumber(sumComments),
                        unparsedAvg: (sumComments / sumTotalVideos),
                        avg: intToStringBigNumber(sumComments / sumTotalVideos)
                    },
                    videos: {
                        title: 'Videos Published',
                        value: sumTotalVideos,
                        humanized: intToStringBigNumber(sumTotalVideos)
                    },
                    duration: {
                        title: 'Total Duration',
                        unparsedValue: sumDuration,
                        parsedValue: displayVideoDurationFromSeconds(sumDuration),
                        value: displayDurationFromSeconds(sumDuration),
                        humanized: humanizeDurationFromSeconds(sumDuration),
                        unparsedAvg: (sumDuration / sumTotalVideos),
                        avg: displayVideoDurationFromSeconds(sumDuration / sumTotalVideos)
                    },

                })
            })


        setIsLoaded(true);
    }


    // FIX responsiveness of this shit
    return (
        <> {isLoaded ?
            (
                <>
                    <div style={{ width: '100%' }}>
                        <Row gutter={[2, 2]} wrap={false} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                            <StatisticsCards stats={stats} />
                        </Row>
                    </div>
                    <br></br>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Title style={{ color: 'black' }} level={5}>Channel Stats</Title>
                            <CreatorStatsPanel creator={creator} channel={channel} stats={stats} mostRecentVideos={mostRecentVideos} isAllChannels={isAllChannels}></CreatorStatsPanel>
                        </Col>
                        <Col span={12}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <Title style={{ color: 'black' }} level={5}>Recent</Title>
                                    <HorizontalVideoList _videos={mostRecentVideos} />

                                    <Title style={{ color: 'black' }} level={5}>Most Viewed</Title>
                                    <HorizontalVideoList _videos={top10videos} />

                                    <Title style={{ color: 'black' }} level={5}>Last Appearences in other channels // TODO</Title>
                                    <HorizontalVideoList _videos={top10videos} />

                                    {/* <HorizontalVideoList _videos={top10videos} /> */}

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br></br>
                </>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default CreatorChannel;