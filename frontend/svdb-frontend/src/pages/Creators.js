import { CalendarOutlined, EyeOutlined, FilterOutlined, UserOutlined, VideoCameraOutlined, YoutubeOutlined, EditOutlined } from '@ant-design/icons';
import { Avatar, Button, Card, Col, Form, Image, Input, List, Modal, notification, Popover, Row, Space, Table, Tag, Tooltip, Spin, Divider, Typography } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddCreatorModal from '../components/creator/AddCreatorModal';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import { associateChannelIdsToCreatorFn, getCreatorsFn } from "../services/creatorApi.ts";
import { AppLoading } from '../components';


const { Title, Text } = Typography;

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
  .bodyContainer {
    margin: 10px 100px auto;
  }

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
    color: `+ variables.sdmnBlack + `;
  }
 
  .headerPanel button span {
    background: `+ variables.sdmnBlack + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .creators-list {
    padding: 10px;
  }
  

  @media (max-width: 600px) {
    .bodyContainer {
      margin: 0 20px;
    }

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
    .headerPanel {
      margin: 10px 10px auto;
    }
  }

  `)

  // {isAdmin ? (<AddCreatorModal />) : ('')}
  // <Button icon={<FilterOutlined />}>Filter</Button>


  const HeaderPanel = ({ title, filters, onChange }) => {
    // style={{ color: 'black' }}
    return (
      <Row className="headerPanel">
        <Col span="22">
          <Title level={3}><Space><UserOutlined /> {title}</Space></Title>
        </Col>
        <Col span="2">
          <div style={{ float: 'right' }}>
            <Space.Compact block>
              {isAdmin ? (<Tooltip title="Add Creator">
                <AddCreatorModal />
              </Tooltip>) : ('')}
              {/* <Tooltip title="Filter">
                <Button icon={<FilterOutlined />} />
              </Tooltip> */}
            </Space.Compact>

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
            <Tag icon={<YoutubeOutlined />} color="black">{subs}</Tag>
            <Tag icon={<EyeOutlined />} color="black">{views}</Tag>
            <Tag icon={<VideoCameraOutlined />} color="black">{videos}</Tag>
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
          <Spin></Spin>
        ) : (
            <div className="since-panel">
              <Popover content={content} placement="bottomRight">
                <div className="since-tag">
                  <span>Circa {dayjs(oldestCreationDate).format("YYYY")}</span>
                </div>
              </Popover>
            </div>
          )}
      </>
    );
  };

  const handleClickCreator = (id) => {
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
      // console.log('Submitted Channel IDs:', values.channelIds);
      const channel_ids = values.channelIds.split(',').map((id) => id.trim());
      associateChannelIdsToCreatorFn(values.apiKey, { creator_id: creator.id, channel_ids: channel_ids })

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
        {/* <Button onClick={showModal}></Button> */}
        <Button style={{color: 'lightgray'}} type="text" onClick={showModal} icon={<EditOutlined />} />
        <Modal
          title="Associate Channels"
          open={visible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form onFinish={onFinish}>
            <Form.Item
              name="apiKey"
              label="Api Key"
              rules={[
                { required: true, message: 'Please enter the api key' },
              ]}>
              <Input
                placeholder="Enter the Api Key"
              />
            </Form.Item>
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
    <div className="bodyContainer">

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
        // loading={isTop10VideosLoaded}
        dataSource={fetchedData}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              style={{ width: '100%', maxWidth: '450px', backgroundColor: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 0 }}
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
                  <div style={{ padding: '5px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'black', marginBottom: '5px', alignItems: 'flex-start' }}>
                      <div style={{ display: 'flex' }}>
                        <Avatar src={item.profile_picture} 
                         onClick={() => handleClickCreator(item.id)} style={{
                          backgroundColor: '#f56a00', marginRight: '5px', cursor: 'pointer'
                        }} size="large" />
                        <div>
                          <div style={{ display: 'flex' }}>
                            <Text  onClick={() => handleClickCreator(item.id)} style={{ color: 'black', cursor: 'pointer', fontSize: '15px' }} strong>{item.name}</Text>
                            <SincePanel channels={item.channels}></SincePanel>
                            <CreatorModal creator={item} />
                          </div>
                          <div style={{ display: 'flex' }}>
                            <p style={{ color: 'black', fontSize: '10px' }}>{intToStringBigNumber(item.subs)} subs</p>
                            <Divider style={{ backgroundColor: 'black' }} type="vertical" />
                            <p style={{ color: 'black', fontSize: '10px' }}>{intToStringBigNumber(item.videos)} videos</p>
                            <Divider style={{ backgroundColor: 'black' }} type="vertical" />
                            <p style={{ color: 'black', fontSize: '10px' }}>{intToStringBigNumber(item.views)} views</p>
                          </div>
                        </div>
                      </div>
                      <div style={{ float: 'right' }}>
                        {/* <p style={{ color: 'black', fontSize: '10px' }}>Circa {parseDate(item.channel_created_at, "YYYY")}</p> */}



                      </div>
                    </div>
                  </div>
                </>
              ) :
                <AppLoading />
              }

            </Card>
          </List.Item>
        )}
      />
    </div>
  </>);
};


export default CreatorPage;
