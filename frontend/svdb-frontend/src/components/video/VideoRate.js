import { YoutubeOutlined, EyeOutlined, CommentOutlined, LikeOutlined, StarFilled, StarTwoTone } from '@ant-design/icons';
import { Avatar, Card, Divider, Typography, Space, Spin, Rate, Popover, Row, Col } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import insertCss from 'insert-css';
import { getChannelStatsFn } from '../../services/cacheApi.ts';
import useDeepCompareEffect from 'use-deep-compare-effect';

const { Title, Text, Paragraph } = Typography;


/**
 * 
 * THIS IS A MESS. REFACTOR IT TO INCLUDE MORE FACTORS AND TO MAKE THE FORMULA ACTUALLY MAKE SENSE
 */
const VideoRate = ({ _video, small }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();
    const channel = useMemo(() => _video?.channel, [_video]);
    const [rating, setRating] = useState();
    const [channelStats, setChannelStats] = useState();

    const [isLoaded, setIsLoaded] = useState(false);


    useDeepCompareEffect(() => {
        // console.log('1 effect', _video, channelStats, rating)
        // console.log(channelStats);
        async function fetchStats() {
            setIsLoaded(false);
            // console.log(_video?.channel);
            const stats = await getChannelStatsFn(_video?.channel.channel_id);
            // console.log(stats);
            setChannelStats(stats);

            if (_video !== undefined && stats !== undefined) {
                // console.log(_video.views, _video.likes, _video.comments );
                // console.log(_video.channel?.subs);
                const video_views = parseFloat(_video.views);
                const video_likes = parseFloat(_video.likes);
                const video_comments = parseFloat(_video.comments);
                const channel_subs = parseFloat(_video.channel?.subs);
                const channel_most_views = parseFloat(stats?.views.most);
                const channel_most_liked = parseFloat(stats?.likes.most);
                const avg_channel_views = parseFloat(stats?.views.avg);
                const avg_channel_likes = parseFloat(stats?.likes.avg);
                const avg_channel_comments = parseFloat(stats?.comments.avg);
                const channel_most_commented = parseFloat(stats?.comments.most);

                // Calculate the recent video bonus based on the published date
                const publishedDate = new Date(_video.published_at);
                const currentDate = new Date();
                const timeDifferenceInDays = (currentDate - publishedDate) / (1000 * 3600 * 24);
                const isRecent5 = timeDifferenceInDays <= 5 ? 1 : 0; // 1 for recent videos, 0 otherwise
                const isRecent10 = timeDifferenceInDays <= 10 ? 1 : 0;
                const isRecent15 = timeDifferenceInDays <= 15 ? 1 : 0;
                const isRecent30 = timeDifferenceInDays <= 30 ? 1 : 0;
                const isRecent60 = timeDifferenceInDays <= 60 ? 1 : 0;

                // const recent_video_bonus = 1 / (timeDifferenceInDays + 1);//timeDifferenceInDays <= 45 ? 1 : 0; // 1 for recent videos, 0 otherwise

                // Calculate the overall rating based on the formula
                const rating =
                    (((video_views / channel_subs) * 0.5 +
                        (video_views / channel_most_views) * 0.1 +
                        (video_views / avg_channel_views) * 0.4)
                        * 5 +
                        ((video_likes / video_views) * 0.3 +
                            (video_likes / channel_subs) * 0.3 +
                            (video_likes / channel_most_liked) * 0.1 +
                            (video_likes / avg_channel_likes) * 0.3)
                        * 4 + // 
                        ((video_comments / channel_most_commented) * 0.2 +
                            (video_comments / avg_channel_comments) * 0.8)
                        * 1) +
                    isRecent5 + isRecent10 + isRecent15 + isRecent30 + isRecent60;



                // const normalizedRating = Math.round((((rating - minValue) / (maxValue - minValue)) * 10));
                // const normalizedRating = Math.round((rating / (weights.video_views + weights.video_likes + weights.recent_bonus) * 10));
                const normalizedRating = (rating) > 10 ? 10 : Math.round(rating); //(weights.video_views +   weights.video_likes + weights.recent_bonus);
                // console.log(_video, channel_subs, isRecent10)
                // console.log(normalizedRating, rating.toFixed(2))

                setRating(normalizedRating);
                setIsLoaded(true);
            }
        }
        fetchStats();
    }, [_video])


    const getColor = (value) => {
        if (value < 1) return '#ff4d4f';
        // if (value > 0.9 && value < 1) return;
        if (value >= 1) return '#52c41a';
    }


    // rowspan="2" .toFixed(2)
    const title = (
        <div className="titleStatsFormulaContainer">
            <Row>
                <Col span={4}>
                    <Title level={5}>Stats</Title>
                </Col>
                <Col span={20}>
                    <Space style={{ float: 'right' }}>
                        <div><StarFilled style={{ fontSize: small ? '13px' : '18px', color: '#FDDF01' }} /> <Text strong style={{ fontSize: small ? '13px' : '15px' }}> {rating}</Text>
                            <Text style={{ fontSize: small ? '11px' : '13px' }}>/10</Text>
                        </div>
                        <Divider type="vertical" ></Divider>

                        <YoutubeOutlined /><Text>{intToStringBigNumber(channel?.subs)} subs</Text>
                        <Divider type="vertical" ></Divider>
                        <Text>{parseDateToFromNow(_video?.published_at)}</Text>
                    </Space>
                </Col>
            </Row>

        </div>
    );

    const formula = (
        <div className="statsFormulaContainer">
            <Row justify="center">
                <Col span={24} justify="center">
                    <table>
                        <tbody>
                            <tr>
                                <th style={{ width: '10%' }} rowSpan={4}><EyeOutlined /><br /> {intToStringBigNumber(_video?.views)} <br /> Views <br />

                                    <p style={{ fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.5)</p>
                                </th>
                                {/* <th>Ratio</th>
                            <th>Description</th>
                            <th>Value</th> */}
                            </tr>
                            <tr>
                                <td style={{ width: '40%' }}>Views/Subs<br /><p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.5)</p></td>
                                <td style={{ width: '20%' }}>{intToStringBigNumber(_video?.views)} / {intToStringBigNumber(_video?.channel?.subs)}</td>
                                <td style={{ width: '20%' }}><Text style={{ float: 'right', color: getColor((_video?.views / channel?.subs)) }}>{Math.round((_video?.views / channel?.subs) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Views/Avg Views p/ video<br /><p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.4)</p></td>
                                <td>{intToStringBigNumber(_video?.views)} / {intToStringBigNumber(channelStats?.views.avg)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.views / channelStats?.views.avg)) }}>{Math.round((_video?.views / channelStats?.views.avg) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Views/Most Viewed Video <br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.1)</p></td>
                                <td>{intToStringBigNumber(_video?.views)} / {intToStringBigNumber(channelStats?.views.most)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.views / channelStats?.views.most)) }}>{Math.round((_video?.views / channelStats?.views.most) * 100)} %</Text></td>
                            </tr>
                            {/* <tr>
                            <td>Views/World's Avg</td>
                            <td></td>
                            <td></td>
                        </tr> */}
                            <tr style={{ borderTop: '1px solid white' }}>
                                <th rowSpan={5}><LikeOutlined /> <br />{intToStringBigNumber(_video?.likes)} <br /> Likes <br />
                                    <p style={{ fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.3)</p></th>
                            </tr>
                            <tr>
                                <td>Likes/Views <br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.3)</p></td>
                                <td>{intToStringBigNumber(_video?.likes)} / {intToStringBigNumber(_video?.views)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.likes / _video?.views)) }}>{Math.round((_video?.likes / _video?.views) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Likes/Subs <br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.3)</p></td>
                                <td>{intToStringBigNumber(_video?.likes)} / {intToStringBigNumber(_video?.channel?.subs)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.likes / channel?.subs)) }}>{Math.round((_video?.likes / _video?.channel?.subs) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Likes/Avg Likes p/ video<br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.3)</p></td>
                                <td>{intToStringBigNumber(_video?.likes)} / {intToStringBigNumber(channelStats?.likes.avg)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.likes / channelStats?.likes.avg)) }}>{Math.round((_video?.likes / channelStats?.likes.avg) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Likes/Most Likes Video <br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.1)</p></td>
                                <td>{intToStringBigNumber(_video?.likes)} / {intToStringBigNumber(channelStats?.likes.most)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.likes / channelStats?.likes.most)) }}>{Math.round((_video?.likes / channelStats?.likes.most) * 100)} %</Text></td>
                            </tr>
                            <tr style={{ borderTop: '1px solid white' }}>
                                <th rowSpan={5}><CommentOutlined /> <br />{intToStringBigNumber(_video?.comments)} <br /> Comments <br />
                                    <p style={{ fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.1)</p></th>
                            </tr>
                            <tr>
                                <td>Comments/Avg Comments p/ video<br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.8)</p></td>
                                <td>{intToStringBigNumber(_video?.comments)} / {intToStringBigNumber(channelStats?.comments.avg)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.comments / channelStats?.comments.avg)) }}>{Math.round((_video?.comments / channelStats?.comments.avg) * 100)} %</Text></td>
                            </tr>
                            <tr>
                                <td>Comments/Most Commented Video <br /> <p style={{ float: 'left', fontSize: '10px', color: 'whitesmoke' }}>(weight: 0.2)</p></td>
                                <td>{intToStringBigNumber(_video?.comments)} / {intToStringBigNumber(channelStats?.comments.most)}</td>
                                <td><Text style={{ float: 'right', color: getColor((_video?.comments / channelStats?.likes.most)) }}>{Math.round((_video?.comments / channelStats?.comments.most) * 100)} %</Text></td>
                            </tr>
                        </tbody>
                    </table>
                </Col>
            </Row>
            <br></br>
            <Row>
                <Col span={24}>
                    <Text strong>Note: </Text>
                    <br></br>
                    <Paragraph ellipsis={{ rows: 2, expandable: true, symbol: 'more' }}>
                        This formula adjusts the rating based on how recently the video was published, by calculating the time difference in days between the current date and the video's publication date.
                        The bonus is inversely proportional to the time difference, favoring recent videos.
                    </Paragraph>
                </Col>
            </Row>
        </div>
    );

    // 480 x 270—  value={rating}
    return (
        <> {isLoaded ?
            (
                <Popover title={title} content={formula} placement="bottomRight">
                    <StarFilled style={{ fontSize: small ? '13px' : '18px', color: '#FDDF01', cursor: 'pointer' }} />
                    <Text strong style={{ fontSize: small ? '13px' : '15px', cursor: 'pointer' }}>{rating}</Text>
                    <Text style={{ fontSize: small ? '11px' : '13px', cursor: 'pointer' }}>/10</Text>
                </Popover>
            ) : (
                <Spin />
            )
        }
        </>
    );
}

export default VideoRate;