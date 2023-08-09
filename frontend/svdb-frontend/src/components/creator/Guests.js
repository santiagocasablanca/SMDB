import { YoutubeOutlined } from '@ant-design/icons';
import { Col, Row, Space, Table, Tag, Typography } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import { React, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideoGuestsFn } from "../../services/videoApi.ts";
import VideographyEditPanel from './VideographyEditPanel';
import VideographyFilterPanel from './VideographyFilterPanel';

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title } = Typography;

const Guests = ({ title, _filters }) => {

  const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const defaultFilters = {
    title: '',
    channels: _filters.channels,
    published_atRange: [],
    tags: [],
    locations: '',
    series: [],
    search: false, // Set this to false by default
    category: '',
    onlyShorts: _filters.onlyShorts || false,
    excludeShorts: _filters.excludeShorts || true,
    sort: '',
    date: null,
  };

  const [myFilters, setMyFilters] = useState(_filters || defaultFilters);

  insertCss(`
    
    .creatorVideographyHeader h3 {
      color: `+ variables.sdmnBlack + `;
    }

  .ant-pagination {
    background: #202020;
    padding: 10px 5px;
    margin-top: 0px !important;
  }

  .table-container p {
    color: white;
  }

  .filterPanel {
    background: `+ variables.richBlackSofter + `;
    color: `+ variables.onBg + `;
  }
  
  .mb {
    margin-bottom: 30px;
  }
  
  @media (max-width: 600px) {
  }
  `);
  // .videographyBodyContainer {
  //   margin: 0 20px;
  // }
  // .creatorVideographyHeader {
  //   margin: 10px 0px auto;
  // }


  const [activePage, setActivePage] = useState(1)
  const [columnFilter, setColumnFilter] = useState([])
  const [columnSorter, setColumnSorter] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [videos, setVideos] = useState([])
  const [records, setRecords] = useState([])
  const [details, setDetails] = useState([])
  const columns = [
    {
      key: 'channel_title',
      dataIndex: 'channel_title',
      title: 'Channel',
      width: '10%',
      ellipsis: true,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      width: '30%',
      sorter: true
    },
    { key: 'duration_parsed', title: 'Duration', dataIndex: 'duration_parsed', width: '8%', align: 'right', sorter: true, render: (text) => <p>{displayVideoDurationFromSecondsWithLegend(text)}</p> },
    {
      key: 'serie',
      dataIndex: 'serie',
      width: '10%',
      title: "Series",
      render: (series) => (
        ((series != '' & series != null) ?
          <span>
            <Tag color={variables.sdmnPink} key={series}> {series} </Tag>
          </span>
          : '')
      ),
    },
    { key: 'published_at', title: 'Published At', dataIndex: 'published_at', width: '10%', sorter: true, render: (text) => <p>{dayjs(text).format("DD MMM YYYY")}</p> },
    { key: 'views', title: 'Views', dataIndex: 'views', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'likes', title: 'Likes', dataIndex: 'likes', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'comments', title: 'Comments', dataIndex: 'comments', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
    {
      key: 'tags',
      width: '10%',
      title: "Tags",
      dataIndex: 'tags',
      render: (tags) => (
        (
          Array.isArray(tags) ?
            <span>
              {tags.map((tag) => {
                // let color = tag.length > 5 ? variables.sdmnYellow : 'green';
                return (
                  <Tag color={variables.sdmnBlack} key={tag}>
                    {tag}
                  </Tag>
                );
              })}
            </span> : ''
        )
      ),
    },
    // {
    //   key: 'locations',
    //   width: '10%',
    //   title: "Locations",
    // },
    // {
    //   key: 'cast',
    //   title: "Cast",
    //   dataIndex: 'cast',
    //   render: (tags) => (
    //     <span>
    //       {tags.map((tag) => {
    //         let color = tag.length > 5 ? 'geekblue' : 'green';
    //         // if (tag === 'loser') {
    //         //   color = 'volcano';
    //         // }
    //         return (
    //           <Tag color={color} key={tag}>
    //             {tag}
    //           </Tag>
    //         );
    //       })}
    //     </span>
    //   ),
    // },
  ]


  useEffect(() => {

    async function fetchData() {
      // console.log(myFilters);
      const filtersFromQueryParams = {
        title: searchParams.get("title") || "",
        channels: searchParams.getAll("channels") || [_filters.channels],
        published_atRange: searchParams.getAll("published_atRange") || [],
        tags: searchParams.getAll("tags") || [],
        locations: searchParams.get("locations") || "",
        series: searchParams.getAll("series") || [],
        search: searchParams.get("search") === "true",
        category: searchParams.get("category") || "",
        onlyShorts: searchParams.get("onlyShorts") === "false",
        excludeShorts: searchParams.get("excludeShorts") === "true",
        sort: searchParams.get("sort") || "",
        date: searchParams.get("date") || null,
      };
      setMyFilters(filtersFromQueryParams);
      const offset = activePage;//itemsPerPage * activePage - itemsPerPage
      let params = new URLSearchParams()
      Object.keys(columnFilter).forEach((key) => {
        params.append(key, columnFilter[key])
      });
      columnSorter &&
        columnSorter.column !== undefined &&
        params.append('sort', `${columnSorter.column}%${columnSorter.state}`);

      for (const property in myFilters) {
        if (typeof myFilters[property] === 'boolean' || (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 0))
          params.append(property, myFilters[property]);
      }
      // console.log(myFilters);
      await getVideoGuestsFn(offset, itemsPerPage, params)
        .then((result) => {
          setRecords(result.results)
          result.results ? setVideos(result.videos) : setVideos([])
        })
    }
    fetchData();
  }, [_filters, location.search, activePage, itemsPerPage])
  // columnFilter, columnSorter

  const onChange = (pagination, filters, sorter, extra) => {
    const offset = pagination.current;//itemsPerPage * activePage - itemsPerPage
    let params = new URLSearchParams()

    if (sorter.hasOwnProperty("column") && sorter.order !== undefined) {
      let tempSortOrder = sorter.order == 'ascend' ? 'asc' : 'desc';
      params.append('sort', `${sorter.field}%${tempSortOrder}`);
    }

    for (const property in _filters) {
      if (typeof _filters[property] === 'boolean' || (_filters[property] && _filters[property] != '' && _filters[property].length > 0))
        params.append(property, _filters[property]);
    }

    getVideoGuestsFn(offset, pagination.pageSize, params)
      .then((result) => {
        setRecords(result.results)
        result.results ? setVideos(result.videos) : setVideos([])
      })
  };
  const filterStr = '';

  const isRowExpanded = (record) => expandedRowKeys.includes(record.video_id);

  const rowClassName = (record, index) => {
    return isRowExpanded(record) ? 'expanded-row' : '';
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpand = (expanded, record) => {
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.video_id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.video_id));
    }
  };

  // Function to update the filter values
  const handleFilterChange = (newFilters) => {
    if (newFilters.search) {
      const offset = activePage;//itemsPerPage * activePage - itemsPerPage
      let params = new URLSearchParams()
      Object.keys(columnFilter).forEach((key) => {
        params.append(key, columnFilter[key])
      });
      columnSorter &&
        columnSorter.column !== undefined &&
        params.append('sort', `${columnSorter.column}%${columnSorter.state}`);

      for (const property in newFilters) {
        if (typeof newFilters[property] === 'boolean' || (newFilters[property] && newFilters[property] != '' && newFilters[property].length > 0))
          params.append(property, newFilters[property]);
      }

      getVideoGuestsFn(offset, itemsPerPage, params)
        .then((result) => {
          setRecords(result.results)
          result.results ? setVideos(result.videos) : setVideos([])
        })

    }
    myFilters.search = false;
    console.log('just for be sure')
    setMyFilters({ ...myFilters, ...newFilters });
  };


  return (
    <>
      <div className="">

        <Row className="creatorVideographyHeader">
          <Col span="24">
            <Title level={3}><Space><YoutubeOutlined /> {title ? title : 'Videography'}</Space></Title>
          </Col>
          <Col span="24">
            <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} />
          </Col>
        </Row>
        {/* 
        <Row span="24" gutter={16}>
          <Col span="24" className="gutter-row">
            <VideographyStatsPanel />

          </Col>
        </Row> 
        */}
        <br></br>
        <Row gutter={16}>
          <Col span="24" className="gutter-row">
            {/* <Card> */}
            <div className="table-container">
              <Table columns={columns} dataSource={videos}
                scroll={{ x: 1460, y: 900 }}
                // header={() => 'Results'}
                onChange={onChange}
                rowKey={(record) => record.video_id}
                // rowSelection={rowSelection}
                expandable={{
                  expandedRowRender: (record) => <VideographyEditPanel _video={record}></VideographyEditPanel>,
                  rowExpandable: (record) => record.title !== 'Not Expandable',
                  expandedRowKeys: expandedRowKeys,
                  onExpand: handleExpand
                }}
                rowClassName={rowClassName}
                size="small"
                style={{
                  controlItemBgHover: variables.primary,
                  //       itemActiveBg: variables.primary,
                  // itemActiveBgDisabled: variables.sdmnBlack,
                  // itemActiveColorDisabled: variables.coolGray,
                  // itemBg: variables.primary,
                  // itemInputBg: variables.primary,
                  // itemLinkBg: variables.sdmnBlack,
                  // colorLink: variables.smdnWhite,

                  // colorBgContainer: variables.sdmnBlack,
                  // colorBgContainerDisabled: variables.sdmnBlack,
                  // colorBgTextActive: variables.primary,
                  // colorBgTextHover: variables.sdmnBlack,
                  // colorBorder: variables.sdmnBlack,

                  // colorPrimaryBorder: variables.sdmnBlack,
                  // colorPrimaryHover: variables.sdmnBlack,
                  // controlOutline: variables.sdmnBlack,
                  // colorText: variables.sdmnBlack,
                }}
                pagination={{
                  total: records,
                  showQuickJumper: true,
                  defaultPageSize: 10,
                  showSizeChanger: true,
                  pageSizeOptions: ["10", "25", "50"]
                }}
              />
            </div>
            {/* </Card> */}
          </Col>
        </Row>
      </div>
    </>
  )
}

export default Guests;
