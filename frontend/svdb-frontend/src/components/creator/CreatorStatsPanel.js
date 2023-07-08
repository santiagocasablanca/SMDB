import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Descriptions, Spin, Progress, Popover } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined } from '@ant-design/icons';
import { green, red } from '@ant-design/colors';
import insertCss from 'insert-css';

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';

const { Title, Text } = Typography;



const CreatorStatsPanel = ({ creator, channel, stats, mostRecentVideos, isAllChannels }) => {

    const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [last5VideosStats, setLast5VideoStats] = useState({ views: [], likes: [], comments: [], duration: [] });

    useEffect(() => {
        if (mostRecentVideos !== null) {
            const tempViews = [];
            const tempLikes = [];
            const tempComments = [];
            const tempDuration = [];
            mostRecentVideos.slice(0, 5).map((el) => {
                tempViews.push({ value: (el.views / stats.views.unparsedAvg), videoValue: intToStringBigNumber(el.views), video: el });
                tempLikes.push({ value: (el.likes / stats.likes.unparsedAvg), videoValue: intToStringBigNumber(el.likes), video: el });
                tempComments.push({ value: (el.comments / stats.comments.unparsedAvg), videoValue: intToStringBigNumber(el.comments), video: el });
                tempDuration.push({ value: (el.duration_parsed / stats.duration.unparsedAvg), videoValue: parseDuration(el.duration), video: el });
            })
            setLast5VideoStats({ views: tempViews, likes: tempLikes, comments: tempComments, duration: tempDuration });
        }
    }, [mostRecentVideos]);


    insertCss(`
  .banner {
    background-color: #222;
    width: 100%;
    display: grid;
    color: #fff;
    font-size: 24px;
  }

  .banner img {
    height: 300px;
    object-fit: cover;
  }

  .profile {
    display: flex;
    margin: 20px 100px;
  }

  .profilePicture {
    width: 128px;
    height: 128px;
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
    padding: 20px 10px;
  }

  .channel_stats_info h3 {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
  }

  .channel_stats_info h5 {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
    margin-top: -10px !important;
  }

  .channel_stats_info p {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
    font-size: 13px;
    font-weight: 500;
    margin-top: 0px !important;
  }

  .moreStatsContainer {
    padding: 0 20px;
  }

  .since-panel {
    position: absolute;
    top: 15px;
    right: 5px;
    z-index: 10;
    background-color: rgba(255, 245, 54, 0.7);
    color: black;
    padding: 2px;
    border-radius: 5px;
  }

  .since-tag {
  }
  .since-tag span {
    white-space:nowrap;
  }

  @media (max-width: 600px) {
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
      padding: 0px 10px;
    }
    
  }

  `)


    const ChannelsTablePanel = ({ channels }) => {
        useEffect(() => {
            console.log(channels);
        });

        // the columns are the channels
        // the rows are the static information


        // logo_url
        const columns = [
            {
                title: '',
                dataIndex: 'logo_url',
                key: 'logo_url',
                render: (url) => <Avatar src={<img src={url} alt={url} />} />,
            },
            {
                title: 'Title',
                dataIndex: 'title',
                key: 'title',
                render: (text) => <p>{text}</p>,
            },
            {
                title: 'Subs',
                dataIndex: 'subs',
                key: 'subs',
                render: (val) => <p>{intToStringBigNumber(val)}</p>,
            },
            {
                title: 'Videos',
                dataIndex: 'videos',
                key: 'videos',
                render: (val) => <p>{intToStringBigNumber(val)}</p>,
            },
            {
                title: 'Views',
                dataIndex: 'views',
                key: 'views',
                render: (val) => <p>{intToStringBigNumber(val)}</p>,
            },
            {
                title: 'Created At',
                dataIndex: 'channel_created_at',
                key: 'channel_created_at',
                render: (date) => <p>{parseDate(date)}</p>,
            }
        ];

        return (
            <>
                <Table size='small'
                    pagination={false}
                    className="channel-table"
                    scroll={{ x: 300 }}
                    columns={columns}
                    dataSource={channels}
                    rowKey={(record) => record.channel_id}
                    summary={(pageData) => {
                        console.log(pageData);
                        let totalSubs = 0;
                        let totalVideos = 0;
                        let totalViews = 0;
                        pageData.forEach(({ subs, videos, views }) => {
                            totalSubs += parseInt(subs);
                            totalVideos += parseInt(videos);
                            totalViews += parseInt(views);
                        });
                        return (
                            <>
                                <Table.Summary.Row>
                                    <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                    <Table.Summary.Cell index={1}>Totals</Table.Summary.Cell>
                                    <Table.Summary.Cell index={2}>
                                        <Text>{intToStringBigNumber(totalSubs)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={3}>
                                        <Text>{intToStringBigNumber(totalVideos)}</Text>
                                    </Table.Summary.Cell>
                                    <Table.Summary.Cell index={4}>
                                        <Text>{intToStringBigNumber(totalViews)}</Text>
                                    </Table.Summary.Cell>
                                </Table.Summary.Row>

                            </>
                        );
                    }}>
                </Table>
            </>
        );
    };

    const SincePanel = ({ channel }) => {
        const [isFetched, setIsFetched] = useState(false);
        const [creationDate, setCreationDate] = useState({});

        useEffect(() => {
            // console.log(channels);
            if (channel) {
                setCreationDate(channel.channel_created_at);
                setIsFetched(true);
            }
        }, [channel]);

        return (
            <>
                {!isFetched ? (
                    // <LoadingAnimation />
                    <p>Loading...</p>
                ) : (
                        <div className="since-panel">
                            <div className="since-tag">
                                <span><CalendarOutlined /> Since {parseDate(creationDate, "MMM YYYY")}</span>
                            </div>
                        </div>
                    )}
            </>
        );
    };

    const Last5VideosComponent = ({ stats }) => {
        const [fifthColor, setFifthColor] = useState();
        const [fourthColor, setFourthColor] = useState();
        const [thirdColor, setThirdColor] = useState();
        const [secondColor, setSecondColor] = useState();
        const [firstColor, setFirstColor] = useState();

        const getColor = (value) => {
            if (value < 0.9) return '#ff4d4f';
            if (value > 0.9 && value < 1) return;
            if (value >= 1) return '#52c41a';
        }

        useEffect(() => {
            if (stats) {
                const reversedArray = stats.reverse();

                setFifthColor(getColor(reversedArray[0].value));
                setFourthColor(getColor(reversedArray[1].value));
                setThirdColor(getColor(reversedArray[2].value));
                setSecondColor(getColor(reversedArray[3].value));
                setFirstColor(getColor(reversedArray[4].value));

            }
        }, [stats]);

        const content = (index) => (
            <Space>
                <p>{stats[index].videoValue}</p>
                <p>{parseDate(stats[index].video.published_at)}</p>
            </Space>
        );


        return (
            <>
                <Space gutter={2}>
                    <Popover content={content(4)} placement="top">
                        <Avatar style={{ backgroundColor: firstColor }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(3)} placement="top">
                        <Avatar style={{ backgroundColor: secondColor }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(2)} placement="top">
                        <Avatar style={{ backgroundColor: thirdColor }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(1)} placement="top">
                        <Avatar style={{ backgroundColor: fourthColor }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(0)} placement="top">
                        <Avatar style={{ backgroundColor: fifthColor }} shape="square" size="small" />
                    </Popover>
                </Space>
            </>
        );
    }


    const ChannelPanel = ({ _channel }) => {

        const bannerUrl = _channel.banner_url + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

        return (
            <>
                <Card
                    bordered={false}
                    style={{ width: '95%' }}
                    bodyStyle={{ padding: 0 }}
                    cover={
                        <Image alt={_channel.title}
                            // style={{ maxHeight: '100%', objectFit: 'cover' }} borderRadius: '5px'
                            style={{ height: '300px', objectFit: 'cover' }}
                            src={bannerUrl}
                            preview={false}
                            fallback="data:image/png;base64,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"
                        />}>
                    <SincePanel channel={_channel}></SincePanel>
                    <div className="creatorContainer">
                        <Row className="profile" gutter={16} justify="center">
                            <Col span={4}>
                                <div className="profilePicture">
                                    <Image className="radius" src={_channel.logo_url} preview={false} />
                                </div>
                            </Col>
                            <Col span={20}>
                                <div className="channel_stats_info">
                                    <Title level={3}>{_channel.title}</Title>
                                    <Space>
                                        <Title level={5}>{_channel.custom_url}</Title>
                                        <p>{intToStringBigNumber(_channel.subs)} subs</p>
                                        <p>{intToStringBigNumber(_channel.videos)} videos</p>
                                    </Space>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="moreStatsContainer">
                        <Descriptions column={{ xs: 1, sm: 1, md: 1, lg: 2 }}>

                            <Descriptions.Item label="Subscribers">{intToStringBigNumber(_channel?.subs)}</Descriptions.Item>
                            <Descriptions.Item label="Created at">{parseDate(_channel?.channel_created_at)}</Descriptions.Item>
                            <Descriptions.Item label="Videos">{intToStringBigNumber(_channel?.videos)}</Descriptions.Item>
                            <Descriptions.Item label="Videos on the DB">{stats?.videos.value}</Descriptions.Item>

                            <Descriptions.Item label="Views">{stats?.views.humanized}</Descriptions.Item>
                            <Descriptions.Item label="Avg Views">{stats?.views.avg}</Descriptions.Item>
                            <Descriptions.Item span={2}>
                                <Last5VideosComponent stats={last5VideosStats.views}></Last5VideosComponent>
                            </Descriptions.Item>


                            <Descriptions.Item label="Likes">{stats?.likes.humanized}</Descriptions.Item>
                            <Descriptions.Item label="Avg Likes">{stats?.likes.avg}</Descriptions.Item>
                            <Descriptions.Item span={2}>
                                <Last5VideosComponent stats={last5VideosStats.likes}></Last5VideosComponent>
                            </Descriptions.Item>

                            <Descriptions.Item label="Comments">{stats?.comments.humanized}</Descriptions.Item>
                            <Descriptions.Item label="Avg Comments">{stats?.comments.avg}</Descriptions.Item>
                            <Descriptions.Item span={2}>
                                <Last5VideosComponent stats={last5VideosStats.comments}></Last5VideosComponent>
                            </Descriptions.Item>

                            <Descriptions.Item label="Duration">{stats?.duration.value}</Descriptions.Item>
                            <Descriptions.Item label="Avg Duration">{stats?.duration.avg}</Descriptions.Item>
                            <Descriptions.Item span={2}>
                                <Last5VideosComponent stats={last5VideosStats.duration}></Last5VideosComponent>
                            </Descriptions.Item>

                        </Descriptions>
                    </div>

                </Card>
            </>
        );
    };


    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <> {isLoaded ?
            (
                isAllChannels ? (
                    <ChannelsTablePanel channels={creator?.channels}></ChannelsTablePanel>
                ) : (
                        <ChannelPanel _channel={channel}></ChannelPanel>
                    )

            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default CreatorStatsPanel;