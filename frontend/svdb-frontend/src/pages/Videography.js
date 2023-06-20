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
  insertCss(`

  .filterPanel {
    background: `+ variables.sdmnPink + `;
    color: `+ variables.onBg + `;
    border: 1px solid black;
  }

  .editPanel {
    background: `+ variables.sdmnBlack + `;
    color: `+ variables.onSurface + `;
  }

  :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table.ant-table-small .ant-table-expanded-row-fixed {
    background: `+ variables.sdmnWhite + `;
    color: `+ variables.onBg + `;
  }
  :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-expanded-row-fixed {
    margin: auto;
    padding: 0;
  }

    .expanded-row {
      background-color: `+ variables.sdmnYellow + `;
      color: `+ variables.onBg + `;
    }

    

    :where(.css-dev-only-do-not-override-yp4umk).ant-collapse>.ant-collapse-item >.ant-collapse-header {
      color: `+ variables.onBg + `;

    }
    .ant-table-wrapper .ant-table-row-expand-icon {
      border-color: `+ variables.onSurface + `;
    }


    .ant-collapse>.ant-collapse-item >.ant-collapse-header
      color: `+ variables.onBg + `;
    } 

    .ant-form-item .ant-form-item-label >label {
      color: `+ variables.onBg + `;

    }
    :where(.css-dev-only-do-not-override-yp4umk).ant-form-item .ant-form-item-label >label {
      color: `+ variables.onBg + `;

    }

    ::-webkit-input-placeholder {
      color: `+ variables.onSurface + `;

    }

    :where(.css-dev-only-do-not-override-yp4umk).ant-picker {
      color: `+ variables.onSurface + `;

    }
    :where(.css-dev-only-do-not-override-yp4umk).ant-picker .ant-picker-suffix {
      color: `+ variables.onSurface + `;

    }

    :where(.css-dev-only-do-not-override-yp4umk).ant-picker .ant-picker-separator {
      color: `+ variables.onSurface + `;

    }

    :where(.css-dev-only-do-not-override-yp4umk).ant-select .ant-select-selection-placeholder {
      color: `+ variables.onSurface + `;

    }

    :where(.css-dev-only-do-not-override-yp4umk).ant-picker .ant-picker-input >input::placeholder {
      color: `+ variables.onSurface + `;

    }

    :where(.css-dev-only-do-not-override-yp4umk).ant-select .ant-select-arrow {
      color: `+ variables.onSurface + `;

    }



    :where(.css-dev-only-do-not-override-yp4umk).ant-input::placeholder {
      border-color: `+ variables.onSurface + `;
      color: `+ variables.onSurface + `;
    }


:where(.css-dev-only-do-not-override-1nd75cd).ant-table-wrapper .ant-table-cell-fix-left, :where(.css-dev-only-do-not-override-1nd75cd).ant-table-wrapper .ant-table-cell-fix-right {
  position: sticky!important;
  z-index: 2;
  background-color: `+ variables.sdmnDarkBlue + `!important;
      color: `+ variables.onSurface + `!important;
}



    

.ant-table-tbody .ant-table-cell-row:hover > th, .ant-table-cell-row:hover > td,
> th.ant-table-cell-row-hover,
> td.ant-table-cell-row-hover: {
  background-color: `+ variables.sdmnDarkBlue + `;
}

.ant-table-wrapper .ant-table-cell-fix-left, .ant-table-wrapper .ant-table-cell-fix-right {
  color: `+ variables.onBg + `;
  background: `+ variables.sdmnYellow + `;
}

:where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-tbody >tr.ant-table-row:hover>th, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-tbody >tr.ant-table-row:hover>td, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-tbody >tr >th.ant-table-cell-row-hover, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-tbody >tr >td.ant-table-cell-row-hover {
  color: `+ variables.onBg + `;
  background: `+ variables.sdmnYellow + `;
}

.ant-table-cell {
  background: `+ variables.sdmnDarkBlue + `;
    color: `+ variables.onSurface + `;
}

.ant-table-row-expand-icon-cell {
  color: `+ variables.sdmnWhite + `!important;
  // border-color:  `+ variables.sdmnLightBlue + `!important;
}

    .mb {
      margin-bottom: 30px;
    }


:where(.css-dev-only-do-not-override-1nd75cd).ant-table-wrapper .ant-table-row-expand-icon:focus, :where(.css-dev-only-do-not-override-1nd75cd).ant-table-wrapper .ant-table-row-expand-icon:hover, :where(.css-dev-only-do-not-override-1nd75cd).ant-table-wrapper .ant-table-row-expand-icon:active {
  color: `+ variables.sdmnLightBlue + `!important;
}

.

:where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-row-expand-icon:focus, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-row-expand-icon:hover, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-row-expand-icon:active {
  color: `+ variables.sdmnWhite + `;
  border-color:  `+ variables.sdmnWhite + `;
}

:where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-row-expand-icon:focus, :where(.css-dev-only-do-not-override-yp4umk).ant-table-wrapper .ant-table-row-expand-icon:hover {
  color: `+ variables.sdmnWhite + `;
  border-color:  `+ variables.sdmnWhite + `;
}

ant-table-wrapper .ant-table-row-expand-icon:hover {
  color: `+ variables.sdmnLightBlue + `;
  border-color:  `+ variables.sdmnLightBlue + `!important;

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
        (series != null ?
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
      key: 'locations',
      width: '10%',
      title: "Locations",
    },
    // {
    //   key: 'tags',
    //   width: '10%',
    //   title: "Tags",
    //   dataIndex: 'tags',
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
    console.log(' getVideos? ');
    const offset = activePage;//itemsPerPage * activePage - itemsPerPage
    let params = new URLSearchParams()
    Object.keys(columnFilter).forEach((key) => {
      console.log('here: ' + key + ' - ' + columnFilter[key])
      params.append(key, columnFilter[key])
    });
    columnSorter &&
      columnSorter.column !== undefined &&
      params.append('sort', `${columnSorter.column}%${columnSorter.state}`);
    console.log('getVideos filters');
    console.log(myFilters);

    // filters && filters.forEach(item => {
    //   console.log('keyvalue: ' + JSON.stringify(item));
    //   params.append(item.key, item.value);
    // });

    for (const property in myFilters) {
      // console.log(`${property}: ${filters[property]}`);
      if (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 1)
        params.append(property, myFilters[property]);
    }

    getVideosFn(offset, itemsPerPage, params)
      .then((result) => {
        // console.log(JSON.stringify(result));
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
    console.log(expanded);
    console.log(record);
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.video_id]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.video_id));
    }
    console.log(JSON.stringify(expandedRowKeys))
  };

  // Function to update the filter values
  const handleFilterChange = (newFilters) => {
    if (newFilters.search) {
      // console.log(' handleFilterChange? ' + JSON.stringify(newFilters))

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
          // console.log(JSON.stringify(result));
          setRecords(result.results)
          result.results ? setVideos(result.videos) : setVideos([])
        })

    }
    myFilters.search = false;
    setMyFilters({ ...myFilters, ...newFilters });
  };

  return (
    <>
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
    </>
  )
}

export default Videography
