import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, List, Row, Space, Typography, Divider, Avatar, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import { getVideosFn } from "../services/videoApi.ts";
import VideoDrawer from '../components/video/VideoDrawer';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';




const { Title } = Typography;
const { Search } = Input;

const VideographyOnCards = ({ _filters }) => {
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);
  const observerRef = useRef(null);
  const [myFilters, setMyFilters] = useState(_filters);

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

    //set params
    let params = new URLSearchParams();
    // if (location.state && location.state?.filter) {
    //   Object.keys(location.state?.filter).forEach((key) => {
    //     params.append(key, location.state?.filter[key])
    //   })
    // } else {
    for (const property in myFilters) {
      if (typeof myFilters[property] === 'boolean' || (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 0))
        params.append(property, myFilters[property]);
    }
    // }

    setIsLoading(true);

    try {
      const result = await getVideosFn(pageNumber, 15, params);

      if (result.videos && result.videos.length > 0) {
        setFetchedData((prevData) => [...prevData, ...result.videos]);
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
  .videolistBodyContainer {
    margin: 10px 0px auto;
  }

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
  }

  .headerPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }

  .videos-list {
    padding: 10px;
  }

  @media (max-width: 600px) {
    .videolistBodyContainer {
      margin: 0 0px;
    }
    .headerPanel {
      margin: 10px 0px auto;
    }

  }

  `)


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


  const handleClickVideo = (id) => {
    console.log(id);
    const url = '/video/' + id;
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

  const VideoCardBody = ({ item }) => {
    // const navigate = useNavigate();
    const goToChannel = (id) => {
      // console.log('going to channel?');
      const url = '/channel/' + id;
      // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
      navigate(url, { state: { id: id } });
    };

    return (
      <Space>
        <Avatar src={item?.channel?.logo_url} onClick={() => goToChannel(item?.channel?.channel_id)}
          style={{ backgroundColor: '#f56a00', top: '5px', position: 'absolute', left: '5px' }} />
        <Divider />
        {item.title}
      </Space >
    );
  };



  return (<>
    <div className="videolistBodyContainer">

      <Row className="headerPanel">
        <Col span="24">
          <Title level={3}><Space><YoutubeOutlined /> Videography</Space></Title>
        </Col>
        <Col span="24">
          {/* <VideographyFilterPanel filters={myFilters} onChange={handleFilterChange} /> */}
        </Col>
      </Row>
      <List
        grid={{
          gutter: 8,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        className="videos-list"
        itemLayout="horizontal"
        loading={initLoading}
        loadMore={
          <LoadMoreButton />
        }
        dataSource={fetchedData}
        renderItem={(item, index) => (
          <List.Item>
            <Card
              style={{ width: '100%', maxWidth: '450px' }}
              bodyStyle={{ padding: 0 }}
              onClick={() => handleClickVideo(item.video_id)}
              cover={
                <Image alt={item.name}
                  style={{ height: '195px', borderRadius: '7px', objectFit: 'cover' }}
                  src={item.url}
                 
                  preview={false}
                  fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
                />
              }
              hoverable
              key={item.video_id}>

              <VideoCardBody item={item} />

              <div style={{ color: 'white', fontSize: '10px', top: '3px', position: 'absolute', right: '5px', backgroundColor: 'black', opacity: '0.9', borderRadius: '8px', padding: '3px' }}>
                <Space>
                  <span style={{ color: 'white', fontSize: '10px' }}>{parseDate(item?.published_at, "DD MMM YYYY")}</span>
                  <Divider type="vertical" style={{ color: 'white' }} />
                  <span style={{ color: 'white', fontSize: '16px' }}>
                    <Popover title="Video Statistics Growth" content={<VideoGrowthLine _video={item} />}>
                      <LineChartOutlined />
                    </Popover>
                  </span>
                  <VideoRate _video={item} />
                </Space>
              </div>

            </Card>
            
          </List.Item>
        )}
      />
    </div>

  </>);
};




export default VideographyOnCards;
