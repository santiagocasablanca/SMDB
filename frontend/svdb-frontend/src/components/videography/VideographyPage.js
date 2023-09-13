import {
  ReloadOutlined, ToolOutlined, YoutubeOutlined, SortAscendingOutlined, SortDescendingOutlined, UnorderedListOutlined, TableOutlined, AppstoreOutlined,
  LikeOutlined, FilterOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Spin, Input, List, Row, Space, Segmented, Typography, Divider, Select, Radio, Tooltip, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideosFn } from "../../services/videoApi.ts";
import VideoRate from '../video/VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideographyFilterPopoverPanel from './VideographyFilterPopoverPanel';
import VideographyOnCards from './VideographyOnCards';
import VideographyOnList from './VideographyOnList';
import VideographyOnTable from './VideographyOnTable';


const { Title } = Typography;
const { Search } = Input;
const { Option } = Select;

const VideographyPage = () => {
  const [view, setView] = useState('onCards'); // Initial view state (table, list, oncards)
  const navigate = useNavigate();
  const location = useLocation();
  let [searchParams, setSearchParams] = useSearchParams();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

  const handleViewChange = (value) => {
    if (view !== 'table' && fetchedData?.length == 0) {
      asyncFetch(1);
    }
    setView(value);

  };

  const loadMoreRef = useRef(null);

  const [initLoading, setInitLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [tableRefresh, setTableRefresh] = useState(0);
  const [filters, setFilters] = useSearchParams({
    channels: [],
    title: '',
    publishedAtRange: [],

    locations: null,
    series: null,
    tags: null,
    games: null,
    cast: null,
    search: true
  });

  const [loading, setLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [total, setTotal] = useState();

  useEffect(() => {
    setView('oncards');
    console.log('Videography Page ', initLoading, location);
    if (initLoading) {
      setInitLoading(false);

      if (location.state && location.state?.filter) {
        Object.keys(location.state?.filter).forEach((key) => {
          addOrUpdateAttribute(searchParams, key, location.state?.filter[key]);
        })
      }
      asyncFetch(1);
    }
  }, []);

  const asyncFetch = async (pageNumber, title = null) => {
    try {
      if (isLoading || !hasMore) {
        return;
      }


      if (title !== null) {
        addOrUpdateAttribute(searchParams, 'title', title);
      }

      setIsLoading(true);
      const result = await getVideosFn(pageNumber, 24, searchParams);

      if (result.videos && result.videos.length > 0) {
        setFetchedData((prevData) => [...prevData, ...result.videos]);
        setTotal(result.results);
        setPage(pageNumber);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false); // Reset loading more state
    }
  };


  /**
   * Filter drawer 
   */
  const [open, setOpen] = useState(false);

  const showFilter = () => {
    setOpen(true);
  };

  const childToParent = (search, childdata) => {
    console.log('childtoparent ', search, childdata);
    if (search) {
      setFetchedData([]);
      Object.keys(childdata).forEach((key) => {
        addOrUpdateAttribute(searchParams, key, childdata[key]);
      });
      setIsLoading(false);
      setHasMore(true);
      asyncFetch(1);

      if (view === 'table') {
        setTableRefresh(tableRefresh + 1);
      }
    }

    setOpen(false);
  }

  const onSearch = (value) => {
    console.log(value);
    setFetchedData([]);
    setIsLoading(false);
    setHasMore(true);
    asyncFetch(1, value);
    if (view === 'table') {
      addOrUpdateAttribute(searchParams, 'title', value);
      setTableRefresh(tableRefresh + 1);
    }
  }

  insertCss(`
  .videographyPageBodyContainer {
    margin: 10px 100px auto;
  }

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .headerPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }

  .videos-list {
    padding: 0px;
  }

  .full-version {
    display: flex;
  }
  
  .compact-version {
    display: none;
  }

  @media (max-width: 1200px) {
    .videographyPageBodyContainer {
      margin: 10px 10px auto;
    }
    .headerPanel {
      margin: 10px 10px auto;
    }

    
  }

  @media (max-width: 768px) {
    .videographyPageBodyContainer {
      margin: 0 10px;
    }
    .headerPanel {
      margin: 10px 10px auto;
    }

    .full-version {
      display: none;
    }
    
    .compact-version {
      display: flex;
    }

  }

  `)

  function addOrUpdateAttribute(searchParams, attributeName, attributeValue) {
    if (searchParams.has(attributeName)) {
      // If the attribute already exists, replace its value
      searchParams.set(attributeName, attributeValue);
    } else {
      // If the attribute doesn't exist, add a new one
      searchParams.append(attributeName, attributeValue);
    }
  }

  const onLoadMore = () => {
    asyncFetch(page + 1);
  };

  const onSortChange = (sort) => {
    addOrUpdateAttribute(searchParams, 'sort', sort);
    setFetchedData([]);
    asyncFetch(1);

  }

  const SortComponent = ({ searchParams, onSortChange }) => {
    const [sortField, setSortField] = useState(); // Initial sort field
    const [sortDirection, setSortDirection] = useState(); // Initial sort direction

    useEffect(() => {
      // console.log('sortComponent');
      if (searchParams.has('sort')) {
        // console.log(searchParams.get('sort'));
        const sortArr = searchParams.get('sort').split('%');
        // console.log(sortArr[0]);
        setSortField(sortArr[0]);
        setSortDirection(sortArr[1]);
      } else {
        setSortField('published_at');
        setSortDirection('desc');
      }
    }, []);

    const handleSortFieldChange = (value) => {
      setSortField(value);
      // Call the callback function to update the parent component with the new sorting criteria
      onSortChange(value + '%' + sortDirection);
    };

    const handleSortDirectionChange = (e) => {
      const direction = e.target.value;
      setSortDirection(direction);
      // Call the callback function to update the parent component with the new sorting criteria
      onSortChange(sortField + '%' + direction);
    };

    return (
      <Space.Compact block>
        <Select
          value={sortField}
          defaultValue={sortField}
          style={{ width: 125 }}
          onChange={handleSortFieldChange}
        >
          <Option value="title">Title</Option>
          {/* <Option value="duration">Duration</Option> */}
          <Option value="published_at">Published At</Option>
          <Option value="views">Views</Option>
          <Option value="likes">Likes</Option>
          <Option value="comments">Comments</Option>
          {/* Add more sorting fields as needed */}
        </Select>
        <Radio.Group onChange={handleSortDirectionChange} value={sortDirection} defaultValue="desc" size="medium" style={{ display: 'contents' }}>
          <Tooltip title="Ascending">
            <Radio.Button value="asc" style={{
              borderStartStartRadius: '0px',
              borderEndStartRadius: '0px',
              paddingInline: '9px'
            }}>
              <SortAscendingOutlined />
            </Radio.Button>
          </Tooltip>
          <Tooltip title="Descending">
            <Radio.Button value="desc" style={{
              paddingInline: '9px'
            }}><SortDescendingOutlined /></Radio.Button>
          </Tooltip>
        </Radio.Group>
      </Space.Compact>
    );
  };


  return (<>
    <div className="videographyPageBodyContainer">

      <Row className="headerPanel">
        <Col xs={18} sm={8} md={8} lg={10} xl={10}>
          <Title level={3}><Space><YoutubeOutlined /> Videography</Space></Title>
        </Col>
        <Col xs={6} sm={16} md={16} lg={14} xl={14}>
          <div style={{ float: 'right' }}>

            <Space className="full-version" style={{ columnGap: '3px' }}>
              <Segmented
                value={view}
                onChange={handleViewChange}
                options={[
                  { value: 'oncards', icon: <Tooltip title="Cards View"><AppstoreOutlined /></Tooltip> },
                  { value: 'list', icon: <Tooltip title="List View"><UnorderedListOutlined /></Tooltip> },
                  { value: 'table', icon: <Tooltip title="Table View"><TableOutlined /></Tooltip> },
                ]}
              />

              <SortComponent onSortChange={onSortChange} searchParams={searchParams} />

              <Space.Compact block>
                <Search
                  placeholder="Search by Title"
                  onSearch={onSearch}
                  style={{
                    width: 160,
                  }}
                />
                <Button icon={<FilterOutlined />} onClick={showFilter} />
              </Space.Compact>

            </Space>

            <Space.Compact className="compact-version" >
              <Popover content={
                <div style={{ display: 'block', width: '195px' }}>
                  <div style={{ float: 'right', marginBottom: '7px'}}>
                    <Segmented
                      value={view}
                      onChange={handleViewChange}
                      options={[
                        { value: 'oncards', icon: <Tooltip title="Cards View"><AppstoreOutlined /></Tooltip> },
                        // { value: 'list', icon: <Tooltip title="List View"><UnorderedListOutlined /></Tooltip> },
                        { value: 'table', icon: <Tooltip title="Table View"><TableOutlined /></Tooltip> },
                      ]}
                    />
                  </div>
                  <Divider style={{ margin: '8px 0' }}></Divider>
                  <Space>
                    <SortComponent onSortChange={onSortChange} searchParams={searchParams} />
                  </Space>
                  <Divider style={{ margin: '8px 0' }}></Divider>
                  <Space.Compact block>
                    <Search
                      placeholder="Search by Title"
                      onSearch={onSearch}
                      style={{
                        width: 192,
                      }}
                    />
                  </Space.Compact>
                </div>}>
                <Button icon={<ToolOutlined />} />
              </Popover>
              <Button icon={<FilterOutlined />} onClick={showFilter} />

            </Space.Compact>

          </div>

          {/* showFilter */}
          <VideographyFilterPopoverPanel _filters={
            {
              channels: searchParams.get('channels') ? searchParams.get('channels')?.split(',') : [],
              publishedAtRange: searchParams.get('publishedAtRange') ? searchParams.get('publishedAtRange')?.split(',') : [],
              locations: searchParams.get('locations') ? searchParams.get('locations')?.split(',') : [],
              series: searchParams.get('series') ? searchParams.get('series')?.split(',') : [],
              games: searchParams.get('games') ? searchParams.get('games')?.split(',') : [],
              tags: searchParams.get('tags') ? searchParams.get('tags')?.split(',') : [],
              cast: [],
              search: true
            }} _open={open} childToParent={childToParent} />
          {/* <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} /> */}
        </Col>

      </Row>
      <br></br>
      <div className="view-segment">

      </div>


      {initLoading ?
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%'
        }}>
          <Spin />
        </div>
        :
        <>
          {view === 'list' && <VideographyOnList fetchedData={fetchedData} isLoading={isLoading} hasMore={hasMore} initLoading={initLoading} loadMore={onLoadMore} />}
          {view === 'table' && <VideographyOnTable searchParams={searchParams} tableRefresh={tableRefresh} />}
          {view === 'oncards' && <VideographyOnCards fetchedData={fetchedData} isLoading={isLoading} hasMore={hasMore} initLoading={initLoading} loadMore={onLoadMore} />}

        </>}
    </div>
    <br></br>

  </>);
};
{/* <VideographyOnCards filters={filters} />} */ }
export default VideographyPage;
