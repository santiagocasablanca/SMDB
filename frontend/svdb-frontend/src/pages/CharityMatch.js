import { CommentOutlined, EyeOutlined, LikeOutlined, LineChartOutlined, SearchOutlined } from '@ant-design/icons';
import { Carousel, Col, Row, Divider, Spin, Typography, Card, Image, List, Input, Space, Button, Table, Popover, Avatar, Tooltip } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getVideosFn, getHighlightedVideosFn } from "../services/videoApi.ts";
import LatestVideosGrowthLine from '../components/graphs/LatestVideosGrowthLine';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import VideoPreview from '../components/video/VideoPreview';
import Locations from '../components/video/Locations';
import { Column } from '@ant-design/plots';

const { Title, Text, Link } = Typography;

const CharityMatch = () => {
  const navigate = useNavigate();

  const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSecondsWithLegend } = useFormatter();
  const [isLoaded, setIsLoaded] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [videos, setVideos] = useState([]);
  const [filters, setFilters] = useState({ channels: [], published_atRange: [] });
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search title`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };


  useEffect(() => {

    async function fetchData() {

      let _params = new URLSearchParams();
      _params.append("sort", "views%desc")
      _params.append("title", "charity%match")
      // _params.append("publishedAtRange", range)
      await getVideosFn(1, 1000, _params)
        .then((result) => {
          // console.log(result);
          setVideos(result.videos);
          // Use reduce to group by year and sum views
          const groupedByYearWithSum = result.videos.reduce((result, item) => {
            // Get the year from the published_at date
            const year = new Date(item.published_at).getFullYear();

            // If the year key doesn't exist in the result object, create it and initialize the views sum and an empty videos array
            if (!result[year]) {
              result[year] = {
                year: parseInt(year, 10),
                views: 0, // Initialize the views sum to 0
                videos: [], // Initialize an empty videos array
              };
            }

            // Add the views of the current item to the viewsSum
            result[year].views += parseInt(item.views, 10);

            // Add the current video to the videos array of the corresponding year
            result[year].videos.push(item);

            return result;
          }, {});

          // Convert the grouped data to the desired format
          // const formattedData = Object.keys(groupedByYearWithSum).map((year) => ({
          //   year: parseInt(year, 10),
          //   views: groupedByYearWithSum[year],
          // }));
          const formattedData = Object.values(groupedByYearWithSum);




          // console.log(formattedData);
          setColumnData(formattedData);

          setIsLoaded(true);
        });
    }
    fetchData();
  }, []);

  insertCss(`  
  .ant-pagination {
    background: #202020;
    padding: 10px 5px;
    margin-top: 0px !important;
  }

 
  :where(.css-dev-only-do-not-override-tyywrs).ant-table-wrapper .ant-table-tbody>tr>th, :where(.css-dev-only-do-not-override-tyywrs).ant-table-wrapper .ant-table-tbody>tr>td, :where(.css-dev-only-do-not-override-tyywrs).ant-table-wrapper tfoot>tr>th, :where(.css-dev-only-do-not-override-tyywrs).ant-table-wrapper tfoot>tr>td {
    padding: 0px !important;
  }

  .charityMatchContainer p {
    color: white;
  }

  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  .homeHeaderPanel {
    margin: 20px 100px auto;
    margin-bottom: 20px;
    
    color: black;
  }

  .homeHeaderPanel h3 {
    color: black;
  }
  .homeHeaderPanel span {
    color: black;
    gap: 5px;
  }

  .charityMatchContainer {
    margin: 0 100px auto;
  }

  :where(.css-dev-only-do-not-override-kda5v0).ant-carousel .slick-dots-bottom {
    bottom: 55px !important;
  }
  @media (max-width: 1400px) {
    .charityMatchContainer {
      margin: 0 20px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }
    .hide {
      display: none;
    }
    .show {
      display: initial !important;
    }
  }

  @media (max-width: 768px) {
    .hide-on-small-screen {
      display: none;
    }
  }

  @media (max-width: 600px) {
    .charityMatchContainer {
      margin: 0 20px;
    }
    .homeHeaderPanel {
      margin: 10px 30px auto;
    }

    :where(.css-dev-only-do-not-override-kda5v0).ant-carousel .slick-dots-bottom {
      bottom: 67px !important;
    }
  }
  `
  );

  const handleClickVideo = (id) => {
    // console.log(id);
    const url = '/video/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }


  const columns = [
    // {
    //   key: 'channel_title',
    //   dataIndex: 'channel_title',
    //   title: 'Channel',
    //   width: '10%',
    //   ellipsis: true,
    // },
    {
      key: 'rating',
      dataIndex: 'video_id',
      title: 'Video',
      width: '20%',
      render: (video_id) => (
        (
          <span>
            <Image style={{ borderRadius: '8px', objectFit: 'cover', width: '300px' }} src={getVideoById(video_id).url} width='300px' height='168px' preview={false} />
            <div style={{ color: 'white', fontSize: '10px', top: '3px', position: 'absolute', right: '5px', backgroundColor:  'rgba(0, 0, 0, 0.5)', padding: '0 4px',  borderRadius: '8px' }}>
              <Space>
                <p style={{ color: 'white', fontSize: '12px', marginBottom: '0px' }}>{dayjs(getVideoById(video_id).published_at).format("DD MMM YYYY")}</p>
                <Divider type="vertical" />
                <VideoRate _video={getVideoById(video_id)} />
              </Space>
            </div>
            <Tooltip title={getVideoById(video_id).channel.title}><Avatar src={getVideoById(video_id).channel.logo_url} style={{
                        backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px', width: '40px', height: '40px'
                    }} /></Tooltip>
            {/* <VideoPreview _video={getVideoById(video_id)}/> */}
            {/* <VideoRate _video={getVideoById(video_id)} small={true} /> */}
          </span>)
      ),
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      render: (title) => (
        <span style={{ margin: '5px' }}>{title}</span>
      ),
      width: '50%',
      ...getColumnSearchProps('title')
    },
    { key: 'duration_parsed', title: 'Duration', width: '6%', dataIndex: 'duration_parsed', align: 'right', render: (text) => <p>{displayVideoDurationFromSecondsWithLegend(text)}</p> },
    {
      key: 'published_at', title: 'Published At', className: 'hide', width: '10%', dataIndex: 'published_at', align: 'right', render: (text) => <p style={{ whiteSpace: 'nowrap' }}>{dayjs(text).format("DD MMM YYYY")}</p>,
      sorter: (a, b) => {
        // Convert the dates to JavaScript Date objects for comparison
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);

        return dateA - dateB; // Ascending order
        // To reverse the order, use: return dateB - dateA;
      },
    },
    {
      key: 'views', title: 'Views', dataIndex: 'views',  align: 'right', width: '5%', render: (text) => <p>{intToStringBigNumber(text)}</p>, defaultSortOrder: 'descend',
      sorter: (a, b) => a.views - b.views,
    },
    {
      key: 'likes', title: 'Likes', dataIndex: 'likes', align: 'right', width: '5%', render: (text) => <p>{intToStringBigNumber(text)}</p>,
      sorter: (a, b) => a.likes - b.likes,
    },
    {
      key: 'comments', title: 'Comments', dataIndex: 'comments',  align: 'right', width: '5%', render: (text) => <p>{intToStringBigNumber(text)}</p>,
      sorter: (a, b) => a.comments - b.comments,
    },
    {
      key: 'locations',
      // width: '10%',
      align: 'right',
      // className: 'hide',
      title: "Locations",
      dataIndex: 'locations',
      render: (locations) => (
        (
          <span style={{ marginLeft: '5px' }}>
            <Locations video={{ locations: locations }} _showLabel={false} />
          </span>
        )
      ),
    }
  ]

  const getVideoById = (id) => {
    return videos.find(it => it.video_id === id);
  }

  // <p>${item.title}</p> 
  const config = {
    data: columnData,
    xField: 'year',
    yField: 'views',
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      views: {
        alias: 'Views',
      },
      year: {
        alias: 'Year',
      },
    },
    tooltip: {
      customContent: (title, items) => {
        // console.log(title, JSON.stringify(items));
        return (
          <div style={{ width: '300px' }}>
            <List size="small"
              grid={{
                gutter: 0,
                column: 5
              }}
              header={<span><span style={{ fontSize: '16px' }}>{title}</span> <span style={{ float: 'right' }}>{items[0]?.data?.videos?.length} Videos Published ({intToStringBigNumber(items[0]?.data?.views)} Views)</span></span>}
              // bodyStyle={{ padding: '3px' }}
              dataSource={items[0]?.data?.videos}
              renderItem={(item) =>
                <List.Item style={{ padding: '0px', marginBlockEnd: '0px', itemPadding: '0px' }}>
                  <span>
                    <Image src={item.url} style={{ objectFit: 'cover' }} width='100%' height='30px' preview={false}></Image>
                  </span>
                </List.Item>}>

            </List>

            <br></br>
          </div>


        );
      }
    }
  };

  const handleClick = () => {
    const url = '/videography';
    let filter = { sort: "views%desc", title: "charity match" };
    navigate(url, { state: { filter } });
  }

  return (
    <>
      <br></br>
      <div className="homeHeaderPanel">
        <Title style={{ color: 'black' }} level={3}>Sidemen Charity Match</Title>
        <Text>The Sidemen Charity Match 2023 (and other editions) in stats </Text>
      </div>
      <br></br>
      <Link style={{ marginLeft: '100px' }} target="_blank" href="https://www.teenagecancertrust.org/events/music-and-entertainment/sidemen-charity-match">Read More about the event</Link>
      {isLoaded ?
        (
          <>
            <div className="charityMatchContainer">
            
              <br></br>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <Column {...config} />
                </Col>
              </Row>

              
              <br></br>
              <br></br>
              <Row gutter={[16, 16]}>
                <Col span={24}>
                  <LatestVideosGrowthLine title="Charity Match Videos Views Growth" filter={{ videos: videos.slice(0, 15) }} start={0.6} />
                </Col>
              </Row>

              <br></br>
              <br></br>

              <Row>
                <Col span={24}>
                  <Title style={{ color: "black" }} level={5}>Charity Match related published videos</Title>
                  {/* <Button onClick={() => handleClick()} style={{ float: 'right' }} type="link">Go to</Button> */}
                </Col>
              </Row>
              <Row className="hide-on-small-screen">
                <Col span={24}>
                  <Table columns={columns} dataSource={videos}
                    rowKey={(record) => record.video_id}
                    scroll={{ x: 'auto' }}
                    onRow={(record, rowIndex) => {
                      return {
                        // onClick: (event) => {}, // click row
                        onDoubleClick: (event) => { handleClickVideo(record.video_id) }, // double click row
                        // onContextMenu: (event) => {}, // right button click row
                        // onMouseEnter: (event) => {}, // mouse enter row
                        // onMouseLeave: (event) => {}, // mouse leave row
                      };
                    }} />
                </Col>
              </Row>


            </div>

          </>
        ) : (
          <Row justify="center">
            <Spin />
          </Row>
        )
      }
    </>);
};


export default CharityMatch;
