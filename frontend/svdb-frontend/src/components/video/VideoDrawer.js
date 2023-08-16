import { CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Col, Drawer, List, Row, Space, Tag, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import ReactPlayer from 'react-player';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import UpdateVideoModal from './UpdateVideoModal';
// import VideoRate from './VideoRate';

const { Text } = Typography;

const VideoDrawer = ({ _video, _channel, _open, childToParent }) => {
    const navigate = useNavigate();
    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [video, setVideo] = useState(_video);
    const [channel, setChannel] = useState(_channel);
    const [open, setOpen] = useState(_open);

    useEffect(() => {
        // console.log(_channel);
        setVideo(_video);
        setChannel(_channel);
        setOpen(_open);
        // console.log('video drawer')
    }, [_video, _open]);


    const onClose = () => {
        // console.log('video drawer on close')

        childToParent(false);
        setOpen(false);
    };

    const goToCreator = (id) => {
        console.log('heere: ', id);
        const url = '/creator/' + id;
        // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
        navigate(url, { state: { id: id } });
    }

    const title = (
        <>
            {video.title}
        </>
    );

    insertCss(`
       
        .videoDrawerContainer {
            padding: 0 80px 0 80px;
        }
        
        .videoContainer {
            height: 550px;
        }

        .showPointer:hover {
            cursor: pointer;
        }

        @media (max-width: 1480px) {
            .videoDrawerContainer {
                padding: 0 10px 0 10px;
            }
            .videoContainer {
                height: 450px;
            }
        }

        @media (max-width: 900px) {
            .videoDrawerContainer {
                padding: 0 10px 0 10px;
            }
            .videoContainer {
                height: 400px;
            }
        }

        @media (max-width: 600px) {
            .videoContainer {
                height: 240px;
            }
        }
    `);

    const getLabelFromValue = (desiredValue) => {
        const foundElement = video?.cast.find((item) => item.id === desiredValue);
        if (foundElement) {
            return foundElement.name;
        } else {
            return null;
        }
    }


    return (
        <> {
            open ? (
                <Drawer title={title}
                    placement="bottom"
                    width={500}
                    height="95%"
                    onClose={onClose}
                    open={open}
                    extra={
                        <Space>
                            <Text>{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                            <UpdateVideoModal video={video} />
                            {/* <Button onClick={onClose}>Cancel</Button> */}
                            {/* <Button type="primary" onClick={onClose}>OK</Button> */}
                        </Space>
                    }>
                    <div className="videoDrawerContainer">
                        <Row gutter={[8, 12]}>
                            <Col span={24} md={24} lg={16} xl={18}>
                                <Row gutter={[8, 12]}>
                                    <Col span={24}>
                                        <div className="videoContainer">
                                            <ReactPlayer url={video.player.embedHtml} width='100%' height="100%"></ReactPlayer>
                                        </div>
                                    </Col>
                                    <Col span={24}>
                                        {/* <Space style={{ float: 'left' }}><VideoRate _video={_video}></VideoRate></Space> */}

                                        <Space size="small" style={{ float: 'right', color: 'white' }}>
                                            <EyeOutlined />{intToStringBigNumber(video.views)}
                                            <LikeOutlined />{intToStringBigNumber(video.likes)}
                                            <CommentOutlined />{intToStringBigNumber(video.comments)}
                                        </Space>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={24} md={24} lg={8} xl={6}>
                                <Row style={{
                                    height: "550px",
                                    overflow: "auto"
                                }}>
                                    <Col span={24}>
                                        <List
                                            header={<Text strong style={{ marginLeft: '20px' }}>Directed by</Text>}
                                            size="small"
                                            itemLayout="vertical"
                                            dataSource={video?.directedBy}
                                            //   style={{ width: '100%' }}
                                            renderItem={(creator, index) => (
                                                <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer">
                                                    <List.Item.Meta
                                                        avatar={<Avatar key={"drawerDirector" + index} src={creator.profile_picture} />}
                                                        title={creator.name}

                                                    />
                                                </List.Item>
                                            )} >
                                        </List>
                                    </Col>
                                    <Col span={24}>
                                        {/* <Space size={[0, 8]} wrap>
                                            {video?.cast.map((tag, index) => {
                                                return (

                                                    <Tag
                                                        key={index}
                                                        closable={false}
                                                        style={{
                                                            userSelect: 'none',
                                                        }}
                                                    >
                                                        <span><Avatar src={tag.profile_picture}/> {tag.name} <Text type="secondary"> as {tag.video_creator.role}</Text> </span>

                                                    </Tag>
                                                )
                                            })}
                                        </Space> */}
                                        <List
                                            header={<Text strong style={{ marginLeft: '20px' }}>Cast</Text>}
                                            size="small"
                                            itemLayout="vertical"
                                            dataSource={video?.cast}
                                            renderItem={(creator, index) => (
                                                <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer">
                                                    <List.Item.Meta
                                                        avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                                                        title={<><Text>{creator.name}</Text> <Text italic type="secondary"> as {creator.video_creator.role}</Text></>}

                                                    />
                                                </List.Item>
                                            )} >
                                        </List>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </div>
                </Drawer>
            ) : ('')
        }
        </>
    );
}

export default VideoDrawer;