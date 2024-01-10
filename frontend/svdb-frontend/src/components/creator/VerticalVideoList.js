import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Card, Divider, Image, List, Popover, Space, Spin, Tag, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import useFormatter from '../../hooks/useFormatter';
import VideoDrawer from '../video/VideoDrawer';




const { Title, Text } = Typography;

const VerticalVideoList = ({ _videos }) => {

    const [isLoaded, setIsLoaded] = useState(false);
    const [videos, setVideos] = useState(_videos);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const VerticalVideoPreview = ({ _video }) => {
        const ref = React.useRef(null);

        const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
        const [isLoaded, setIsLoaded] = useState(false);
        const [video, setVideo] = useState(_video);
        const [open, setOpen] = useState(false);

        const showDrawer = () => {
            setOpen(true);
        };

        const childToParent = (childdata) => {
            setOpen(childdata);
        }

        useEffect(() => {
            ref.current = document.getElementById('creatorChannelStatsTable');
            // console.log("height", ref.current.clientHeight);

            setIsLoaded(true);
        }, []);


        return (
            <> {isLoaded ?
                (<>

                    <Card
                        style={{ borderRadius: '8px', width: '100%', fontSize: '12px', border: '0px' }}
                        onClick={showDrawer}
                        bodyStyle={{ borderRadius: '8px', padding: 0, backgroundColor: '#5F6980' }}>
                        <Popover content={video.title} placement="top" onClick={showDrawer}>

                            <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={video.url} width='100%' height='200px' preview={false} />
                            <Title level={5} style={{ color: 'white', fontSize: '15px', margin: '5px 10px' }}>{video.title}
                                <Divider type="vertical" />
                                <Text type="secondary">{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                                <Divider type="vertical" />

                                {/* TODO change color if > avgs   style={{ paddingBottom: '5px' }} */}
                                <Space>
                                    <Tag color="black" icon={<EyeOutlined />}>{intToStringBigNumber(video.views)}</Tag>
                                    <Tag color="black" icon={<LikeOutlined />}>{intToStringBigNumber(video.likes)}</Tag>
                                    <Tag color="black" icon={<CommentOutlined />}>{intToStringBigNumber(video.comments)}</Tag>
                                </Space>
                            </Title>

                        </Popover>
                    </Card>
                    <VideoDrawer _video={video} _open={open} childToParent={childToParent}></VideoDrawer>
                </>
                ) : (
                    <Spin />
                )
            }
            </>
        );
    }

    return (
        <> {isLoaded ?
            (
                <div style={{ height: '680px', overflow: 'auto' }}>

                    <List
                        grid={{
                            gutter: 2,
                            column: 1,
                        }}
                        itemLayout="vertical"
                        dataSource={videos}
                        renderItem={(item) => (
                            <List.Item>
                                <VerticalVideoPreview _video={item}></VerticalVideoPreview>
                            </List.Item>
                        )}
                    />
                </div>

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default VerticalVideoList;