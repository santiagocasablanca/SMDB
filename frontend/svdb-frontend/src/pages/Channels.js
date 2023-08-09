import { ReloadOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Col, Image, Input, List, Row, Space, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import { getChannelsFn } from "../services/channelApi.ts";




const { Title } = Typography;
const { Search } = Input;

const ChannelsPage = () => {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);

  const [initLoading, setInitLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [filters, setFilters] = useState({});

  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    asyncFetch(page);
    setInitLoading(false);
  }, [filters]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100 &&
        !isLoading &&
        hasMore
      ) {
        onLoadMore();
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [isLoading, hasMore]);

  const onLoadMore = () => {
    asyncFetch(page + 1);
  };

  const asyncFetch = async (pageNumber, title = null) => {
    if (isLoading || !hasMore) {
      return;
    }

    let params = new URLSearchParams();
    params.append("sort", "views%desc");

    // filters
    // for (const property in filters) {
    //   if (typeof filters[property] === 'boolean' || (filters[property] && filters[property] != '' && filters[property].length > 0))
    //     params.append(property, filters[property]);
    // }
    if(title) {
      params.append('title', title);
    }

    setIsLoading(true);

    try {
      const result = await getChannelsFn(pageNumber, 15, params);

      if (result.results && result.results.length > 0) {
        setFetchedData((prevData) => [...prevData, ...result.results]);
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


  insertCss(`
  .channelsBodyContainer {
    margin: 10px 100px auto;
  }

  .channelsHeaderPanel {
    padding: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .channelsHeaderPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }
 
  .channelsHeaderPanel button span {
    background: `+ variables.sdmnBlack + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .channels-list {
    padding: 10px;
  }

  @media (max-width: 600px) {
    .channelsBodyContainer {
      margin: 0 20px;
    }

    .channelsHeaderPanel {
      margin: 10px 10px auto;
    }
  }

  `)

  const HeaderPanel = ({ title, filters, onChange }) => {
    // style={{ color: 'black' }}
    return (
      <Row className="channelsHeaderPanel">
        <Col span="22">
          <Title level={3}><Space><UserOutlined /> {title}</Space></Title>
        </Col>
        <Col span="2">
          <div style={{ float: 'right' }}>
            <Space.Compact block>
              {/* <Popover content={filter} placement="bottom">
                <Button icon={<FilterOutlined />} />
              </Popover> */}
              <Search
                placeholder="Search by Title"
                onSearch={onSearch}
                style={{
                  width: 200,
                }}
              />

            </Space.Compact>

          </div>
        </Col>
      </Row>
    );
  };

  const onSearch = (value) => {
    console.log(value);
    setFetchedData([]);
    setIsLoading(false);
    setHasMore(true);
    asyncFetch(1, value);
  }

  const filter = (
    <Space.Compact block >
      <Input placeholder="Title"
        style={{ width: '95%' }}
        name="title"
        value={filters.title}
        onChange={(e) => handleInputChange(e.target.value)} />
      {/* <CreatorSelector onChange={handleDirector} _selectedCreators={filter.creators} /> */}
    </Space.Compact>
  );

  const handleInputChange = (e) => {

    console.log('here ', e);
    // const { name, value } = e.target;
    // onChange({ [name]: value });
    setFilters({ title: e });
  };


  const handleClickChannel = (id) => {
    console.log(id);
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const LoadMoreButton = () => (
    hasMore && (
      <div
        ref={loadMoreRef}
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button onClick={onLoadMore} disabled={isLoading}>
          <ReloadOutlined />
        </Button>
      </div>
    )
  );

  return (<>
    <div className="channelsBodyContainer">

      <HeaderPanel title="Channels"></HeaderPanel>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 5,
        }}
        className="channels-list"
        itemLayout="horizontal"
        loading={initLoading}
        loadMore={
          <LoadMoreButton />
        }
        dataSource={fetchedData}
        renderItem={(item, index) => (
          <List.Item>
            <Card title={item.title}
              style={{ width: '100%', maxWidth: '450px' }}
              bodyStyle={{ padding: 0 }}

              cover={
                <Image alt={item.name}
                  style={{ height: '300px', objectFit: 'cover' }}
                  src={item.logo_url}
                  onClick={() => handleClickChannel(item.channel_id)}
                  preview={false}
                  fallback="data:image/png;base64,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"
                />
              }
              hoverable
              key={item.channel_id}>

            </Card>
          </List.Item>
        )}
      />
    </div>
  </>);
};


export default ChannelsPage;
