import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined, FilterOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, Table, Row, Space, Tag, Typography, Divider, Avatar, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideosFn } from "../../services/videoApi.ts";
import VideoRate from '../video/VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideographyFilterPopoverPanel from './VideographyFilterPopoverPanel';

import dayjs from "dayjs";


const { Title } = Typography;
const { Search } = Input;

const VideographyOnTable = ({searchParams, tableRefresh}) => {
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSecondsWithLegend } = useFormatter();

  const [activePage, setActivePage] = useState(1)
  const [columnFilter, setColumnFilter] = useState([])
  const [columnSorter, setColumnSorter] = useState(null)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  const [total, setTotal] = useState();
  const [fetchedData, setFetchedData] = useState([]);
  const columns = [
    {
      key: 'channel_title',
      dataIndex: 'channel_title',
      title: 'Channel',
      width: '10%',
      ellipsis: true,
    },
    {
      key: 'rating',
      dataIndex: 'video_id',
      title: 'Rating',
      width: '5%',
      render: (video_id) => (
        (
          <span>
            <VideoRate _video={getVideoById(video_id)} small={true} />
          </span>)
      ),
    },
    {
      key: 'title',
      dataIndex: 'title',
      title: 'Title',
      width: '30%'
    },
    { key: 'duration_parsed', title: 'Duration', dataIndex: 'duration_parsed', width: '8%', align: 'right', render: (text) => <p>{displayVideoDurationFromSecondsWithLegend(text)}</p> },
    { key: 'published_at', title: 'Published At', dataIndex: 'published_at', width: '10%', render: (text) => <p>{dayjs(text).format("DD MMM YYYY")}</p> },
    { key: 'views', title: 'Views', dataIndex: 'views', width: '8%', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'likes', title: 'Likes', dataIndex: 'likes', width: '8%', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    { key: 'comments', title: 'Comments', dataIndex: 'comments', width: '8%', align: 'right', render: (text) => <p>{intToStringBigNumber(text)}</p> },
    {
      key: 'game',
      dataIndex: 'game',
      width: '10%',
      title: "Game",
      render: (game) => (
        ((game != '' & game != null) ?
          <span>
            <Tag color={variables.sdmnLightBlue} key={game}> {game} </Tag>
          </span>
          : '')
      ),
    },
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
    console.log('here again table, ', searchParams)
    const page = activePage;
    

    getVideosFn(page, itemsPerPage, searchParams)
      .then((result) => {
        setTotal(result.results)
        result.results ? setFetchedData(result.videos) : setFetchedData([])
      })
  }, [searchParams, tableRefresh])


  const onChange = (pagination, filters, sorter, extra) => {
    setActivePage(pagination.current);
   
    getVideosFn(pagination.current, pagination.pageSize, searchParams)
      .then((result) => {
        setTotal(result.results)
        result.results ? setFetchedData(result.videos) : setFetchedData([])
      })
  };



  const getVideoById = (id) => {
    return fetchedData.find(it => it.video_id === id);
  }

  insertCss(`
  .videolistBodyContainer {
    margin: 10px 0px auto;
  }

  .ant-pagination {
    background: #202020;
    padding: 10px 5px;
    margin-top: 0px !important;
  }
  .videolistBodyContainer p {
    color: white;
  }

  @media (max-width: 600px) {
    .videolistBodyContainer {
      margin: 0 10px;
    }
    .headerPanel {
      margin: 10px 0px auto;
    }

  }

  `)

  const handleClickVideo = (id) => {
    console.log(id);
    const url = '/video/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }


  return (<>
    <div className="videolistBodyContainer">
    <Table columns={columns} dataSource={fetchedData}
                scroll={{ x: 1460, y: 900 }}
                // header={() => 'Results'}
                onChange={onChange}
                
                rowKey={(record) => record.video_id}
                size="small"
                style={{
                  controlItemBgHover: variables.primary,
                  
                }}
                onRow={(record, rowIndex) => {
                  return {
                    // onClick: (event) => {}, // click row
                    onDoubleClick: (event) => {handleClickVideo(record.video_id)}, // double click row
                    // onContextMenu: (event) => {}, // right button click row
                    // onMouseEnter: (event) => {}, // mouse enter row
                    // onMouseLeave: (event) => {}, // mouse leave row
                  };
                }}
                pagination={{
                  // simple: true,
                  total: total,
                  // showQuickJumper: true,
                  showSizeChanger: false,
                  pageSizeOptions: ["10", "30", "50"]
                }}
              />
    </div>
    <br></br>

  </>);
};

export default VideographyOnTable;
