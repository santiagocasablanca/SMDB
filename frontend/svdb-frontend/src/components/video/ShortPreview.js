import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Divider, Image, Space, Spin, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
// import VideoDrawer from './VideoDrawer';

const { Title, Text } = Typography;

const VideoPreview = ({ _video }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    // const [isLoaded, setIsLoaded] = useState(false);
    // const [video, setVideo] = useState(_video);
    // const [channel, setChannel] = useState();
    // const [logo, setLogo] = useState();


    const isLoaded = useMemo(() => _video !== undefined, [_video]);
    const channel = useMemo(() => _video?.channel, [_video]);
    const logo = useMemo(() => _video?.channel.logo_url, [_video]);
    const formattedDate = useMemo(() => parseDate(_video.published_at, "DD MMM YYYY"), [_video]);


    const [open, setOpen] = useState(false);

    const showDrawer = () => {
        setOpen(true);
    };

    const childToParent = (childdata) => {
        setOpen(childdata);
    }

    const goToChannel = () => {
        const url = '/channel/' + _video.channel_id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: _video.channel_id } });
    }

    const handleClickVideo = (id) => {
        console.log(id);
        const url = '/video/' + id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: id } });
    }

    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                <Card
                    style={{ width: '250px', fontSize: '12px', backgroundColor: 'transparent', border: 'none' }}
                    // bordered={false}

                    bodyStyle={{ padding: 0, cursor: 'pointer', backgroundColor: 'transparent' }}>
                    <div style={{ width: '250px', display: 'flex', justifyContent: 'space-between', color: 'black', marginBottom: '5px', alignItems: 'baseline' }}>
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
                            <Text style={{ color: 'black', cursor: 'pointer' }} strong onClick={goToChannel}>{_video.channel.title}</Text>
                        </div>
                        <p style={{ color: 'black', fontSize: '10px', float: 'right', cursor: 'default' }}>{formattedDate}</p>
                    </div>

                    <div onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                        e.currentTarget.style.borderRadius = '8px';
                    }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'inherit';
                            e.currentTarget.style.borderRadius = 'inherit';
                            // e.currentTarget.style.margin = 'inherit';
                        }}
                        onClick={() => handleClickVideo(_video.video_id)}>


                        <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={_video.url} width='250px' height='465px' preview={false} />

                        <Title level={5}
                            style={{ color: 'black', width: '230px', margin: '0px 5px', marginTop: '10px', textOverflow: 'ellipsis' }}
                            ellipsis={{ tooltip: _video.title }}>{_video.title}</Title>
                        <div style={{float: 'right'}}>
                            <Space split={<Divider type="vertical" />} size="small" style={{ marginRight: '5px' }}>

                                <p style={{ color: 'black', fontSize: '12px' }}><EyeOutlined /> {intToStringBigNumber(_video.views)}</p>
                                <p style={{ color: 'black', fontSize: '12px' }}><LikeOutlined /> {intToStringBigNumber(_video.likes)}</p>
                                <p style={{ color: 'black', fontSize: '12px' }}><CommentOutlined /> {intToStringBigNumber(_video.comments)}</p>

                            </Space>
                        </div>
                    </div>

                </Card>
            </>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default VideoPreview;