import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Divider, Image, Space, Spin, Typography } from 'antd';
import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
// import VideoDrawer from './VideoDrawer';


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

    // useEffect(() => {
    //     async function fetchData() {
    //         setVideo(_video);
    //         setChannel(_video?.channel);
    //         setLogo(_video?.channel.logo_url);
    //         setIsLoaded(true);
    //         // await getVideoFn(_video.video_id).then(res => {
    //         //     if (res.result) {
    //         //         setLogo(res.result.channel.logo_url);
    //         //         setChannel(res.result.channel);
    //         //         setIsLoaded(true);
    //         //         setVideo(res.result);
    //         //     }
    //         // })
    //     }
    //     fetchData();
    // }, [_video]);
    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                <Card
                    style={{ width: '216px', fontSize: '12px' }}
                    onClick={() => handleClickVideo(_video.video_id)}
                    bodyStyle={{ padding: 0, cursor: 'pointer' }}>
                    {/* <Popover content={video.title} placement="top" onClick={showDrawer}> */}

                        <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={_video.url} width='215px' height='383px' preview={false} />
                        <p style={{ color: 'white', fontSize: '10px', margin: '0px 5px' }}>{_video.title}</p>
                        <div>
                            <Space split={<Divider type="vertical" />} size="small" style={{ marginLeft: '5px' }}>
                                
                                <p style={{ color: 'white', fontSize: '10px' }}><EyeOutlined /> {intToStringBigNumber(_video.views)}</p>
                                <p style={{ color: 'white', fontSize: '10px' }}><LikeOutlined /> {intToStringBigNumber(_video.likes)}</p>
                                <p style={{ color: 'white', fontSize: '10px' }}><CommentOutlined /> {intToStringBigNumber(_video.comments)}</p>

                            </Space>
                        </div>
                        <Avatar src={logo} onClick={goToChannel} style={{
                            backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px'
                        }} />
                        <p style={{ color: 'white', fontSize: '10px', top: '0px', position: 'absolute', right: '5px' }}>{formattedDate}</p>
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

export default VideoPreview;