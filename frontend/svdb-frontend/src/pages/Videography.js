import { Col, Row, Card, Table, Tag } from 'antd';
import { React, useEffect, useState } from "react"
import { getVideosFn } from "../services/videoApi.ts"
import VideoFilterPanel from './VideographyFilterPanel'
import Filter from './Filter'
import VideographyEditPanel from './VideographyEditPanel'
import dayjs from "dayjs"


const Videography = () => {




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
      width: '15%',
      fixed: 'left',
      ellipsis: true,
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      width: '25%',
      sorter: true,
      // sortDirections: ['asc', 'desc'],
      fixed: 'left',
    },
    { key: 'duration', title: 'Duration', dataIndex: 'duration', width: '10%', align: 'right', sorter: true, render: (text) => <p>{parseDuration(text)}</p> },
    {
      key: 'serie',
      dataIndex: 'serie',
      width: '10%',
      title: "Series",
      render: (serie) => (
        <span>
         <Tag color='volcano' key={serie}> {serie} </Tag>
        </span>
      ),
    },
    { key: 'published_at', title: 'Published At', dataIndex: 'published_at', width: '13%', sorter: true, render: (text) => <p>{dayjs(text).format("DD MMM YYYY HH:MM")}</p> },
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


  interface DataType {
    id: React.Key;
    channel_title: string;
    title: string;
    description: string;
    published_at: Date;
    url: string;
    views: Number;
    likes: Number;
    comments: Number;
    location: Array<String>;
    tags: Array<String>;
    createdAt: Date;
    updatedAt: Date;
  }

  const onChange = (pagination, filters, sorter, extra) => {
    console.log(' onChange? ' + JSON.stringify(myFilters));
    console.log('params', pagination, filters, sorter, extra);
    // activePage = pagination;
    console.log(JSON.stringify(filters));

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
        // console.log(JSON.stringify(result));
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


  // Function to update the filter values
  const handleFilterChange = (newFilters) => {
    if (newFilters.search) {
      console.log(' handleFilterChange? ' + JSON.stringify(newFilters))

      const offset = activePage;//itemsPerPage * activePage - itemsPerPage
      let params = new URLSearchParams()
      Object.keys(columnFilter).forEach((key) => {
        console.log('here: ' + key + ' - ' + columnFilter[key])
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
    <Row span="24" gutter={16}>
      <Col span="24" className="gutter-row">
        {/* <Filter /> */}
        <VideoFilterPanel filters={myFilters} onChange={handleFilterChange} />
      </Col>
      <Col span="24" className="gutter-row">
        {/* <Card> */}
          <Table columns={columns} dataSource={videos}
            scroll={{ x: 1500, y: 900 }}
            // header={() => 'Results'}
            onChange={onChange}
            rowKey={(record) => record.id}
            // rowSelection={rowSelection}
            expandable={{
              expandedRowRender: (record) => <VideographyEditPanel video={record}></VideographyEditPanel>,
              rowExpandable: (record) => record.title !== 'Not Expandable',
            }}
            size="small"
            pagination={{
              total: records,
              showQuickJumper: true,
              defaultPageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "30"]
            }}
          />
        {/* </Card> */}
      </Col>
    </Row>
  )
}

export default Videography
