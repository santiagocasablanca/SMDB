import { CommentOutlined, EyeOutlined, LikeOutlined, LineChartOutlined } from '@ant-design/icons';
import { Avatar, Card, Divider, Image, Space, Spin, Popover } from 'antd';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
// import VideoDrawer from './VideoDrawer';
import VideoRate from './VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';

const VideoPreview = ({ _video }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const channel = useMemo(() => _video?.channel, [_video]);
    const logo = useMemo(() => _video?.channel.logo_url, [_video]);
    const formattedDate = useMemo(() => parseDate(_video?.published_at, "DD MMM YYYY"), [_video]);
    const [open, setOpen] = useState(false);
    const isLoaded = useMemo(() => _video !== undefined, [_video]);

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
        const url = '/video/' + id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: id } });
      }

    // 480 x 270  top: '0px', position: 'absolute', right: '5px'
    return (
        <> {isLoaded ?
            (<>
                <Card
                    style={{ width: '220px', fontSize: '12px' }}
                    onClick={() => handleClickVideo(_video.video_id)}
                    bodyStyle={{ padding: 0, cursor: 'pointer' }}>

                    <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={_video.url} width='218px' height='168px' preview={false} />
                    <p style={{ color: 'white', fontSize: '10px', margin: '0px 5px' }}>{_video.title}</p>
                    <div style={{ color: 'white', fontSize: '10px', top: '3px', position: 'absolute', right: '5px' }}>
                        <Space>
                            <p style={{ color: 'white', fontSize: '10px' }}>{formattedDate}</p>
                            <Divider type="vertical" />
                            <VideoRate _video={_video} />
                        </Space>
                    </div>
                    <div>
                        <Space split={<Divider type="vertical" />} size="small" style={{ marginLeft: '5px', marginRight: '5px' }}>
                            <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(_video.views)}</p>
                            <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(_video.likes)}</p>
                            <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(_video.comments)}</p>
                            <p style={{ color: 'white', fontSize: '10px' }}><Popover title="Views Growth" content={<VideoGrowthLine _video={_video} />}>
                                <LineChartOutlined />
                            </Popover></p>
                        </Space>
                    </div>
                    <Avatar src={logo} onClick={goToChannel} style={{
                        backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px'
                    }} />
                    {/* </Popover> */}
                </Card>
                {/* <VideoDrawer _video={_video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer> */}
            </>
            ) : (
                <Spin />
            )
        }
        </>
    );
}
// style={{ width: '600px' }}

export default VideoPreview;