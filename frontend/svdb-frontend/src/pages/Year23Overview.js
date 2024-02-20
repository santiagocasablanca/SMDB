
import { EyeOutlined, LikeOutlined, LineChartOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Space, Spin, Typography, List, Table, Timeline, Tag, Grid, Drawer, Image } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalHighlightedList from '../components/video/HorizontalHighlightedList';
import HorizontalShortsList from '../components/video/HorizontalShortsList';
import VideoPreviewForHighlight from '../components/video/VideoPreviewForHighlight';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn, fetchChannelYearReport } from "../services/channelApi.ts";
import { getVideosFn, getVideoFn } from "../services/videoApi.ts";
// import VideoDrawer from './VideoDrawer';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import CreatorStatsPanel from '../components/creator/CreatorStatsPanel';

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;
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
        let _params = new URLSearchParams();
        _params.append("year", "2023")
        _params.append("creators", selectedCreators.map(it => {
          return it.id
        }));
        _params.append("channels", selectedChannels.map(item => { return item.channel_id; }));

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
                subs_growth_percentage:  parseFloat(item.subs_growth_percentage),
                videos_published: parseInt(item.videos_published),
                videos_views: parseInt(item.videos_views),
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
              result[creatorId].subs_growth_percentage +=  parseFloat(item.subs_growth_percentage) || 0;
              result[creatorId].videos_published += parseInt(item.videos_published) || 0;
              result[creatorId].videos_views += parseInt(item.videos_views || 0);
              result[creatorId].views += parseInt(item.views) || 0;
              result[creatorId]._first_views += parseInt(item._first_views) || 0;
              result[creatorId].total_views_increase += parseInt(item.total_views_increase) || 0;
              result[creatorId].views_growth_percentage += parseFloat(item.views_growth_percentage) || 0;

              result[creatorId].channels.push(item);
            }

            return result;
          }, {});
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
        render: (text, record) => <span><Avatar src={<img src={record.url} alt={record.url} />} /> {text} </span>,
      },
      {
        title: 'Initial Subs',
        dataIndex: '_first_subs',
        key: '_first_subs',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Subs',
        dataIndex: 'subs',
        key: 'subs',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Subs Increase',
        dataIndex: 'total_subs_increase',
        key: 'total_subs_increase',
        render: (val, record) => <p>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.subs_growth_percentage)).toFixed(1)}%)</Text></p>,
      },
      {
        title: 'Videos',
        dataIndex: 'videos_published',
        key: 'videos_published',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Video Views',
        dataIndex: 'videos_views',
        key: 'videos_views',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Initial Views',
        dataIndex: '_first_views',
        key: '_first_views',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Total Views',
        dataIndex: 'views',
        key: 'views',
        render: (val) => <p>{intToStringBigNumber(val)}</p>,
      },
      {
        title: 'Views Increase',
        dataIndex: 'total_views_increase',
        key: 'total_views_increase',
        render: (val, record) => <p>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.views_growth_percentage)).toFixed(1)}%)</Text></p>,
      },
    ];

    const rowData = record;
    console.log(rowData.channels);

    return <Table columns={columns} dataSource={rowData.channels} rowKey={(record) => record.channel_id} pagination={false} size="small" />;
  };

  const handleClickVideo = (id) => {
    console.log(id);
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

  insertCss(`  
  
  `
  );

  const columns = [
    {
      title: 'Creator',
      dataIndex: 'profile_picture',
      key: 'profile_picture',
      width: '30%',
      render: (url, record) => <span><Avatar src={<img src={url} alt={url} />} /> {record.name}</span>,
    },
    {
      title: 'Initial Subs',
      dataIndex: '_first_subs',
      key: '_first_subs',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Subs',
      dataIndex: 'subs',
      key: 'subs',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Subs Increase',
      dataIndex: 'total_subs_increase',
      key: 'total_subs_increase',
      render: (val, record) => <p>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.subs_growth_percentage)).toFixed(1)}%)</Text></p>,
    },
    {
      title: 'Videos',
      dataIndex: 'videos_published',
      key: 'videos_published',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Video Views',
      dataIndex: 'videos_views',
      key: 'videos_views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Initial Views',
      dataIndex: '_first_views',
      key: '_first_views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Total Views',
      dataIndex: 'views',
      key: 'views',
      render: (val) => <p>{intToStringBigNumber(val)}</p>,
    },
    {
      title: 'Views Increase',
      dataIndex: 'total_views_increase',
      key: 'total_views_increase',
      render: (val, record) => <p>{intToStringBigNumber(val)} <Text type="secondary">({(parseFloat(record.views_growth_percentage)).toFixed(1)}%)</Text></p>,
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
                <Table size='large'
                  pagination={false}
                  // className="channel-table"
                  // style={{width: '100%'}}
                  width="100%"
                  scroll={{ x: 600 }}
                  columns={columns}

                  dataSource={creators}
                  rowKey={(record) => record.creator_id}
                  expandable={{
                    expandedRowRender
                  }}
                  size="small"
                // summary={(pageData) => {
                //   let totalSubs = 0;
                //   let totalVideos = 0;
                //   let totalViews = 0;
                //   let avgViews = 0;
                //   let mostViewed = 0;
                //   let totalLikes = 0;
                //   let avgLikes = 0;
                //   let mostLiked = 0;
                //   let duration = 0;
                //   let avgDuration = 0;
                //   let longest = 0;
                //   // Avg Views	Most Viewed	Total Likes	Avg Likes	Most Liked	Play time	Avg Video Duration	Longest
                //   let n_channels = pageData.length;
                //   pageData.forEach(({ subs, videos, views, stats }) => {
                //     totalSubs += parseInt(subs);
                //     totalVideos += parseInt(videos);
                //     totalViews += parseInt(views);
                //     totalLikes += parseInt(stats?.likes.value);
                //     duration += parseInt(stats?.duration.value);
                //     mostViewed = (parseInt(stats?.views.most) > mostViewed ? stats?.views.most : mostViewed);
                //     mostLiked = (parseInt(stats?.likes.most) > mostLiked ? stats?.likes.most : mostLiked);
                //     longest = (parseInt(stats?.duration.most) > longest ? stats?.duration.most : longest);
                //   });
                //   avgLikes = (totalLikes / totalVideos);
                //   avgViews = (totalViews / totalVideos);
                //   avgDuration = (duration / totalVideos);
                //   return (
                //     <>
                //       <Table.Summary.Row>
                //         <Table.Summary.Cell index={0}></Table.Summary.Cell>
                //         <Table.Summary.Cell index={1}>Totals</Table.Summary.Cell>
                //         <Table.Summary.Cell index={2}>
                //           {intToStringBigNumber(totalSubs)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={3}>
                //           {intToStringBigNumber(totalVideos)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={4}>
                //           {intToStringBigNumber(totalViews)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={5}>
                //           {intToStringBigNumber(avgViews)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={6}>
                //           {intToStringBigNumber(mostViewed)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={7}>
                //           {intToStringBigNumber(totalLikes)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={8}>
                //           {intToStringBigNumber(avgLikes)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={9}>
                //           {intToStringBigNumber(mostLiked)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={10}>
                //           {displayDurationFromSeconds(duration)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={11}>
                //           {displayVideoDurationFromSeconds(avgDuration)}
                //         </Table.Summary.Cell>
                //         <Table.Summary.Cell index={12}>
                //           {displayVideoDurationFromSeconds(longest)}
                //         </Table.Summary.Cell>
                //       </Table.Summary.Row>

                //     </>
                //   );


                // }}
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
