
import { YoutubeOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Space, Spin, Typography, List, Table, Timeline, Tag, Grid, Drawer, Image } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn, fetchChannelYearReport } from "../services/channelApi.ts";

const { Title, Text, Paragraph, Link } = Typography;
const { useBreakpoint } = Grid;

const Year23Overview = ({ selectedCreators, selectedChannels }) => {
  const navigate = useNavigate();
  const { xs } = useBreakpoint(); // xs is one of the elements returned if screenwidth exceeds 991
  const myDrawerSize = xs ? 'small' : 'large';

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [top100videos, setTop100videos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [creators, setCreators] = useState([]);


  const [open, setOpen] = useState(false);


  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();


  useEffect(() => {

    async function fetchData() {
      if (selectedChannels.length > 0) {
        const channelIds = selectedChannels.map(item => { return item.channel_id; });
        let _params = new URLSearchParams();
        _params.append("year", "2023")
        _params.append("creators", selectedCreators.map(it => {
          return it.id
        }));
        _params.append("channels", channelIds);

        await fetchChannelYearReport(_params).then((result) => {

          const groupedData = result.results.reduce((result, item) => {
            const creatorId = item.creator_id;

            if (!result[creatorId]) {
              // console.log('in');
              result[creatorId] = {
                creator_id: item.creator_id,
                profile_picture: item.profile_picture,
                name: item.name,
                _first_subs: parseInt(item._first_subs),
                subs: parseInt(item.subs),
                total_subs_increase: parseInt(item.total_subs_increase),
                subs_growth_percentage: parseFloat(item.subs_growth_percentage),
                videos_published: parseInt(item.videos_published),
                videos_views: item.videos_views ? parseInt(item.videos_views) : 0,
                views: parseInt(item.views),
                _first_views: parseInt(item._first_views),
                total_views_increase: parseInt(item.total_views_increase),
                views_growth_percentage: parseFloat(item.views_growth_percentage),
                channels: []
              };
              result[creatorId].channels.push(item);

            } else {
              // console.log('else');
              result[creatorId]._first_subs += parseInt(item._first_subs) || 0;
              result[creatorId].subs += parseInt(item.subs) || 0;
              result[creatorId].total_subs_increase += parseInt(item.total_subs_increase) || 0;
              result[creatorId].subs_growth_percentage += parseFloat(item.subs_growth_percentage) || 0;
              result[creatorId].videos_published += parseInt(item.videos_published) || 0;
              result[creatorId].videos_views += item.videos_views ? parseInt(item.videos_views || 0) : 0;
              result[creatorId].views += parseInt(item.views) || 0;
              result[creatorId]._first_views += parseInt(item._first_views) || 0;
              result[creatorId].total_views_increase += parseInt(item.total_views_increase) || 0;
              result[creatorId].views_growth_percentage += parseFloat(item.views_growth_percentage) || 0;

              result[creatorId].channels.push(item);
            }

            return result;
          }, {});
          // Normalize the percentages
          Object.values(groupedData).forEach((creator) => {
            const numChannels = creator.channels.length || 1; // Ensure it's at least 1 to avoid division by zero
            creator.subs_growth_percentage /= numChannels;
            creator.views_growth_percentage /= numChannels;
            const sC = selectedCreators.find((t) => t.id === creator.creator_id);

            
            creator.videos_directed = sC?.videosDirected || 0;
            creator.videos_casted = sC?.videosCasted || 0;

            // creator.videos_directed = sC?.videosDirected.filter(t => channelIds.includes(t.channel_id) ) || [];
            // creator.videos_casted = sC?.videosCasted.filter(t => channelIds.includes(t.channel_id)) || [];
          });

          // console.log(Object.values(groupedData))
          setCreators(Object.values(groupedData));
          setChannels(result.results);
          setIsLoaded(true);
        });
      }
    }
    fetchData();
  }, [selectedChannels]);

  const expandedRowRender = (record) => {
    const columns = [
      {
        title: 'Channel',
        dataIndex: 'title',
        key: 'title',
        width: 150,
        render: (text, record) => <span style={{ cursor: 'pointer' }} onClick={() => goToChannel(record.channel_id)}><Avatar src={<img src={record.logo_url} alt={record.logo_url} />} /> {text} </span>,
      },
      {
        title: 'Initial Subs',
        dataIndex: '_first_subs',
        key: '_first_subs',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
        sorter: (a, b) => a._first_subs - b._first_subs,
      },
      {
        title: 'Subs',
        dataIndex: 'subs',
        key: 'subs',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
        sorter: (a, b) => a.subs - b.subs,
      },
      {
        title: 'Subs Increase',
        dataIndex: 'total_subs_increase',
        key: 'total_subs_increase',
        sorter: (a, b) => a.subs_growth_percentage - b.subs_growth_percentage,
        render: (val, record) => <span style={{ color: record.subs_growth_percentage > 0 ? variables.freq5 : 'red' }}>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.subs_growth_percentage)).toFixed(1)}%)</Text></span>,
      },
      {
        title: 'Videos',
        dataIndex: 'videos_published',
        key: 'videos_published',
        defaultSortOrder: 'descend',
        sorter: (a, b) => a.videos_published - b.videos_published,
        render: (val, record) => <Link onClick={() => { handleVideosClick(record.channel_id) }} target="_blank">{intToStringBigNumber(val)}</Link>,

      },
      {
        title: 'Video Views',
        dataIndex: 'videos_views',
        key: 'videos_views',
        sorter: (a, b) => a.videos_views - b.videos_views,
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Initial Views',
        dataIndex: '_first_views',
        key: '_first_views',
        sorter: (a, b) => a._first_views - b._first_views,
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Total Views',
        dataIndex: 'views',
        key: 'views',
        sorter: (a, b) => a.views - b.views,
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Views Increase',
        dataIndex: 'total_views_increase',
        key: 'total_views_increase',
        sorter: (a, b) => a.views_growth_percentage - b.views_growth_percentage,
        render: (val, record) => <span style={{ color: record.views_growth_percentage > 0 ? variables.freq5 : 'red' }} >{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.views_growth_percentage)).toFixed(1)}%)</Text></span>,
      },
    ];

    const rowData = record;
    // console.log(rowData.channels);

    return <Table columns={columns} dataSource={rowData.channels} rowKey={(record) => record.channel_id} pagination={false} size="small" />;
  };

  const handleClickVideo = (id) => {
    // console.log(id);
    const url = '/video/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const goToChannel = (id) => {
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const goToCreator = (id) => {
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const handleVideosClick = (_channels) => {
    const url = '/videography';
    // const [paramsRecent, setParamsRecent] = useState({ sort: "published_at%desc" });
    console.log(_channels);
    const filter = {
      channels: _channels,
      publishedAtRange: [dayjs('2023-01-01').format(), dayjs('2024-01-01').format()],
      sort: "published_at%asc"
    };
    navigate(url, { state: { filter }, preventScrollReset: true });
  }

  const handleVideosDirectedClick = (_creator_id, _channels) => {
    const url = '/videography';
    const filter = {
      // channels: _channels,
      directedBy: [_creator_id],
      publishedAtRange: [dayjs('2023-01-01').format(), dayjs('2024-01-01').format()],
      sort: "published_at%asc"
    };
    navigate(url, { state: { filter }, preventScrollReset: true });
  }

  const handleVideosCastClick = (_creator_id, _channels) => {
    const url = '/videography';
    const filter = {
      // channels: _channels,
      cast: [_creator_id],
      publishedAtRange: [dayjs('2023-01-01').format(), dayjs('2024-01-01').format()],
      sort: "published_at%asc"
    };
    navigate(url, { state: { filter }, preventScrollReset: true });
  }

  insertCss(`
  .yearly-overview-table p {
    color: white !important;
  }
  
  `
  );

  const columns = [
    {
      title: 'Creator',
      dataIndex: 'profile_picture',
      key: 'profile_picture',
      width: '25%',
      render: (url, record) => <span style={{ cursor: 'pointer' }} onClick={() => goToCreator(record.creator_id)}><Avatar src={<img src={url} alt={url} />} /> {record.name}</span>,
    },
    {
      title: 'Initial Subs',
      dataIndex: '_first_subs',
      key: '_first_subs',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
      sorter: (a, b) => a._first_subs - b._first_subs,
    },
    {
      title: 'Subs',
      dataIndex: 'subs',
      key: 'subs',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
      sorter: (a, b) => a.subs - b.subs,
    },
    {
      title: 'Subs Increase',
      dataIndex: 'total_subs_increase',
      key: 'total_subs_increase',
      render: (val, record) => <span style={{ color: record.subs_growth_percentage > 0 ? variables.freq5 : 'red' }}>{intToStringBigNumber(val)}  <Text type="secondary">({(parseFloat(record.subs_growth_percentage)).toFixed(1)}%)</Text></span>,
      //
      sorter: (a, b) => a.subs_growth_percentage - b.subs_growth_percentage,
    },
    {
      title: 'Videos',
      dataIndex: 'videos_published',
      key: 'videos_published',
      render: (val, record) => <Link onClick={() => { handleVideosClick(record.channels.map(channel => channel.channel_id)) }} target="_blank">{intToStringBigNumber(val)}</Link>,
      sorter: (a, b) => a.videos_published - b.videos_published,
    },
    {
      title: 'Video Views',
      dataIndex: 'videos_views',
      key: 'videos_views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
      sorter: (a, b) => a.videos_views - b.videos_views,
    },
    {
      title: 'Initial Views',
      dataIndex: '_first_views',
      key: '_first_views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
      sorter: (a, b) => a._first_views - b._first_views,
    },
    {
      title: 'Total Views',
      dataIndex: 'views',
      key: 'views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
      sorter: (a, b) => a.views - b.views,
    },
    {
      title: 'Views Increase',
      dataIndex: 'total_views_increase',
      key: 'total_views_increase',
      render: (val, record) => <span style={{ color: record.views_growth_percentage > 0 ? variables.freq5 : 'red' }}>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.views_growth_percentage)).toFixed(1)}%)</Text></span>,
      // 
      sorter: (a, b) => a.views_growth_percentage - b.views_growth_percentage,
    },
    {
      title: 'Videos Directed',
      dataIndex: 'videos_directed',
      key: 'videos_directed',
      render: (val, record) => <Link onClick={() => { handleVideosDirectedClick(record.creator_id, record.channels.map(channel => channel.channel_id)) }} target="_blank">{intToStringBigNumber(val)}</Link>,
      // 
      sorter: (a, b) => a.videos_directed.length - b.videos_directed.lenght,
    },
    {
      title: 'Videos Casted',
      dataIndex: 'videos_casted',
      key: 'videos_casted',
      render: (val, record) => <Link onClick={() => { handleVideosCastClick(record.creator_id, record.channels.map(channel => channel.channel_id)) }} target="_blank">{intToStringBigNumber(val)}</Link>,
      // 
      sorter: (a, b) => a.videos_casted.length - b.videos_casted.lenght,
    },

  ];

  return (<>
    {isLoaded ?
      (
        <>
          <div className="year23TimelineContainer">
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                <Title style={{ color: 'black', justify: 'center' }} level={2}><YoutubeOutlined style={{ marginRight: '5px' }} /> Overview of 2023</Title>

                <Space size={[6, 8]} wrap>
                  <Paragraph
                    ellipsis={
                      {
                        rows: 2,
                        expandable: true,
                        symbol: 'more',
                      }
                    }
                  >
                    An overview of the year for all the creators

                  </Paragraph>
                </Space>
              </Col>
            </Row>
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                <Table
                  pagination={false}
                  className="yearly-overview-table"
                  // style={{ colorText: 'white' }}
                  width="100%"
                  scroll={{ x: 600 }}
                  columns={columns}

                  dataSource={creators}
                  rowKey={(record) => record.creator_id}
                  expandable={{
                    expandedRowRender
                  }}
                  size="small"
                >
                </Table>
              </Col>
            </Row>
            <br></br>
          </div>

        </>
      ) : (
        <Row justify="center" style={{ marginTop: '70px' }}>
          <Spin spining="true" tip="Loading..." size="large" >
            <div className="spinContent" />
          </Spin>
        </Row>
      )
    }
  </>);
};


export default Year23Overview;
