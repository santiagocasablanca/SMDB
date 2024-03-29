import { Col, Row, Spin, Typography, Card } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import useFormatter from '../../hooks/useFormatter';
import { getCreatorStatsFn } from "../../services/creatorApi.ts";
import { getVideosFn } from "../../services/videoApi.ts";
import CreatorFrequencyCard from './CreatorFrequencyCard';
import CreatorStatsPanel from './CreatorStatsPanel';
import HorizontalHighlightedList from '../video/HorizontalHighlightedList';
import HorizontalVideoList from './HorizontalVideoList';
import StatisticsCards from './StatisticsCards';
import FrequencyCard from '../home/FrequencyCard';
import SubGoalBullet from '../graphs/SubGoalBullet';
import Statistic from 'antd/es/statistic/Statistic';


const { Title, Text } = Typography;

const CreatorChannel = ({ creator, channel }) => {

    const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, parseDateToFromNow, displayDurationFromSeconds, displayVideoDurationFromSeconds } = useFormatter();
    const [channels, setChannels] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [isAllChannels, setIsAllChannels] = useState(true);
    const [top10videos, setTop10videos] = useState([]);
    const [mostRecentVideos, setMostRecentVideos] = useState([]);
    const [paramsTop10, setParamsTop10] = useState();
    const [paramsRecent, setParamsRecent] = useState();

    const [stats, setStats] = useState({
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    });
    const [channelsStats, setChannelsStats] = useState([{
        channel_id: "",
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    }]);

    useEffect(() => {
        if (channel !== null) {
            setIsAllChannels(false);
        }
        fetchChannels();
    }, [creator, channel]);

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

        setParamsTop10({
            sort: "views%desc",
            channels: creatorChannels
        });
        await getVideosFn(1, 10, paramsTop10)
            .then((result) => {
                setTop10videos(result.videos);
            })


        let paramsRecent = new URLSearchParams();
        paramsRecent.append("sort", "published_at%desc")
        paramsRecent.append("channels", creatorChannels);
        setParamsRecent({
            sort: "published_at%desc",
            channels: creatorChannels
        });
        await getVideosFn(1, 10, paramsRecent)
            .then((result) => {
                setMostRecentVideos(result.videos);
            });

        let params = new URLSearchParams();
        params.append("channels", creatorChannels);

        await getCreatorStatsFn(params)
            .then((result) => {
                const data = (result.results);
                let tempArray = [];
                for (const el of data) {
                    tempArray.push({
                        channel_id: el.channel_id,
                        subs: {
                            title: 'Total Subscribers',
                            value: el.subs,
                            content: <p>{el.subs}</p>
                        },
                        views: {
                            title: 'Total Views',
                            value: el.views,
                            humanized: intToStringBigNumber(el.views),
                            avg: (el.views / el.total_videos),
                            humanizedAvg: intToStringBigNumber((el.views / el.total_videos)),
                            most: el.most_viewed,
                            least: el.least_viewed,
                            humanizedMost: intToStringBigNumber(el.most_viewed),
                            humanizedLeast: intToStringBigNumber(el.least_viewed)
                        },
                        likes: {
                            title: 'Total Likes',
                            value: el.likes,
                            humanized: intToStringBigNumber(el.likes),
                            avg: (el.likes / el.total_videos),
                            humanizedAvg: intToStringBigNumber(el.likes / el.total_videos),
                            most: el.most_liked,
                            least: el.least_liked,
                            humanizedMost: intToStringBigNumber(el.most_liked),
                            humanizedLeast: intToStringBigNumber(el.least_liked)
                        },
                        comments: {
                            title: 'Total Comments',
                            value: el.comments,
                            humanized: intToStringBigNumber(el.comments),
                            avg: (el.comments / el.total_videos),
                            humanizedAvg: intToStringBigNumber(el.comments / el.total_videos),
                            most: el.most_commented,
                            least: el.least_commented,
                            humanizedMost: intToStringBigNumber(el.most_commented),
                            humanizedLeast: intToStringBigNumber(el.least_commented)
                        },
                        videos: {
                            title: 'Videos Published',
                            value: el.total_videos,
                            humanized: intToStringBigNumber(el.total_videos)
                        },
                        duration: {
                            title: 'Total Duration',
                            value: el.duration,
                            parsedValue: displayVideoDurationFromSeconds(el.duration),
                            humanized: displayDurationFromSeconds(el.duration),
                            evenMoreHumanized: humanizeDurationFromSeconds(el.duration),
                            avg: (el.duration / el.total_videos),
                            humanizedAvg: displayVideoDurationFromSeconds(el.duration / el.total_videos),
                            most: el.longest,
                            least: el.shortest,
                            humanizedMost: displayVideoDurationFromSeconds(el.longest),
                            humanizedLeast: displayVideoDurationFromSeconds(el.shortest)
                        }
                    });
                }

                setChannelsStats(tempArray);

                let sumTotalVideos = 0;
                let sumViews = 0;
                let sumLikes = 0;
                let sumDuration = 0; // in seconds
                let sumComments = 0;
                let mostViewed = 0;
                let leastViewed = null;
                let mostLiked = 0;
                let leastLiked = null;
                let mostCommented = 0;
                let leastCommented = null;
                let longest = 0;
                let shortest = null;

                for (const result of data) {
                    sumTotalVideos += parseInt(result.total_videos);
                    sumViews += parseInt(result.views);
                    sumLikes += parseInt(result.likes);
                    sumDuration += parseInt(result.duration);
                    sumComments += parseInt(result.comments);
                    mostViewed = (result.most_viewed > mostViewed ? result.most_viewed : mostViewed);
                    leastViewed = (leastViewed ? (result.least_viewed < leastViewed ? result.least_viewed : leastViewed) : result.least_viewed);
                    mostLiked = (result.most_liked > mostLiked ? result.most_liked : mostLiked);
                    leastLiked = (leastLiked ? (result.least_liked < leastLiked ? result.least_liked : leastLiked) : result.least_liked);

                    mostCommented = (result.most_commented > mostCommented ? result.most_commented : mostCommented);
                    leastCommented = (leastCommented ? (result.least_commented < leastCommented ? result.least_commented : leastCommented) : result.least_commented);
                    longest = (result.longest > longest ? result.longest : longest);
                    shortest = (shortest ? (result.shortest < shortest ? result.shortest : shortest) : result.shortest);
                }


                // TODO clean this mess!!! 

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
                        avg: intToStringBigNumber((sumViews / sumTotalVideos)),
                        most: intToStringBigNumber(mostViewed),
                        least: intToStringBigNumber(leastViewed)
                    },
                    likes: {
                        title: 'Total Likes',
                        value: sumLikes,
                        humanized: intToStringBigNumber(sumLikes),
                        unparsedAvg: (sumLikes / sumTotalVideos),
                        avg: intToStringBigNumber(sumLikes / sumTotalVideos),
                        most: intToStringBigNumber(mostLiked),
                        least: intToStringBigNumber(leastLiked)
                    },
                    comments: {
                        title: 'Total Comments',
                        value: sumComments,
                        humanized: intToStringBigNumber(sumComments),
                        unparsedAvg: (sumComments / sumTotalVideos),
                        avg: intToStringBigNumber(sumComments / sumTotalVideos),
                        most: intToStringBigNumber(mostCommented),
                        least: intToStringBigNumber(leastCommented)
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
                        humanized: displayDurationFromSeconds(sumDuration),
                        evenMoreHumanized: humanizeDurationFromSeconds(sumDuration),
                        unparsedAvg: (sumDuration / sumTotalVideos),
                        avg: displayVideoDurationFromSeconds(sumDuration / sumTotalVideos),
                        most: displayVideoDurationFromSeconds(longest),
                        least: displayVideoDurationFromSeconds(shortest)
                    },

                })
            })


        setIsLoaded(true);
    }
    insertCss(`
    .responsiveCard {
        height: 119px;
    }

    @media (max-width: 768px) {
        .hide-on-small-screen {
          display: none;
        }
        .responsiveCard {
            height: 145px;
        }
      }
      `);

    // FIX responsiveness of this shit
    return (
        <> {isLoaded ?
            (
                <>
                    <div style={{ width: '100%' }}>
                        <Row gutter={[8, 4]} wrap={false} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                            <StatisticsCards stats={stats} />
                        </Row>
                    </div>
                    <br></br>
                    <Row gutter={[16, 16]}>
                        <Col span={24} xl={12}>
                            <Title style={{ color: 'black' }} level={4}>Channel Stats</Title>

                            <CreatorStatsPanel creator={creator} channel={channel} stats={stats} channelsStats={channelsStats} mostRecentVideos={mostRecentVideos} isAllChannels={isAllChannels}></CreatorStatsPanel>
                        </Col>
                        <Col span={24} xl={12}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    {/* <div style={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'flex-start', gap: '9px' }}> */}
                                    <Row gutter={4}>
                                        <Col span={9}>
                                            <Title style={{ color: 'black' }} level={4}>Last Video</Title>

                                            <Card bordered={false} className="responsiveCard">
                                                <Statistic
                                                    title="Last Video was published "
                                                    value={parseDateToFromNow(mostRecentVideos[0]?.published_at)}
                                                />
                                            </Card>
                                        </Col>

                                        <Col span={15}>
                                            <Title style={{ color: 'black' }} level={4}>Next Goals</Title>
                                            {/* style={{ width: '100%', height: '112px' }} */}
                                            <Card bordered={false} bodyStyle={{ padding: '19px'}} className="responsiveCard">
                                                <SubGoalBullet channel={isAllChannels ? {subs: stats['subs'].value, videos: stats['videos'].value, views: stats['views'].value} : channel} />
                                            </Card>
                                        </Col>

                                    </Row>
                                    {/* </div> */}
                                </Col>
                            </Row>
                            <br></br>
                            <Row gutter={16}>
                                <Col span={24}>
                                <HorizontalHighlightedList title="Most Viewed" filter={paramsTop10} />

                                    {/* <HorizontalVideoList title="Most Recent" filter={paramsRecent} />

                                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10} /> */}

                                    {/* <Title style={{ color: 'black' }} level={5}>Last Appearences in other channels // TODO</Title>
                                    <HorizontalVideoList _videos={top10videos} /> */}

                                    {/* <HorizontalVideoList _videos={top10videos} /> */}

                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br></br>
                    <Row gutter={[16, 16]} className="hide-on-small-screen">
                        <Col span={24} xl={24}>
                            <FrequencyCard _channels={isAllChannels ? creator.channels : [channel]} />
                            {/* <CreatorFrequencyCard _channels={isAllChannels ? creator.channels : [channel]}></CreatorFrequencyCard> */}
                        </Col>
                    </Row>
                    <br></br>
                    <Row>
                        <Col span={24}>
                            <HorizontalHighlightedList title="Most Recent" filter={paramsRecent} />
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