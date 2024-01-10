import { YoutubeOutlined } from '@ant-design/icons';
import { Col, Row, Space, Table, Tag, Typography, Image } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import { React, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideoGuestsFn } from "../../services/videoApi.ts";
import CreatorGuestsTable from './CreatorGuestsTable';

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title, Text } = Typography;

const Guests = ({ title, _filters }) => {
  const navigate = useNavigate();

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

  .radius {
    border-radius: 50%;
  }

  .videos-column-container {
    overflow-x: auto;
    height: 82px;
    display: flex; 
  }

  
  @media (max-width: 600px) {
  }
  `);

  const [activePage, setActivePage] = useState(1)
  const [columnFilter, setColumnFilter] = useState([])
  const [columnSorter, setColumnSorter] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [creators, setCreators] = useState([])
  const [records, setRecords] = useState([])

  const handleClickCreator = (id) => {
    // console.log(id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const creatorColumns = [
    {
      key: "profile_picture",
      dataIndex: "creator_info",
      width: '5%',
      render: (creatorInfo) => <Image className="radius" src={creatorInfo.profile_picture} preview={false} onClick={() => handleClickCreator(creatorInfo.id)} />,
    },
    {
      key: "name",
      dataIndex: "creator_info",
      title: 'Name',
      width: '20%',
      render: (creatorInfo) => <Text onClick={() => handleClickCreator(creatorInfo.id)}>{creatorInfo.name}</Text>,
      // render: (url) => JSON.stringify(url),
      sorter: true,
      ellipsis: true,
      // onFilter: (value, record) => record.name.indexOf(value) === 0,
      // sorter: (a, b) => a.name.length - b.name.length,
      sorter: (a, b) => a.creator_info.name.length - b.creator_info.name.length,
      onFilter: (value, record) => record.creator_info.name.indexOf(value) === 0,

      // sortDirections: ['descend'],
    },
    {
      key: 'guest_count', title: 'Count', dataIndex: 'videos',
      width: '8%', 
      sorter: true,
      align: 'right', render: (videos) => <Text>{videos.length} videos </Text>,
      defaultSortOrder: 'descend',
      sorter: (a, b) => a.videos.length - b.videos.length,
    },
    {
      key: "videos",
      dataIndex: "videos",
      // width: '%',
      render: (videos) => (<RenderVideosColumn videos={videos} />)
    },
  ];

  const RenderVideosColumn = ({ videos }) => {

    return (
      <div className="videos-column-container">
        {videos?.map((video) => (
          <Image style={{ borderRadius: '8px', objectFit: 'cover' }} width={150} height={82} src={video.url} preview={false} key={video.video_id} />
        ))}
      </div>
    );
  }


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
          setRecords(result.count)
          result.results.sort((a, b) => {
            const videosCountA = a.videos.length;
            const videosCountB = b.videos.length;

            // Compare in descending order
            return videosCountB - videosCountA;
          });
          result.results ? setCreators(result.results) : setCreators([])
        })
    }
    fetchData();
  }, [_filters, location.search, activePage, itemsPerPage])
  // columnFilter, columnSorter



  const isRowExpanded = (record) => expandedRowKeys.includes(record.video_id);

  const rowClassName = (record, index) => {
    return isRowExpanded(record) ? 'expanded-row' : '';
  };

  const [expandedRowKeys, setExpandedRowKeys] = useState([]);

  const handleExpand = (expanded, record) => {
    // console.log('xpanding: ', record);
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, record.creator_info['id']]);
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.creator_info['id']));
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
          result.results ? setCreators(result.results) : setCreators([])
        })

    }
    myFilters.search = false;
    setMyFilters({ ...myFilters, ...newFilters });
  };




  return (
    <>
      <div className="">

        <Row className="creatorVideographyHeader">
          <Col span="24">
            <Title level={3}><Space><YoutubeOutlined /> {title ? title : 'Videography'}</Space></Title>
          </Col>
          {/* <Col span="24">
            <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} />
          </Col> */}
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
              <Table columns={creatorColumns} dataSource={creators}
                scroll={{ x: 1460, y: 900 }}
                // header={() => 'Results'}
                // onChange={onChange}
                rowKey={(record) => record.creator_info['id']}
                // rowSelection={rowSelection}
                expandable={{
                  expandedRowRender: (record) => <CreatorGuestsTable data={record.videos}></CreatorGuestsTable>,
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
        <br></br>
      </div>
    </>
  )
}

export default Guests;
