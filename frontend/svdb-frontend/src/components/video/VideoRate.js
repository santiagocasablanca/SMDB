import { YoutubeOutlined, EyeOutlined, LikeOutlined } from '@ant-design/icons';
import { Avatar, Card, Divider, Typography, Space, Spin, Rate, Popover } from 'antd';
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import insertCss from 'insert-css';
import Paragraph from 'antd/es/typography/Paragraph';

const { Title, Text } = Typography;


/**
 * 
 * THIS IS A MESS. REFACTOR IT TO INCLUDE MORE FACTORS AND TO MAKE THE FORMULA ACTUALLY MAKE SENSE
 */
const VideoRate = ({ _video }) => {
    const navigate = useNavigate();

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const channel = useMemo(() => _video?.channel, [_video]);
    const [rating, setRating] = useState();
    const [isLoaded, setIsLoaded] = useState(() => _video !== undefined, [_video]);

    const weights = {
        video_views: 5,
        video_likes: 3,
        channel_subs: 2,
        channel_most_views: 1,
        channel_most_liked: 1,
        avg_channel_views: 1,
        avg_channel_likes: 1,
        recent_video_bonus: 3, // Extra points for recent videos
        recent_bonus: 5.5, // Extra points for recent videos

    };




    useEffect(() => {

        async function calculateVideoRating() {
            console.log(_video);
            const video_views = parseFloat(_video.views);
            const video_likes = parseFloat(_video.likes);
            const channel_subs = parseFloat(channel.subs);
            // const channel_most_views = parseFloat(video.creator_info.most_views);
            // const channel_most_liked = parseFloat(video.creator_info.most_liked);
            // const avg_channel_views = parseFloat(video.creator_info.avg_views);
            // const avg_channel_likes = parseFloat(video.creator_info.avg_likes);

            // Calculate the recent video bonus based on the published date
            const publishedDate = new Date(_video.published_at);
            const currentDate = new Date();
            const timeDifferenceInDays = (currentDate - publishedDate) / (1000 * 3600 * 24);
            const isRecent5 = timeDifferenceInDays <= 5 ? 2 : 0; // 1 for recent videos, 0 otherwise
            const isRecent10 = timeDifferenceInDays <= 10 ? 1 : 0;
            const isRecent15 = timeDifferenceInDays <= 15 ? 2 : 0;
            const isRecent30 = timeDifferenceInDays <= 15 ? 2 : 0;
            const isRecent60 = timeDifferenceInDays <= 60 ? 1 : 0;
            
            const recent_video_bonus = 1 / (timeDifferenceInDays + 1);//timeDifferenceInDays <= 45 ? 1 : 0; // 1 for recent videos, 0 otherwise

            // Calculate the overall rating based on the formula
            const rating =
                (video_views / channel_subs) * 8 + ///* weights.video_views +
                (video_likes / video_views) * 8 +
                // (video_views / channel_most_views) * weights.channel_most_views +
                // (video_views / avg_channel_views) * weights.avg_channel_views +
                (video_likes / channel_subs) * 8 + // * weights.video_likes +
                // (video_likes / channel_most_liked) * weights.channel_most_liked +
                // (video_likes / avg_channel_likes) * weights.avg_channel_likes +
                isRecent5 + isRecent10 + isRecent15 + isRecent30 + isRecent60;


            // const normalizedRating = Math.round((((rating - minValue) / (maxValue - minValue)) * 10));
            // const normalizedRating = Math.round((rating / (weights.video_views + weights.video_likes + weights.recent_bonus) * 10));
            const normalizedRating = Math.round(rating); //(weights.video_views +   weights.video_likes + weights.recent_bonus);
            console.log(video_views / channel_subs)
           

            setRating(normalizedRating);
        }
        calculateVideoRating();

    }, [_video]);

    insertCss(`
    
   .ant-rate-star .ant-rate-star-full > span {
        color: #d8bd14 !important;
    }
    `);


    // Calculate the rating for a video based on KPIs
    const calculateVideoRating = (video) => {

    };


    const formula = (
        <>
            <Title level={5}>Formula</Title>
            <Space size="small" style={{ float: 'right' }}>
                <EyeOutlined /><Text>{intToStringBigNumber(_video.views)} views</Text>
                <LikeOutlined /><Text>{intToStringBigNumber(_video.likes)} likes</Text>
                <YoutubeOutlined /><Text>{intToStringBigNumber(channel.subs)} subscribers</Text>
            </Space>
            <Text strong>(Video Views to Subscribers Ratio * 0.5) + </Text>
            {/* <Text> Video views are divided by the channel's subscriber count, giving an indication of viewer engagement relative to the channel's audience size.</Text> */}
            {/* <br></br> */}
            <Text strong>(Video Likes to Subscribers Ratio * 0.3) + </Text>
            {/* <Text> Video likes are divided by the channel's subscriber count, reflecting viewer appreciation in relation to the channel's following.</Text> */}
            <Text strong>(Recent Video Bonus * 0.1)</Text>
            <br></br>
            <Text type="secondary"> This factor adjusts the rating based on how recently the video was published.
                The code calculates the time difference in days between the current date and the video's publication date.
                The bonus is inversely proportional to the time difference, favoring recent videos.</Text>
        </>
    );

    // 480 x 270—  value={rating}
    return (
        <> {isLoaded ?
            (
                <Popover content={formula}>
                    <Rate allowHalf value={rating} disabled count={10} />
                </Popover>
            ) : (
                <Spin />
            )
        }
        </>
    );
    // {/* <Text strong>{rating}</Text><Text type="secondary">/10</Text> */}
}
export default VideoRate;