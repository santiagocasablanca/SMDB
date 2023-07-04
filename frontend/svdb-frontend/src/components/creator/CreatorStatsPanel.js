import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin } from 'antd';
import insertCss from 'insert-css';

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';

const { Title, Text } = Typography;



const CreatorStatsPanel = ({ creator, channel, isAllChannels }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [channels, setChannels] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    


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
                title: 'Creation Date',
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



    useEffect(() => {
        setIsLoaded(true);
    }, []);

    return (
        <> {isLoaded ?
            (
                isAllChannels ? (
                    <ChannelsTablePanel channels={creator?.channels}></ChannelsTablePanel>
                ) : (
                    < p >single channel hello world</p>
                )

    ) : (
        <Spin />
    )
}
        </>
    );
}

export default CreatorStatsPanel;