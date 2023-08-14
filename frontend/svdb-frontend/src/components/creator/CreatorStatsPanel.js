import { ArrowDownOutlined, ArrowUpOutlined, CalendarOutlined, ClockCircleOutlined, CommentOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Image, Popover, Row, Space, Spin, Table, Tooltip, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';


const { Title, Text } = Typography;



const CreatorStatsPanel = ({ creator, channel, stats, channelsStats, mostRecentVideos, isAllChannels }) => {

    const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [last5VideosStats, setLast5VideoStats] = useState({ views: [], likes: [], comments: [], duration: [] });

    useEffect(() => {
        console.log(channelsStats);
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
    }, [mostRecentVideos, channelsStats]);


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
    width: 115px;
    height: 115px;
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

  .last5videoPreview {
    width: 300px;
    display: flex; 
    flex-direction: column;
    align-items: center;
  }


  .channel_stats_info {
    align-items: flex-start;
    padding: 0px 10px;
  }

  .channel_stats_info h3 {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
  }

  .channel_stats_info h5 {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
    margin-top: -15px !important;
  }

  .channel_stats_info p {
    color: `+ variables.onSurface + `;
    text-wrap: nowrap;
    font-size: 13px;
    font-weight: 500;
    margin-top: -2px !important;
    margin-bottom: 0px;
  }

  .moreStatsContainer {
    overflow: auto;
    padding: 0 20px;
    justify-items: center;
    background-color: `+ variables.coolerGray6 + `;
    color: `+ variables.onSurface + `;
  }

  .moreStatsContainer h5 {
    font-size: 14px;
  }

  .moreStatsContainer p {
    font-size: 11px;
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

  .channel-table p {
      color:  `+ variables.onSurface + `;
  }

  .since-tag {
  }
  .since-tag span {
    white-space:nowrap;
  }

  .creatorChannelCard {
    width: 95%;
    height: 630px;
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
      padding: 0px 20px;
    }

    .creatorChannelCard {
        width: 100%;
      }
    
  }

  

  `)

//    .last5videoPreview > p,span {
//     color: white;
//   }

    // no need for this mess i guess! TODO refactor
    const ChannelsTablePanel = ({ channels, channelsStats }) => {
        const [isLoaded, setIsLoaded] = useState(false);

        useEffect(() => {
            channels.map((channel) => {
                channel.stats = channelsStats?.filter((channelStat) => channel.channel_id == channelStat.channel_id)[0];
            });
            setIsLoaded(true);
        }, [channels, channelsStats]);

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
                title: 'Total Views',
                dataIndex: 'views',
                key: 'views',
                render: (val) => <p>{intToStringBigNumber(val)}</p>,
            },
            {
                title: 'Avg Views',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.views?.humanizedAvg}</p>,
            },
            {
                title: 'Most Viewed',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.views?.humanizedMost}</p>,
            },
            {
                title: 'Total Likes',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.likes?.humanized}</p>,
            },
            {
                title: 'Avg Likes',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.likes?.humanizedAvg}</p>,
            },
            {
                title: 'Most Liked',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.likes?.humanizedMost}</p>,
            },
            {
                title: 'Play time',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.duration?.humanized}</p>,
            },
            {
                title: 'Avg Video Duration',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.duration?.humanizedAvg}</p>,
            },
            {
                title: 'Longest',
                dataIndex: 'stats',
                key: 'stats',
                render: (val) => <p>{val?.duration?.humanizedMost}</p>,
            },
            {
                title: 'Created At',
                dataIndex: 'channel_created_at',
                key: 'channel_created_at',
                render: (date) => <p style={{ width: '150px' }}>{parseDate(date)}</p>,
            }
        ];

        return (
            <> {isLoaded ?
                (
                    <Table size='large'
                        pagination={false}
                        className="channel-table"
                        scroll={{ x: 300 }}
                        columns={columns}

                        dataSource={channels}
                        rowKey={(record) => record.channel_id}
                        summary={(pageData) => {
                            let totalSubs = 0;
                            let totalVideos = 0;
                            let totalViews = 0;
                            let avgViews = 0;
                            let mostViewed = 0;
                            let totalLikes = 0;
                            let avgLikes = 0;
                            let mostLiked = 0;
                            let duration = 0;
                            let avgDuration = 0;
                            let longest = 0;
                            // Avg Views	Most Viewed	Total Likes	Avg Likes	Most Liked	Play time	Avg Video Duration	Longest
                            let n_channels = pageData.length;
                            pageData.forEach(({ subs, videos, views, stats }) => {
                                totalSubs += parseInt(subs);
                                totalVideos += parseInt(videos);
                                totalViews += parseInt(views);
                                totalLikes += parseInt(stats?.likes.value);
                                duration += parseInt(stats?.duration.value);
                                mostViewed = (parseInt(stats?.views.most) > mostViewed ? stats?.views.most : mostViewed);
                                mostLiked = (parseInt(stats?.likes.most) > mostLiked ? stats?.likes.most : mostLiked);
                                longest = (parseInt(stats?.duration.most) > longest ? stats?.duration.most : longest);
                            });
                            avgLikes = (totalLikes / totalVideos);
                            avgViews = (totalViews / totalVideos);
                            avgDuration = (duration / totalVideos);
                            return (
                                <>
                                    <Table.Summary.Row>
                                        <Table.Summary.Cell index={0}></Table.Summary.Cell>
                                        <Table.Summary.Cell index={1}>Totals</Table.Summary.Cell>
                                        <Table.Summary.Cell index={2}>
                                            {intToStringBigNumber(totalSubs)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={3}>
                                            {intToStringBigNumber(totalVideos)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={4}>
                                            {intToStringBigNumber(totalViews)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={5}>
                                            {intToStringBigNumber(avgViews)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={6}>
                                            {intToStringBigNumber(mostViewed)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={7}>
                                            {intToStringBigNumber(totalLikes)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={8}>
                                            {intToStringBigNumber(avgLikes)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={9}>
                                            {intToStringBigNumber(mostLiked)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={10}>
                                            {displayDurationFromSeconds(duration)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={11}>
                                            {displayVideoDurationFromSeconds(avgDuration)}
                                        </Table.Summary.Cell>
                                        <Table.Summary.Cell index={12}>
                                            {displayVideoDurationFromSeconds(longest)}
                                        </Table.Summary.Cell>
                                    </Table.Summary.Row>

                                </>
                            );
                        }}>
                    </Table>
                ) : (
                    <Spin />
                )
            }
            </>
        );
    };

    const SincePanel = ({ channel }) => {
        const [isFetched, setIsFetched] = useState(false);
        const [creationDate, setCreationDate] = useState({});

        useEffect(() => {
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

    const Last5VideosComponent = ({ stats, last5, icon }) => {

        const getColor = (value) => {
            if (value < 0.9) return '#ff4d4f';
            if (value > 0.9 && value < 1) return;
            if (value >= 1) return '#52c41a';
        }

        const getIcon = (value) => {
            if (value < 0.9) return <ArrowDownOutlined />;
            if (value > 0.9 && value < 1) return;
            if (value >= 1) return <ArrowUpOutlined />;
        }

        // TODO implement this -> videoPreview?
        const ratioTooltip = (index) => (<Text>{last5[index]?.videoValue} / {stats?.avg} </Text>);

        const content = (index) => (
            <div className="last5videoPreview">
                <Text strong ellipsis={true}>{last5[index].video.title}</Text>
                {/* <br></br> */}
                <Image style={{ borderRadius: '8px', objectFit: 'cover' }} src={last5[index].video.url} height='150px' width="265px" preview={false}></Image>
                {/* <br></br> */}
                <Space>
                    <div style={{ width: '15px' }}>
                        {icon}
                    </div>
                    <Text>{last5[index].videoValue}</Text>
                    <Divider/>
                    <Tooltip title={ratioTooltip(index)} placement="top"><Text style={{ color: getColor(last5[index].value) }}>{(last5[index].value * 100).toFixed(2)}%</Text></Tooltip>
                    <Divider/>
                    <Text type="secondary">{parseDateToFromNow(last5[index].video.published_at)}</Text>
                </Space>

            </div>
        );


        return (
            <>
                <Space gutter={2}>
                    <Popover content={content(4)} placement="top">
                        <Avatar icon={getIcon(last5[4].value)} style={{ backgroundColor: getColor(last5[4].value) }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(3)} placement="top">
                        <Avatar icon={getIcon(last5[3].value)} style={{ backgroundColor: getColor(last5[3].value) }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(2)} placement="top">
                        <Avatar icon={getIcon(last5[2].value)} style={{ backgroundColor: getColor(last5[2].value) }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(1)} placement="top">
                        <Avatar icon={getIcon(last5[1].value)} style={{ backgroundColor: getColor(last5[1].value) }} shape="square" size="small" />
                    </Popover>
                    <Popover content={content(0)} placement="top">
                        <Avatar icon={getIcon(last5[0].value)} style={{ backgroundColor: getColor(last5[0].value) }} shape="square" size="small" />
                    </Popover>
                </Space>
            </>
        );
    }




    const ChannelPanel = ({ _channel }) => {

        const StatPanel = ({ title, value }) => {
            return (
                <>
                    <Space.Compact direction="vertical" size="small" style={{ width: '80px' }}>
                        <p style={{ marginTop: '10px', marginBottom: '-1px' }}>{title}</p>
                        <Title level={5}>{value}</Title>
                    </Space.Compact>
                </>
            );
        }

        const StatRow = ({ title, icon, stats, last5 }) => {
            return (
                <Space split={<Divider type="vertical" />} size="small">
                    <Tooltip title={title}>
                        <div style={{ width: '15px' }}>
                            {icon}
                        </div>
                    </Tooltip>
                    <StatPanel title="Total" value={stats?.humanized} width="80px"></StatPanel>
                    <StatPanel title="Avg" value={stats?.avg}></StatPanel>
                    {/* TODO change value for most liked, needed to pass the most/least liked videos */}
                    <StatPanel title="Most" value={stats?.most}></StatPanel>
                    <StatPanel title="Least" value={stats?.least}></StatPanel>

                    <Space.Compact direction="vertical">
                        <p style={{ marginTop: '3px', marginBottom: '-1px' }}>Last 5</p>
                        <Last5VideosComponent stats={stats} last5={last5} icon={icon}></Last5VideosComponent>
                    </Space.Compact>
                </Space>
            );
        }

        const bannerUrl = _channel.banner_url + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

        return (
            <>
                <Card
                    bordered={false}
                    className="creatorChannelCard"
                    bodyStyle={{ padding: 0 }}
                    cover={
                        <Image alt={_channel.title}
                            // style={{ maxHeight: '100%', objectFit: 'cover' }} borderRadius: '5px'
                            style={{ height: '200px', objectFit: 'cover' }}
                            src={bannerUrl}
                            preview={false}
                            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
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
                                    <Title level={5}>{_channel.custom_url}</Title>
                                    <Space>
                                        <p>{intToStringBigNumber(_channel.subs)} subs</p>
                                        <p>{intToStringBigNumber(_channel.videos)} videos</p>
                                        <p>{intToStringBigNumber(_channel.views)} views</p>
                                    </Space>
                                    <p>Created at {parseDate(_channel?.channel_created_at)}</p>
                                </div>
                            </Col>
                        </Row>
                    </div>
                    <div className="moreStatsContainer">
                        <StatRow title="Views" icon={<EyeOutlined />}
                            stats={stats?.views} last5={last5VideosStats.views}></StatRow>
                        <Divider style={{ margin: '2px 0px' }} />

                        <StatRow title="Likes" icon={<LikeOutlined />}
                            stats={stats?.likes} last5={last5VideosStats.likes}></StatRow>
                        <Divider style={{ margin: '2px 0px' }} />

                        <StatRow title="Comments" icon={<CommentOutlined />}
                            stats={stats?.comments} last5={last5VideosStats.comments}></StatRow>
                        <Divider style={{ margin: '2px 0px' }} />

                        <StatRow title="Duration" icon={<ClockCircleOutlined />}
                            stats={stats?.duration} last5={last5VideosStats.duration}></StatRow>

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
                    <>
                        <ChannelsTablePanel channels={creator?.channels} channelsStats={channelsStats}></ChannelsTablePanel>
                    </>
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