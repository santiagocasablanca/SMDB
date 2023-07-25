import { Col, Row, Card, Table, Tag } from 'antd';
import { green, presetDarkPalettes } from '@ant-design/colors';
import { yellow } from '@ant-design/colors';
import { React, useEffect, useState } from "react"
import { getVideosFn } from "../services/videoApi.ts"
import VideoFilterPanel from './VideographyFilterPanel'
import VideographyEditPanel from './VideographyEditPanel'
import dayjs from "dayjs"
import insertCss from 'insert-css'
import variables from '../sass/antd.module.scss'
import VideographyStatsPanel from "./VideographyStatsPanel";




// .ant-input {
//   color: $coolLighterGray !important;
// } 

const Videography = () => {
  // border: 1px solid black;
  insertCss(`

  .bodyContainer {
    margin: 10px 100px auto;
  }

  .editPanel {
    background: `+ variables.sdmnBlack + `;
    color: `+ variables.onSurface + `;
  }
  .filterPanel {
    margin-top: 10px;
    background: `+ variables.richBlackSofter + `;
    color: `+ variables.onBg + `;
  }

  .table-container p {
    color: white;
  }
  
  .mb {
    margin-bottom: 30px;
  }
  
  @media (max-width: 600px) {
    .bodyContainer {
      margin: 0 20px;
    }
  }
  `);


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
      fixed: 'left',
      ellipsis: true,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      width: '35%',
      sorter: true,
      // sortDirections: ['asc', 'desc'],
      fixed: 'left',
    },
    { key: 'duration', title: 'Duration', dataIndex: 'duration', width: '7%', align: 'right', sorter: true, render: (text) => <p>{parseDuration(text)}</p> },
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
    { key: 'published_at', title: 'Published At', dataIndex: 'published_at', width: '13%', sorter: true, render: (text) => <p>{dayjs(text).format("DD MMM YYYY HH:mm:ss")}</p> },
    { key: 'views', title: 'Views', dataIndex: 'views', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'likes', title: 'Likes', dataIndex: 'likes', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
    // { key: 'dilikes', title: 'Dislikes', dataIndex: 'dislikes', width: '8%',  align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
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
    {
      key: 'locations',
      width: '10%',
      title: "Locations",
    },
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

  const parseDuration = (duration) => {
    return dayjs.duration(duration).format('HH:mm:ss')
  }


  const getVideos = useEffect(() => {
    const offset = activePage;//itemsPerPage * activePage - itemsPerPage
    let params = new URLSearchParams()
    Object.keys(columnFilter).forEach((key) => {
      params.append(key, columnFilter[key])
    });
    columnSorter &&
      columnSorter.column !== undefined &&
      params.append('sort', `${columnSorter.column}%${columnSorter.state}`);

    // filters && filters.forEach(item => {
    //   console.log('keyvalue: ' + JSON.stringify(item));
    //   params.append(item.key, item.value);
    // });

    for (const property in myFilters) {
      if (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 1)
        params.append(property, myFilters[property]);
    }

    getVideosFn(offset, itemsPerPage, params)
      .then((result) => {
        setRecords(result.results)
        result.results ? setVideos(result.videos) : setVideos([])
      })
  }, [activePage, columnFilter, columnSorter, itemsPerPage])


  const onChange = (pagination, filters, sorter, extra) => {
    const offset = pagination.current;//itemsPerPage * activePage - itemsPerPage
    let params = new URLSearchParams()

    if (sorter.hasOwnProperty("column") && sorter.order !== undefined) {
      let tempSortOrder = sorter.order == 'ascend' ? 'asc' : 'desc';
      params.append('sort', `${sorter.field}%${tempSortOrder}`);
    }

    for (const property in myFilters) {
      if (myFilters[property] && myFilters[property] != '' && myFilters[property].length >= 1)
        params.append(property, myFilters[property]);
    }

    getVideosFn(offset, pagination.pageSize, params)
      .then((result) => {
        setRecords(result.results)
        result.results ? setVideos(result.videos) : setVideos([])
      })
  };


  const [myFilters, setMyFilters] = useState({
    title: '',
    channels: [], //['Sidemen','MoreSidemen'],
    published_atRange: [],
    tags: [],
    locations: '',
    series: [],
    search: Boolean,
    category: '',
    date: null,
  });
  const filterStr = '';

  const intToStringBigNumber = num => {
    if (num == null || num == '') return '';
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
      return num;
    }
    let si = [
      { v: 1E3, s: "K" },
      { v: 1E6, s: "M" },
      { v: 1E9, s: "B" },
      { v: 1E12, s: "T" },
      { v: 1E15, s: "P" },
      { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }
    return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
  };

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
        if (newFilters[property] && newFilters[property] != '' && newFilters[property].length >= 1)
          params.append(property, newFilters[property]);
      }

      getVideosFn(offset, itemsPerPage, params)
        .then((result) => {
          setRecords(result.results)
          result.results ? setVideos(result.videos) : setVideos([])
        })

    }
    myFilters.search = false;
    setMyFilters({ ...myFilters, ...newFilters });
  };

  return (
    <>
      <div className="bodyContainer">

        <Row span="24" gutter={16}>
          <Col span="24" className="gutter-row mb">
            <VideoFilterPanel filters={myFilters} onChange={handleFilterChange} />
          </Col>
        </Row>
        <Row span="24" gutter={16}>
          <Col span="24" className="gutter-row">
            <VideographyStatsPanel />

          </Col>
        </Row>
        <Row span="24" gutter={16}>
          <Col span="24" className="gutter-row">
            {/* <Card> */}
            <div className="table-container">
              <Table columns={columns} dataSource={videos}
                scroll={{ x: 1500, y: 900 }}
                // header={() => 'Results'}
                onChange={onChange}
                rowKey={(record) => record.video_id}
                // rowSelection={rowSelection}
                expandable={{
                  expandedRowRender: (record) => <VideographyEditPanel video={record}></VideographyEditPanel>,
                  rowExpandable: (record) => record.title !== 'Not Expandable',
                  expandedRowKeys: expandedRowKeys,
                  onExpand: handleExpand
                }}
                rowClassName={rowClassName}
                size="small"
                style={{
                  controlItemBgHover: variables.primary
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

export default Videography
