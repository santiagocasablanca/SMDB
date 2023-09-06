import { YoutubeOutlined } from '@ant-design/icons';
import { Col, Row, Space, Table, Tag, Typography } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import { React, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import { getVideosFn } from "../services/videoApi.ts";
import VideographyEditPanel from './VideographyEditPanel';
import VideographyFilterPanel from './VideographyFilterPanel';
import VideoRate from '../components/video/VideoRate';

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title } = Typography;

const Videography = ({ _filters }) => {

  const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();
  const location = useLocation();
  // const searchParams = new URLSearchParams(location.state?.filters || {});

  const defaultFilters = {
    title: '',
    channels: [],
    excludedChannels: [],
    castMember: [],
    published_atRange: [],
    tags: [],
    locations: '',
    series: [],
    search: false, // Set this to false by default
    category: '',
    onlyShorts: false,
    excludeShorts: true,
    date: null,
    sort: ''
  };


  const [myFilters, setMyFilters] = useState(_filters || defaultFilters);

  // border: 1px solid black;
  insertCss(`

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .headerPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }
 
  
  .videographyBodyContainer {
    margin: 10px 100px auto;
  }

  .ant-pagination {
    background: #202020;
    padding: 10px 5px;
    margin-top: 0px !important;
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
    .videographyBodyContainer {
      margin: 0 20px;
    }
    .headerPanel {
      margin: 10px 0px auto;
    }
  }
  `);

  const getVideoById = (id) => {
    return videos.find(it => it.video_id === id);
  }


  const [videos, setVideos] = useState([])
  const [records, setRecords] = useState([])


  // TODO missing setting filters in order to make it clear on the UI what are the applied filters based on the redirected location
  useEffect(() => {
    // console.log('here again')
    let params = new URLSearchParams();
    if (location.state && location.state?.filter) {
      Object.keys(location.state?.filter).forEach((key) => {
        params.append(key, location.state?.filter[key])
      })
    }

    const offset = activePage;//itemsPerPage * activePage - itemsPerPage
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
    getVideosFn(offset, itemsPerPage, params)
      .then((result) => {
        setRecords(result.results)
        result.results ? setVideos(result.videos) : setVideos([])
      })
  }, [_filters, location.search, activePage, columnFilter, columnSorter, itemsPerPage])


  const onChange = (pagination, filters, sorter, extra) => {
    let params = new URLSearchParams()
    if (location.state && location.state?.filter) {
      Object.keys(location.state?.filter).forEach((key) => {
        params.append(key, location.state?.filter[key])
      })
    }
    const offset = pagination.current;//itemsPerPage * activePage - itemsPerPage

    if (sorter.hasOwnProperty("column") && sorter.order !== undefined) {
      let tempSortOrder = sorter.order == 'ascend' ? 'asc' : 'desc';
      params.append('sort', `${sorter.field}%${tempSortOrder}`);
    }

    for (const property in myFilters) {
      if (typeof myFilters[property] === 'boolean' || (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 0))
        params.append(property, myFilters[property]);
    }
    console.log(JSON.stringify(params));
    console.log(_filters, myFilters)

    getVideosFn(offset, pagination.pageSize, params)
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
      <div className="videographyBodyContainer">

        <Row className="headerPanel">
          <Col span="24">
            <Title level={3}><Space><YoutubeOutlined /> Videography</Space></Title>
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

export default Videography
