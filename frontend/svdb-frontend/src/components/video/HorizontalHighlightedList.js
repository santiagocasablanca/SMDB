import { EyeOutlined, LikeOutlined, LineChartOutlined, UsergroupAddOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Image, List, Row, Space, Spin, Tooltip, Typography, Popover, Skeleton } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
// import VideoDrawer from './VideoDrawer';
import VideoRate from './VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideoDurationOverlay from './VideoDurationOverlay';
import VideoOnHoverPreview from './VideoOnHoverPreview';



const { Title, Text, Link } = Typography;



const HorizontalHighlightedList = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState();



    useEffect(() => {

        async function fetchData() {
            let _params = new URLSearchParams();
            _params.append("excludeShorts", true);
            _params.append("onlyShorts", false);
            for (const property in filter) {
                if (filter[property] && filter[property] != '' && filter[property].length >= 0)
                    _params.append(property, filter[property]);
            }

            await getVideosFn(1, 10, _params)
                .then((result) => {
                    setVideos(result.videos);
                    setIsLoaded(true);
                })
        }
        fetchData();

    }, [filter]);

    const handleClick = () => {
        const url = '/videography';
        navigate(url, { state: { filter }, replace: true, preventScrollReset: true });
    }
    insertCss(`
    .rating span {
        color: black;
    }

    .ant-skeleton .ant-skeleton-element .ant-skeleton-image {
        width: 316px !important;
        height: 189px !important;
    }

    /* Basic list item styles */
.list-item {
  position: relative;
  overflow: hidden;
}

/* Styling for the div inside the list item */
.list-item:hover .hover-div {
  transform: translateX(100%);
  transition: transform 0.3s ease; /* You can adjust the duration and timing function */
}

/* Additional styling for the hover-div */
.hover-div {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #3498db;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: translateX(-100%);
  transition: transform 0.3s ease; /* You can adjust the duration and timing function */
}
    `);

    const VideoCard = ({ video }) => {
        const [channel, setChannel] = useState(video?.channel);
        const [logo, setLogo] = useState(video?.channel?.logo_url);
        const [isHovered, setIsHovered] = useState(false);


        useEffect(() => {
            setChannel(video?.channel);
            setLogo(video?.channel?.logo_url);
        }, [video]);

        const goToChannel = () => {
            const url = '/channel/' + video.channel_id;
            // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
            navigate(url, { state: { id: video.channel_id } });
        }

        const handleClickVideo = (id) => {
            // console.log(id);
            const url = '/video/' + id;
            // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
            navigate(url, { state: { id: id } });
        }

        const toggleHover = (state) => {
            setIsHovered(state);
        }

        return (
            <> {isLoaded ?
                (<>
                    <div style={{ marginRight: '10px' }}>
                        <div style={{ padding: '5px' }}>
                            <div style={{ width: '310px', display: 'flex', justifyContent: 'space-between', color: 'black', marginBottom: '5px', alignItems: 'baseline' }}>
                                <div onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                                    e.currentTarget.style.borderRadius = '8px';
                                }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'inherit';
                                        e.currentTarget.style.borderRadius = 'inherit';
                                    }}>
                                    <Avatar src={logo} onClick={goToChannel} style={{
                                        backgroundColor: '#f56a00', marginRight: '5px', cursor: 'pointer'
                                    }} />
                                    <Text style={{ color: 'black', cursor: 'pointer' }} strong onClick={goToChannel}>{video.channel.title}</Text>
                                </div>
                                <Tooltip title={parseDate(video?.published_at, "DD MMM YYYY HH:MM")}>
                                    <span style={{ color: 'black', fontSize: '10px', float: 'right' }}> {parseDateToFromNow(video?.published_at)}</span>
                                </Tooltip>
                                {/* <p style={{ color: 'black', fontSize: '10px', float: 'right' }}>{parseDate(video.published_at, "DD MMM YYYY")}</p> */}
                            </div>
                            <div onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                                e.currentTarget.style.borderRadius = '8px';
                            }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = 'inherit';
                                    e.currentTarget.style.borderRadius = 'inherit';
                                    // e.currentTarget.style.margin = 'inherit';
                                }}>

                                <div style={{ position: 'relative', cursor: 'pointer' }}
                                    onMouseEnter={() => toggleHover(true)} onMouseLeave={() => toggleHover(false)}>
                                    {
                                        !isHovered ? <>
                                            <Image onClick={() => handleClickVideo(video.video_id)} style={{ borderRadius: '8px', objectFit: 'cover', cursor: 'pointer' }}
                                                src={video.url} width='316px' height='189px' preview={false} />

                                            <div style={{ position: 'absolute', bottom: '5px', right: '5px' }}>
                                                <VideoDurationOverlay duration={video.duration} />
                                            </div>
                                        </> : <VideoOnHoverPreview video={video}></VideoOnHoverPreview>
                                    }
                                </div>
                                <Title style={{ color: 'black', width: '310px', marginTop: '10px', marginBottom: '10px', cursor: 'pointer' }}
                                    ellipsis={{ tooltip: video.title }}
                                    onClick={() => handleClickVideo(video.video_id)}
                                    level={5}>{video.title}</Title>

                                <div style={{ float: 'right', color: 'black' }}>
                                    <Space className="rating" split={<Divider type="vertical" style={{ background: 'black' }} />} size="small">

                                        <p style={{ fontSize: '13px' }}><EyeOutlined /> {intToStringBigNumber(video.views)}</p>
                                        <p style={{ fontSize: '13px' }}><LikeOutlined /> {intToStringBigNumber(video.likes)}</p>
                                        <p style={{ fontSize: '13px' }}><Popover title={video.title} content={<VideoGrowthLine _video={video} />}>
                                            <LineChartOutlined style={{ cursor: 'pointer' }} />
                                        </Popover></p>
                                        <VideoRate _video={video} color="black" />
                                    </Space>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
                ) : (
                    <Spin />
                )
            }
            </>
        );
    };


    return (
        <>
            <Row><Col span={18}><Title style={{ color: 'black', marginBottom: '25px' }} level={4}>{title}</Title></Col>
                <Col span={6}>
                    <div style={{ float: 'right' }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 80%)';
                            e.currentTarget.style.borderRadius = '8px';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'inherit';
                            e.currentTarget.style.borderRadius = 'inherit';
                        }}>
                        <Button onClick={() => handleClick()} type="link">See all</Button></div></Col></Row>

            <div className="scrollmenu" style={{ height: '315px' }}>
                {isLoaded ?
                    (
                        <>

                            {videos.map((video, index) => {
                                return <VideoCard key={index} video={video} />;
                            })}
                        </>
                    ) : (
                        // <Spin />
                        Array.from({ length: 10 }).map((_, i) => {
                            return (
                                <div key={i}
                                    style={{ marginRight: '10px', width: '318px' }}>
                                    {/* <div style={{width: '310px', display: 'flex', justifyContent: 'space-between', color: 'black', marginBottom: '5px', alignItems: 'baseline'}}> */}
                                    <Space style={{ marginBottom: '5px' }}>
                                        <Skeleton.Avatar active size="default" shape="circle" />
                                        <Skeleton.Input active size="default" style={{ width: '200px', marginLeft: '5px', marginRight: '15px' }} />
                                        <Skeleton.Button active size="small" />
                                        {/* <Skeleton.Input active size="default" style={{width: '20px'}} /> */}
                                    </Space>
                                    <br></br>
                                    <Skeleton.Image active />
                                    <br></br>
                                    <Space style={{ marginTop: '10px' }}>
                                        {/* <Skeleton.Avatar active size="default" shape="circle" /> */}
                                        <Skeleton.Input active size="default" style={{ width: '316px' }} />
                                    </Space>
                                    {/* </div> */}
                                </div>);
                        })
                    )
                }

            </div>
        </>


    );
}

export default HorizontalHighlightedList;