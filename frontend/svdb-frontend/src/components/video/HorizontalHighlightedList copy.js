import { EyeOutlined, LikeOutlined, LineChartOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Divider, Image, List, Row, Space, Spin, Typography, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getVideosFn } from "../../services/videoApi.ts";
// import VideoDrawer from './VideoDrawer';
import VideoRate from './VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';



const { Title, Text } = Typography;



const HorizontalHighlightedList = ({ title, filter }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
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
        navigate(url, { state: { filter } });
    }
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

    const VideoCard = ({ video }) => {
        const [channel, setChannel] = useState(video?.channel);
        const [logo, setLogo] = useState(video?.channel?.logo_url);
        const [open, setOpen] = useState(false);

        const showDrawer = () => {
            setOpen(true);
        };

        const childToParent = (childdata) => {
            setOpen(childdata);
        }


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
            console.log(id);
            const url = '/video/' + id;
            // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
            navigate(url, { state: { id: id } });
          }

        return (
            <> {isLoaded ?
                (<>
                    <Card
                        style={{ width: '336px', fontSize: '12px' }}
                        onClick={() => handleClickVideo(video.video_id)}
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
                                <p style={{ color: 'white', fontSize: '12px' }}><Popover title={video.title} content={<VideoGrowthLine _video={video} />}>
                                    <LineChartOutlined />
                                </Popover></p>
                                {/* <Divider type="vertical" /> */}
                                <VideoRate _video={video} />
                            </Space>
                        </div>
                        <Avatar src={logo} onClick={goToChannel} style={{
                            backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px'
                        }} />
                        <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{parseDate(video.published_at, "DD MMM YYYY")}</p>

                    </Card>
                    {/* <VideoDrawer _video={video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer> */}
                </>
                ) : (
                    <Spin />
                )
            }
            </>
        );
    };

  

    return (
        <> {isLoaded ?
            (
                <>
                    <Row><Col span={18}><Title style={{ color: 'black' }} level={5}>{title}</Title></Col> <Col span={6}><Button onClick={() => handleClick()} style={{ float: 'right' }} type="link">See all</Button></Col></Row>
                    <List
                        grid={{
                            gutter: 10,
                            column: videos?.lenght,
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
                </>

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default HorizontalHighlightedList;