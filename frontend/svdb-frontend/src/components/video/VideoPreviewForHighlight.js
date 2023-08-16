import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Col, Divider, Image, List, Popover, Row, Space, Spin, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useMemo, useState } from 'react';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import VideoDrawer from './VideoDrawer';
// import VideoRate from './VideoRate';

const { Title, Text } = Typography;

const VideoPreviewForHighlight = ({ _video, index }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

    const isLoaded = useMemo(() => _video !== undefined, [_video]);
    const channel = useMemo(() => _video?.channel, [_video]);
    const logo = useMemo(() => _video?.channel.logo_url, [_video]);
    const directedBy = useMemo(() => _video?.directedBy, [_video]);
    const formattedDate = useMemo(() => parseDate(_video?.published_at, "DD MMM YYYY"), [_video]);

    const [open, setOpen] = useState(false);


    // useEffect(() => {

    //     async function fetchData() {
    //         setVideo(_video);
    //                 setLogo(_video?.channel.logo_url);
    //                 setDirectedBy(_video?.directedBy);
    //                 setChannel(_video?.channel);
    //                 setIsLoaded(true);
    //         // await getVideoFn(_video.video_id).then(res => {
    //         //     if (res.result) {
    //         //         setVideo(res.result);
    //         //         setLogo(res.result.channel.logo_url);
    //         //         setDirectedBy(res.result.directedBy);
    //         //         setChannel(res.result.channel);
    //         //         setIsLoaded(true);
    //         //     }
    //         // })
    //     }
    //     fetchData();
    // }, [_video]);

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


    insertCss(`

    .videoPreviewForHighlight:hover {
        cursor: pointer;
      }
       
        .videoPreviewForHighlight h5, p {
            color: black;
        }
        .videoPreviewForHighlight span {
            color: black;
        }
    `);

    const castContent = ({ creators }) => {
        return (
            <List

                header={<Text strong>Cast</Text>}
                size="small"
                itemLayout="vertical"
                dataSource={creators}
                renderItem={(creator, index) => (
                    <List.Item key={creator.id}>
                        <List.Item.Meta
                            avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                            title={creator.name}
                            description={creator.video_creator.role}
                        />
                    </List.Item>
                )} >
            </List>
        )
    };


    // 480 x 270
    return (
        <> {isLoaded ?
            (<>
                {/* <Popover content={video.title} placement="top" onClick={showDrawer}> */}
                <div className="videoPreviewForHighlight">
                    <Row>
                        <Col span={24}>
                            <div style={{ borderRadius: '8px', height: '270px' }}>
                                <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={_video.url} width='100%' height="100%" preview={false} onClick={() => showDrawer()} />
                            </div>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col span={18}>
                            <Title level={5} ellipsis={true}>{_video.title}</Title>
                        </Col>
                        <Col span={6}>
                            <Text style={{ float: 'right' }}>{formattedDate}</Text>
                        </Col>
                    </Row>
                    <Row>
                        <Col span={20}>
                            <Space onClick={goToChannel}>
                                <Avatar src={logo} style={{
                                    backgroundColor: '#f56a00',
                                }} />
                                {/* <Image src={video.channel?.logo_url}></Image> */}
                                <Text>{_video.channel_title}</Text>
                            </Space>
                        </Col>
                        <Col span={4}>
                            <Space size="small" style={{ float: 'right' }}>
                                <EyeOutlined />{intToStringBigNumber(_video.views)}
                                <LikeOutlined />{intToStringBigNumber(_video.likes)}
                                <CommentOutlined />{intToStringBigNumber(_video.comments)}
                            </Space>
                        </Col>
                    </Row>
                    {/* <Row>
                        <Col span={24}>
                            <Space style={{ float: 'right' }}><VideoRate _video={_video}></VideoRate></Space>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col span={24}>
                            <Space style={{ float: 'right' }}>
                                {
                                    (directedBy.length > 0) ? (<>
                                        <Text strong>Directed by</Text>
                                        <Avatar.Group maxCount={2} maxStyle={{ color: '#000000', backgroundColor: '#FFFFFF' }}>
                                            {directedBy?.map(director => {
                                                return (<Avatar key={"director" + director.id} size="small" src={director.profile_picture} />);
                                            })}
                                        </Avatar.Group>

                                    </>) : ('')
                                }
                                {
                                    _video?.cast.length > 0 ? (
                                        <>
                                            <Divider></Divider>
                                            <Text strong>Cast</Text>
                                            <Popover placement="bottom" title="Cast" content={castContent(_video.cast)} trigger="click">

                                                <Avatar.Group maxCount={5} maxStyle={{ color: '#000000', backgroundColor: variables.primary }}>
                                                    {_video.cast.map(cast_creator => {
                                                        return (<Avatar key={"cast_" + cast_creator.id} size="small" src={cast_creator.profile_picture} />);
                                                    })}
                                                </Avatar.Group>
                                            </Popover>
                                        </>) : ('')
                                }
                            </Space>
                        </Col>
                    </Row>

                </div>


                {/* </Popover> */}
                <VideoDrawer _video={_video} _channel={channel} _open={open} childToParent={childToParent}></VideoDrawer>
            </>
            ) : (
                <Spin />
                // <Skeleton />
            )
        }
        </>
    );
}

export default VideoPreviewForHighlight;