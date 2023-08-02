import React, { useState, useEffect } from 'react';
import { Card, List, Tabs, Row, Col, Popover, Image, Typography, Avatar, Divider, Tooltip, Space, Spin } from 'antd';
// import CreatorChannel from './CreatorChannel'
import insertCss from 'insert-css';
import { LikeOutlined, ArrowDownOutlined, ArrowUpOutlined, ClockCircleOutlined, EyeOutlined, CommentOutlined, FilterOutlined } from '@ant-design/icons';

import { getVideosFn } from "../../services/videoApi.ts";
import { getCreatorStatsFn } from "../../services/creatorApi.ts";

import variables from '../../sass/antd.module.scss';
import StatisticsCards from '../creator/StatisticsCards'
import HorizontalVideoList from '../creator/HorizontalVideoList'
import FrequencyCard from '../home/FrequencyCard';
import UploadTimeFrequencyCard from '../home/UploadTimeFrequencyCard';
import useFormatter from '../../hooks/useFormatter';

const { Title, Text } = Typography;


const ChannelOverviewTab = ({ _channel }) => {

    const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayDurationFromSeconds, displayVideoDurationFromSeconds } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [isLast5Loaded, setIsLast5Loaded] = useState(false);

    const [channel, setChannel] = useState(_channel);
    const [mostRecentVideos, setMostRecentVideos] = useState([]);
    const [last5VideosStats, setLast5VideoStats] = useState({ views: [], likes: [], comments: [], duration: [] });

    const [paramsTop10, setParamsTop10] = useState();
    const [paramsRecent, setParamsRecent] = useState();

    const [stats, setStats] = useState({
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    });
    const [channelsStats, setChannelsStats] = useState([{
        channel_id: "",
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    }]);

    // width: 215px;
    insertCss(`
        .tabTitle {
            padding: 0px 0px;
            background-size: cover;    
            background-repeat: no-repeat;
        }
        .circular {
            border-radius: 50%;
        }
        .tabTitleImg {
            width: 88px !important;
            height: 88px !important;
        }

        .popupBanner {
            background-color: #222;
            width: 100%;
            display: grid;
          }
        
          .popupBanner img {
            height: 88px !important;
            object-fit: cover;
          }

          .profile {
            display: flex;
            margin: 20px 100px;
          }
        
          .profilePicture {
            width: 115px;
            height: 115px;
            background-size: cover;    
            background-repeat: no-repeat;
            float:right;
          }
          
          .radius {
            border-radius: 50%;
          }
        
          .name {
            font-size: 30px;
            font-weight: bold;
            margin-bottom: 20px;
            color: `+ variables.sdmnYellow + `;
          }
        
        
          .channel_stats_info {
            align-items: flex-start;
            padding: 0px 10px;
          }
        
          .channel_stats_info h3 {
            color: `+ variables.onSurface + `;
            text-wrap: nowrap;
          }
        
          .channel_stats_info h5 {
            color: `+ variables.onSurface + `;
            text-wrap: nowrap;
            margin-top: -15px !important;
          }
        
          .channel_stats_info p {
            color: `+ variables.onSurface + `;
            text-wrap: nowrap;
            font-size: 13px;
            font-weight: 500;
            margin-top: -2px !important;
            margin-bottom: 0px;
          }
        
          .moreStatsContainer {
            overflow: auto;
            padding: 0 20px;
            justify-items: center;
            background-color: `+ variables.coolerGray6 + `;
            color: `+ variables.onSurface + `;
          }
        
          .moreStatsContainer h5 {
            font-size: 14px;
          }
        
          .moreStatsContainer p {
            font-size: 11px;
          }
        

        @media (max-width: 600px) {
            .tabTitle {
            }

            .tabTitleImg {
                width: 32px !important;
                height: 32px !important;
            }

            .creatorContainer {
                margin: 0 20px;
              }
          
              .banner img {
                height: auto;
              }
          
              .profilePicture {
                width: 64px;
                height: 64px;
                float: left;
              }
          
              .channel_stats_info {
                padding: 0px 20px;
              }
          
              .creatorChannelCard {
                  width: 100%;
                }
              
        }

        @media (max-width: 768px) {
            .hide-on-small-screen {
              display: none;
            }
          }

    `);

    useEffect(() => {
        async function fetchData() {
            setParamsTop10({
                sort: "views%desc",
                channels: [_channel.channel_id]
            });

            let params = new URLSearchParams();
            params.append("channels", [channel.channel_id]);

            let _stats = {};
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
                    _stats = {
                        subs: {
                            title: 'Total Subscribers',
                            value: channel.subs,
                            content: <p>{channel.subs}</p>
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

                    }
                    setStats(_stats);
                })

            let paramsRecent = new URLSearchParams();
            paramsRecent.append("sort", "published_at%desc")
            paramsRecent.append("channels", [_channel.channel_id]);
            setParamsRecent({
                sort: "published_at%desc",
                channels: [_channel.channel_id]
            });
            await getVideosFn(1, 10, paramsRecent)
                .then((result) => {

                    setMostRecentVideos(result.videos);
                    const mostRecentVideosSlice = result.videos.slice(0, 5);
                    const tempViews = [];
                    const tempLikes = [];
                    const tempComments = [];
                    const tempDuration = [];

                    for (const el of mostRecentVideosSlice) {
                        tempViews.push({
                            value: el.views / _stats.views.unparsedAvg,
                            videoValue: intToStringBigNumber(el.views),
                            video: el,
                        });
                        tempLikes.push({
                            value: el.likes / _stats.likes.unparsedAvg,
                            videoValue: intToStringBigNumber(el.likes),
                            video: el,
                        });
                        tempComments.push({
                            value: el.comments / _stats.comments.unparsedAvg,
                            videoValue: intToStringBigNumber(el.comments),
                            video: el,
                        });
                        tempDuration.push({
                            value: el.duration_parsed / _stats.duration.unparsedAvg,
                            videoValue: parseDuration(el.duration),
                            video: el,
                        });
                    }
                    setLast5VideoStats({ views: tempViews, likes: tempLikes, comments: tempComments, duration: tempDuration });
                    setIsLast5Loaded(true);
                });





            setIsLoaded(true);
        }
        fetchData();
    }, [_channel]);

    const ChannelPanel = ({ _channel, stats, last5VideosStats }) => {

        useEffect(() => {
        }, [stats, last5VideosStats]);

        const StatPanel = ({ title, value }) => {
            return (
                <>
                    <Space.Compact direction="vertical" size="small" style={{ width: '80px' }}>
                        <p style={{ marginTop: '10px', marginBottom: '-1px' }}>{title}</p>
                        <Title level={5}>{value}</Title>
                    </Space.Compact>
                </>
            );
        }

        const StatRow = ({ title, icon, stats, last5 }) => {
            return (
                <Space split={<Divider type="vertical" />} size="small">
                    <Tooltip title={title}>
                        <div style={{ width: '15px' }}>
                            {icon}
                        </div>
                    </Tooltip>
                    <StatPanel title="Total" value={stats?.humanized} width="80px"></StatPanel>
                    <StatPanel title="Avg" value={stats?.avg}></StatPanel>
                    {/* TODO change value for most liked, needed to pass the most/least liked videos */}
                    <StatPanel title="Most" value={stats?.most}></StatPanel>
                    <StatPanel title="Least" value={stats?.least}></StatPanel>

                    <Space.Compact direction="vertical">
                        <p style={{ marginTop: '3px', marginBottom: '-1px' }}>Last 5</p>
                        <Last5VideosComponent _stats={last5}></Last5VideosComponent>
                    </Space.Compact>
                </Space>
            );
        }


        const ChannelCreatorsPanel = ({ _creators }) => {
            const [creatorTabs, setCreatorTabs] = useState([]);
            useEffect(() => {
                const creatorsTabs = _creators.map((_creator) => {
                    return {
                        label: <div>
                            <Avatar src={_creator.profile_picture} />
                            <span style={{ marginLeft: '5px' }}>{_creator.name}</span>
                        </div>,
                        key: _creator.id,
                        children: <></>
                    };
                });
                setCreatorTabs(creatorsTabs);
            }, [_creators]);
            return (
                <div style={{ overflowX: 'auto' }}>
                    <div style={{ display: 'inline-flex', flexWrap: 'nowrap', padding: '5px 10px' }}>
                        {_creators.map((creator, index) => (
                            <div key={"channelElem" + index} style={{ marginRight: '10px', width: '160px' }}>

                                <Text><Avatar src={creator.profile_picture} key={"avatar_channel_s" + index} /> {creator.name}</Text>
                            </div>
                        ))}
                    </div>
                </div>

                // <Tabs
                //     defaultActiveKey="1"
                //     size="small"
                //     items={creatorTabs}
                // />
            );
        }

        const bannerUrl = _channel.banner_url + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

        return (
            <>
                {isLoaded ?
                    <>
                        <Card
                            bordered={false}
                            className="creatorChannelCard"
                            bodyStyle={{ padding: 0 }}
                            cover={
                                <Image alt={_channel.title}
                                    // style={{ maxHeight: '100%', objectFit: 'cover' }} borderRadius: '5px'
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    src={bannerUrl}
                                    preview={false}
                                    fallback="data:image/png;base64,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"
                                />}>

                            <div className="channelContainer">
                                <Row className="profile" gutter={16} justify="center">
                                    <Col span={4}>
                                        <div className="profilePicture">
                                            <Image className="radius" src={_channel.logo_url} preview={false} />
                                        </div>
                                    </Col>
                                    <Col span={20}>
                                        <div className="channel_stats_info">
                                            <Title level={3}>{_channel.title}</Title>
                                            <Title level={5}>{_channel.custom_url}</Title>
                                            <Space>
                                                <p>{intToStringBigNumber(_channel.subs)} subs</p>
                                                <p>{intToStringBigNumber(_channel.videos)} videos</p>
                                                <p>{intToStringBigNumber(_channel.views)} views</p>
                                            </Space>
                                            <p>Created at {parseDate(_channel?.channel_created_at)}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                            <div className="channelCreatorsContainer">
                                <Row gutter={16} justify="center">
                                    <Col span={24}>
                                        {_channel.creators?.length > 0 ?
                                            (<ChannelCreatorsPanel _creators={_channel.creators} />) : (<Text>No creators associated</Text>)
                                        }
                                    </Col>
                                </Row>
                            </div>
                            <div className="moreStatsContainer">
                                <StatRow title="Views" icon={<EyeOutlined />}
                                    stats={stats?.views} last5={last5VideosStats.views}></StatRow>
                                <Divider style={{ margin: '2px 0px' }} />

                                <StatRow title="Likes" icon={<LikeOutlined />}
                                    stats={stats?.likes} last5={last5VideosStats.likes}></StatRow>
                                <Divider style={{ margin: '2px 0px' }} />

                                <StatRow title="Comments" icon={<CommentOutlined />}
                                    stats={stats?.comments} last5={last5VideosStats.comments}></StatRow>
                                <Divider style={{ margin: '2px 0px' }} />

                                <StatRow title="Duration" icon={<ClockCircleOutlined />}
                                    stats={stats?.duration} last5={last5VideosStats.duration}></StatRow>

                            </div>
                        </Card>
                    </>
                    :
                    <Spin />
                }
            </>
        );
    };

    const Last5VideosComponent = ({ _stats }) => {
        const [stats, setStats] = useState(_stats);
        useEffect(() => {
        }, [_stats]);

        const getColor = (value) => {
            if (value < 0.9) return '#ff4d4f';
            if (value > 0.9 && value < 1) return;
            if (value >= 1) return '#52c41a';
        }

        const getIcon = (value) => {
            if (value < 0.9) return <ArrowDownOutlined />;
            if (value > 0.9 && value < 1) return;
            if (value >= 1) return <ArrowUpOutlined />;
        }

        // TODO implement this -> videoPreview?
        const content = (index) => (
            <Space>
                <Image src={stats[index]?.video.url} width='100%' height='150px' preview={false}></Image>
                <p>{stats[index]?.videoValue}</p>
                <p>{parseDate(stats[index]?.video.published_at)}</p>
            </Space>
        );


        return (
            <>
                {isLast5Loaded ?
                    <>
                        <Space gutter={2}>
                            <Popover content={content(4)} placement="top">
                                <Avatar icon={getIcon(stats[4]?.value)} style={{ backgroundColor: getColor(stats[4]?.value) }} shape="square" size="small" />
                            </Popover>
                            <Popover content={content(3)} placement="top">
                                <Avatar icon={getIcon(stats[3]?.value)} style={{ backgroundColor: getColor(stats[3]?.value) }} shape="square" size="small" />
                            </Popover>
                            <Popover content={content(2)} placement="top">
                                <Avatar icon={getIcon(stats[2]?.value)} style={{ backgroundColor: getColor(stats[2]?.value) }} shape="square" size="small" />
                            </Popover>
                            <Popover content={content(1)} placement="top">
                                <Avatar icon={getIcon(stats[1]?.value)} style={{ backgroundColor: getColor(stats[1]?.value) }} shape="square" size="small" />
                            </Popover>
                            <Popover content={content(0)} placement="top">
                                <Avatar icon={getIcon(stats[0]?.value)} style={{ backgroundColor: getColor(stats[0]?.value) }} shape="square" size="small" />
                            </Popover>
                        </Space>
                    </>
                    :
                    <Spin />
                }
            </>
        );
    }


    return (
        <>
            {isLoaded ?
                <>
                    <div style={{ width: '100%' }}>
                        <Row gutter={[8, 4]} wrap={false} style={{ overflow: 'auto', whiteSpace: 'nowrap' }}>
                            <StatisticsCards stats={stats} />

                        </Row>
                    </div>
                    <br></br>
                    <Row gutter={[16, 16]}>
                        <Col span={24} xl={12}>
                            <Title style={{ color: 'black' }} level={5}>Channel Stats</Title>
                            <ChannelPanel _channel={channel} last5VideosStats={last5VideosStats} stats={stats} />
                            {/* <CreatorStatsPanel creator={creator} channel={channel} stats={stats} channelsStats={channelsStats} mostRecentVideos={mostRecentVideos} isAllChannels={isAllChannels}></CreatorStatsPanel> */}
                        </Col>
                        <Col span={24} xl={12}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <HorizontalVideoList title="Most Recent" filter={paramsRecent} />

                                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <br></br>
                    <Row gutter={[16, 16]} className="hide-on-small-screen">
                        <Col span={24} xl={24}>
                            <FrequencyCard _channels={[channel]}></FrequencyCard>
                        </Col>
                    </Row>
                    <br></br>

                    <Row gutter={[16, 16]}>
                        <Col span={24} xl={12}>
                            <Row gutter={16}>
                                <Col span={24}>
                                    <HorizontalVideoList title="Most Recent" filter={paramsRecent} />

                                    <HorizontalVideoList title="Most Viewed" filter={paramsTop10} />
                                </Col>
                            </Row>
                        </Col>
                        <Col span={24} xl={12}>
                            <UploadTimeFrequencyCard _channels={[channel]}></UploadTimeFrequencyCard>
                        </Col>
                    </Row>
                    <br></br>
                </>
                :
                <Spin />
            }
        </>
    );
}

export default ChannelOverviewTab;