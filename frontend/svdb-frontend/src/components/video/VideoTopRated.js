import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Divider, Typography, Space, Spin, Rate, Popover } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import useFormatter from '../../hooks/useFormatter';
import insertCss from 'insert-css';
import { useNavigate } from 'react-router-dom';


const { Title, Text } = Typography;

const VideoTopRated = ({ _channels }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState();
    const [channelsStats, setChannelsStats] = useState([{
        channel_id: "",
        subs: {}, views: {}, videos: {}, likes: {}, comments: {}, avg: {}, duration: {}
    }]);

    useEffect(() => {

        async function fetchData() {

            let params = new URLSearchParams();
            params.append("channels", [channel.channel_id]);

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
                });

            let _params = new URLSearchParams();
            _params.append("excludeShorts", true);
            _params.append("onlyShorts", false);
            _params.append("channels", _channels)
            _params.append("sort", "views%desc")


            await getVideosFn(1, 50, _params)
                .then((result) => {
                    setVideos(result.videos);
                    setIsLoaded(true);
                });

        }
        fetchData();

    }, [_channels]);



    insertCss(`
    
   .ant-rate-star .ant-rate-star-full > span {
        color: #d8bd14 !important;
    }
    .topRatedVideos {
        width:100%;
        height: 500px;
        overflow-y: auto;
    }
    `);


    // Calculate the rating for a video based on KPIs
    const calculateVideoRating = (video) => {

    };


    const formula = (
        <>
            <Title level={5}>Formula</Title>
            <Text>(Video #Views / </Text>
        </>
    );

    const VideoCard = ({ video }) => {
        const channel = useMemo(() => video?.channel, [video]);
        const logo = useMemo(() => video?.channel.logo_url, [video]);
        const formattedDate = useMemo(() => parseDate(video?.published_at, "DD MMM YYYY"), [video]);

        const [open, setOpen] = useState(false);
        const isLoaded = useMemo(() => _video !== undefined, [_video]);


        const showDrawer = () => {
            setOpen(true);
        };

        const childToParent = (childdata) => {
            setOpen(childdata);
        }

        const goToChannel = () => {
            const url = '/channel/' + video.channel_id;
            // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
            navigate(url, { state: { id: video.channel_id } });
        }

        return (
            <> {isLoaded ?
                (<>
                    <Card
                        style={{ width: '336px', fontSize: '12px' }}
                        onClick={showDrawer}
                        cover={
                            <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='336px' height='189px' preview={false} />
                        }
                        hoverable
                        title={video.title}
                        headStyle={{ marginLeft: 40, minHeight: '45px', fontSize: '15px', padding: 0 }}
                        bodyStyle={{ padding: 5, cursor: 'pointer' }}>


                        {/* <p style={{ color: 'red', fontSize: '12px', margin: '0px 5px' }}>{video.title}</p> */}
                        <div style={{ top: '45px', position: 'absolute', borderRadius: '8px', right: '5px', padding: 2, height: '24px', background: 'radial-gradient(black, transparent)' }}>
                            <Space split={<Divider type="vertical" />} size="small">
                                <p style={{ color: 'white', fontSize: '12px' }}><EyeOutlined /> {intToStringBigNumber(video.views)}</p>
                                <p style={{ color: 'white', fontSize: '12px' }}><LikeOutlined /> {intToStringBigNumber(video.likes)}</p>

                            </Space>
                        </div>
                        <Avatar src={logo} onClick={goToChannel} style={{
                            backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px'
                        }} />
                        <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{parseDate(video.published_at, "DD MMM YYYY")}</p>

                    </Card>
                    <VideoDrawer _video={video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer>
                </>
                ) : (
                    <Spin />
                )
            }
            </>
        );
    };

    // 480 x 270
    return (
        <>
            <div className="topRatedVideos">
                {isLoaded ?
                    (
                        <List
                            grid={{
                                gutter: 10,
                                column: 10,
                            }}
                            className="scrollmenu"
                            itemLayout="horizontal"
                            dataSource={videos}
                            renderItem={(item) => (
                                <List.Item>
                                    <VideoCard video={item} />
                                </List.Item>
                            )}
                        />
                    ) : (
                        <Spin />
                    )
                }
            </div>
        </>
    );
}
export default VideoTopRated;