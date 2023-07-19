import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Row, Col, Image, Table, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Input, notification } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import ReactPlayer from 'react-player'


import { getCreatorsFn, associateChannelIdsToCreatorFn } from "../services/creatorApi.ts";
import { getVideosFn } from "../services/videoApi.ts";


import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import variables from '../sass/antd.module.scss'
import useFormatter from '../hooks/useFormatter';
import dayjs from "dayjs"





const { Title } = Typography;

const CreatorPage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  const [fetchedData, setFetchedData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();


  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    let params = new URLSearchParams();
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    getCreatorsFn(params).then((result) => {
      if (result.results) {
        setFetchedData(result.results);
      }
    })
  }

  insertCss(`
  .stats-panel {
    position: absolute;
    bottom: 60px;
    right: 10px;
    z-index: 10;
    background-color: rgba(255, 245, 54, 0.7);
    padding: 5px;
    border-radius: 5px;
  }
  
  .stats-tag {
    display: grid;
    gap: 5px;
  }

  .stats-tag span {
    margin-inline-end: 0px;
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

  .channel-table {
    padding: 0;
    width: 600px;
  }

  .headerPanel {
    padding: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .headerPanel h3 {
    color: `+ variables.oxfordBlue + `;
  }
 
  .headerPanel button span {
    background: `+ variables.oxfordBlue + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .creators-list {
    padding: 10px;
  }
  

  @media (max-width: 600px) {
    .since-panel {
      position: absolute;
      top: 10px;
      width: 60px;
      font-size: 10px;
    }
  
    .since-tag {
      text-align: center;
    }
  
    .since-tag span {
      white-space: normal;
    }

    .channel-table {
      max-width: 350px;
    }
  }

  `)

  const HeaderPanel = ({ title, filters, onChange }) => {
    // style={{ color: 'black' }}
    return (
      <Row className="headerPanel">
        <Col span="22">
          <Title level={3}>{title}</Title>
        </Col>
        <Col span="2">
          <div style={{ float: 'right' }}>

            <Button icon={<FilterOutlined />}>Filter</Button>
          </div>
        </Col>
      </Row>
    );
  };

  const StatsPanel = ({ subs, views, videos }) => {
    const content = (
      <div>
        <p>Total Subscribers: {subs}</p>
        <p>Total Views: {views}</p>
        <p>Total Videos: {videos}</p>
      </div>
    );

    return (
      <div className="stats-panel">
        <Popover content={content} placement="topLeft">
          <div className="stats-tag">
            <Tag icon={<YoutubeOutlined />} color="blue">{subs}</Tag>
            <Tag icon={<EyeOutlined />} color="green">{views}</Tag>
            <Tag icon={<VideoCameraOutlined />} color="orange">{videos}</Tag>
          </div>
        </Popover>
      </div>
    );
  };

  const SeeChannelsButton = ({ channels }) => {
    useEffect(() => {
    });
    // title="Channels"
    return (
      <>
        <Popover
          content={(<ChannelsPanel channels={channels}></ChannelsPanel>)}
          trigger="click">
          <Button type="ghost" shape="circle" icon={<YoutubeOutlined key="setting" />}></Button>,
        </Popover>
      </>
    );
  };

  const ChannelsPanel = ({ channels }) => {
    useEffect(() => {
    });

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
      },
      // {
      //   title: 'Action',
      //   key: 'action',
      //   render: (_, record) => (
      //     <Space size="middle">
      //       <a>Invite {record.name}</a>
      //       <a>Delete</a>
      //     </Space>
      //   ),
      // },
    ];

    return (
      <>
        <Table size='small'
          pagination={false}
          className="channel-table"
          scroll={{ x: 300 }}
          columns={columns}
          dataSource={channels}
          rowKey={(record) => record.channel_id}>

        </Table>
      </>
    );

  };

  const SincePanel = ({ channels }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [oldestCreationDate, setOldestCreationDate] = useState({});

    const sortedChannels = channels?.sort(
      (a, b) => new Date(a.channel_created_at) - new Date(b.channel_created_at)
    );

    useEffect(() => {
      // console.log(channels);
      if (channels) {
        const oldestChannel = channels.reduce((oldest, current) => {
          if (!oldest) {
            return current;
          }
          return current.channel_created_at < oldest.channel_created_at ? current : oldest;
        }, null);

        setIsFetched(true);
        setOldestCreationDate(oldestChannel?.channel_created_at);
      }
    }, []);

    const content = (
      <List
        size="small"
        style={{ width: "220px" }}
        dataSource={sortedChannels}
        renderItem={(channel) => (
          <List.Item>
            {/* <p><Avatar src={<img src={channel.logo_url} alt={channel.logo_url} />} /> {channel.title} <i>channel created at</i> {dayjs(channel.channel_created_at).format("MMM YYYY")}</p> */}
            <List.Item.Meta
              avatar={<Avatar src={channel.logo_url} />}
              title={channel.title}
              description={<span><i>created at </i>{dayjs(channel.channel_created_at).format("MMM YYYY")}</span>}
            />
          </List.Item>
        )}
      />
    );

    return (
      <>
        {!isFetched ? (
          // <LoadingAnimation />
          <p>Loading...</p>
        ) : (
            <div className="since-panel">
              <Popover content={content} placement="bottomRight">
                <div className="since-tag">
                  <span><CalendarOutlined /> Since {dayjs(oldestCreationDate).format("MMM YYYY")}</span>
                </div>
              </Popover>
            </div>
          )}
      </>
    );
  };

  const handleClickCreator = (id) => {
    console.log(id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }



  const CreatorModal = ({ creator }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
      setVisible(true);
    };

    const handleCancel = () => {
      setVisible(false);
    };

    const onFinish = (values) => {
      // Here, you can call the `associateChannelIdsToCreator` method
      // with the creator and the inserted channel IDs.
      // Replace the console.log statement with your own logic.
      console.log('Submitted Channel IDs:', values.channelIds);
      const channel_ids= values.channelIds.split(',').map((id) => id.trim());
      associateChannelIdsToCreatorFn({ creator_id: creator.id, channel_ids: channel_ids })

      // Close the modal
      setVisible(false);

      // Show a success notification
      notification.success({
        message: 'Channels Associated',
        description: 'The channel IDs have been associated with the creator.',
      });
    };

    return (
      <>
        <Button onClick={showModal}>Associate Channels</Button>
        <Modal
          title="Associate Channels"
          visible={visible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form onFinish={onFinish}>
            <Form.Item
              name="channelIds"
              label="Channel IDs"
              rules={[
                { required: true, message: 'Please enter at least one channel ID' },
              ]}
            >
              <Input.TextArea
                placeholder="Enter channel IDs (separated by commas)"
                autoSize={{ minRows: 3, maxRows: 6 }}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      </>
    );
  };

  return (<>
    <HeaderPanel title="Creators"></HeaderPanel>
    <List
      grid={{
        gutter: 8,
        xs: 1,
        sm: 1,
        md: 2,
        lg: 3,
        xl: 4,
        xxl: 5,
      }}
      className="creators-list"
      itemLayout="horizontal"
      // style={{
      //   background: variables.sdmnPink,
      //   padding: 20,
      //   marginTop: 20,
      //   marginBottom: 20,
      //   borderRadius: '5px'
      // }}
      // loading={isTop10VideosLoaded}
      dataSource={fetchedData}
      renderItem={(item, index) => (
        <List.Item>
          <Card title={item.name}
            style={{ width: '100%', maxWidth: '450px' }}
            bodyStyle={{ padding: 0 }}
            actions={[
              (item.channels.length > 0 ? (<SeeChannelsButton channels={item.channels}></SeeChannelsButton>) : (isAdmin ? <CreatorModal creator={item} /> : 'not')),
              <VideoCameraOutlined key="ellipsis" />,
            ]}
            cover={
              // <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
              <Image alt={item.name}
                // style={{ maxHeight: '100%', objectFit: 'cover' }} borderRadius: '5px'
                style={{ height: '300px', objectFit: 'cover' }}
                src={item.profile_picture}
                onClick={() => handleClickCreator(item.id)}
                preview={false}
                fallback="data:image/png;base64,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"
              />
              // </div>
            }
            hoverable
            // onClick={() => handleClickCreator(item.id)}
            key={item.id}>
            {item.channels.length > 0 ? (
              <>
                <SincePanel channels={item.channels}></SincePanel>
                <StatsPanel subs={intToStringBigNumber(item.subs)} videos={intToStringBigNumber(item.videos)} views={intToStringBigNumber(item.views)}></StatsPanel>
              </>
            ) :
              ('')
            }

          </Card>
        </List.Item>
      )}
    />
  </>);
};


export default CreatorPage;
