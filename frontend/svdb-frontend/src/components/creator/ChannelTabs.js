import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Popover, Image, Typography, Tabs, Space } from 'antd';
import CreatorChannel from './CreatorChannel'
import insertCss from 'insert-css';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined } from '@ant-design/icons';

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';

const { Title, Text } = Typography;


const ChannelTabs = ({_creator, _channels}) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [isLoaded, setIsLoaded] = useState(false);
    const [creator, setCreator] = useState({});
    const [channels, setChannels] = useState([]);

    // width: 215px;
    insertCss(`
        .tabTitle {
            padding: 0px 0px;
            background-size: cover;    
            background-repeat: no-repeat;
        }
        .circular {
            border-radius: 50%;
        }
        .tabTitleImg {
            width: 88px !important;
            height: 88px !important;
        }

        .popupBanner {
            background-color: #222;
            width: 100%;
            display: grid;
          }
        
          .popupBanner img {
            height: 88px !important;
            object-fit: cover;
          }

        @media (max-width: 600px) {
            .tabTitle {
            }

            .tabTitleImg {
                width: 32px !important;
                height: 32px !important;
            }
        }

    `);

    useEffect(() => {
        setCreator(_creator);

        if (_channels !== undefined || _channels.length > 0) {

            const sortedChannels = _channels.sort(
                (a, b) => new Date(a.channel_created_at) - new Date(b.channel_created_at)
            );

            const channels = sortedChannels.map((_channel) => {
                return {
                    label: <ChannelTab channel={_channel} />,
                    key: _channel.channel_id,
                    children: <CreatorChannel creator={_creator} channel={_channel} />,
                };
            });
            setChannels([{
                label: 'All Channels',
                key: 'allChannels',
                children: <CreatorChannel creator={_creator} channel={null} />
            }].concat(channels));
            setIsLoaded(true);
        }
    }, [_creator, _channels]);

    const ChannelTab = ({ channel }) => {
        const bannerUrl = channel.banner_url + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';

        const content = (
            <div>
                <div className="popupBanner">
                    <Image src={bannerUrl}
                        preview={false} />
                </div>
                <div>
                    <Space>
                        <Title level={3}>{channel.title}</Title>
                    </Space>
                    <br></br>
                    <Space>
                        <Text type="secondary">{intToStringBigNumber(channel.subs)} subs</Text>
                        <Text type="secondary">{intToStringBigNumber(channel.videos)} videos</Text>
                        <Text type="secondary">{intToStringBigNumber(channel.views)} views</Text>
                    </Space>
                </div>
            </div>
        );

        return (
            <Popover content={content} placement="top">
                <Space className="tabTitle">
                    <Image className="tabTitleImg circular" width="100%" height="100%" src={channel.logo_url} preview={false}></Image>
                </Space>
            </Popover>
        );
    };

    return (
        <>
            {isLoaded ?
                (
                    <Tabs
                        defaultActiveKey="1"
                        // type="card"
                        size="small"
                        style={{
                            color: 'black',
                        }}
                        items={channels}
                    />
                ) : (' ')
            }
        </>
    );
}

export default ChannelTabs;