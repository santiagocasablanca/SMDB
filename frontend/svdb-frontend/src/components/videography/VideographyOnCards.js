import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined, MoreOutlined,
  LikeOutlined, FilterOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Card, Col, Image, Input, Spin, List, Row, Tooltip, Space, Typography, Divider, Avatar, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideosFn } from "../../services/videoApi.ts";
import VideoRate from '../video/VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideographyFilterPopoverPanel from './VideographyFilterPopoverPanel';
import VideoDurationOverlay from '../video/VideoDurationOverlay';
import VideoOnHoverPreview from '../video/VideoOnHoverPreview';




const { Title, Text } = Typography;
const { Search } = Input;

const VideographyOnCards = ({ fetchedData, initLoading, isLoading, hasMore, loadMore }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const loadMoreRef = useRef(null);
  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();


  useEffect(() => {
    const handleScroll = () => {
      // console.log("handleScroll", isLoading, hasMore, window.innerHeight + window.scrollY, document.documentElement.scrollHeight);
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
  }, [fetchedData, isLoading, hasMore]);

  const onLoadMore = () => {
    // call parent
    loadMore(true);
  };



  insertCss(`
  .videos-list {
    padding: 0px;
  }
  `)

  const handleClickVideo = (id) => {
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
    return (
      <div style={{ color: 'black', maxWidth: '360px', overflowX: 'none', marginLeft: '5px', marginTop: '5px', marginBottom: '10px' }}>

        <Title style={{ color: 'black', marginBottom: '5px' }}
          ellipsis={{ tooltip: item.title }}
          onClick={() => handleClickVideo(item.video_id)}
          level={5}>{item.title}</Title>

        <span style={{ color: 'black', fontSize: '14px' }}>
          <Popover title="Video Statistics Growth" content={<VideoGrowthLine _video={item} />}>
            <span style={{ color: 'black', fontSize: '12px', float: 'left' }}><EyeOutlined /> {intToStringBigNumber(item?.views)} views </span>
          </Popover>
        </span>
        <Tooltip title={parseDate(item?.published_at, "DD MMM YYYY HH:MM")}>
          <span style={{ color: 'black', fontSize: '12px', float: 'right', marginRight: '2px' }}> {parseDateToFromNow(item?.published_at)}</span>
        </Tooltip>
      </div>
    );
  };

  const VideoCardChannelBody = ({ item }) => {
    const [showChannel, setShowChannel] = useState(false);

    // const navigate = useNavigate();
    const goToChannel = (id) => {
      const url = '/channel/' + id;
      // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
      navigate(url, { state: { id: id } });
    };

    return (
      <div style={{ position: 'absolute', top: '5px', left: '5px', color: 'black' }}>
        <div
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
            e.currentTarget.style.borderRadius = '8px';
            // e.currentTarget.style.paddingRight = '3px';
            setShowChannel(true);

          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'inherit';
            e.currentTarget.style.borderRadius = 'inherit';
            // e.currentTarget.style.paddingRight = '0px';
            setShowChannel(false);
          }}>
          <Avatar src={item.channel.logo_url} onClick={() => goToChannel(item.channel.channel_id)} style={{
            marginRight: '5px', cursor: 'pointer'
          }} />
          {
            showChannel ? <>
              <Text style={{ color: 'black', marginRight: '5px', cursor: 'pointer' }} strong
                onClick={() => goToChannel(item.channel.channel_id)}>{item.channel.title}</Text>
              <Text style={{ color: 'gray', cursor: 'pointer', fontSize: '12px', paddingRight: '3px' }}
                onClick={() => goToChannel(item.channel.channel_id)}>{intToStringBigNumber(item.channel.subs)} subs</Text>
            </> : <></>
          }

        </div>
        {/* <p style={{ color: 'black', fontSize: '10px', float: 'right' }}>{parseDate(item.published_at, "DD MMM YYYY")}</p> */}
      </div>
    );
  };
  const [isHovered, setIsHovered] = useState(false);
  const toggleHover = (state) => {
    setIsHovered(state);
  }

  return (<>
    <div className="videolistBodyContainer">
      <List
        grid={{
          gutter: 16,
          xs: 1,
          sm: 1,
          md: 2,
          lg: 3,
          xl: 3,
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
            
            {/* <VideoCard key={index} video={item} /> */}
            <Card
              style={{ width: '100%', maxWidth: '450px', backgroundColor: 'transparent', border: 'none' }}
              bodyStyle={{ padding: 0 }}

              cover={
                <Image alt={item.name}
                  style={{ height: '195px', borderRadius: '7px', objectFit: 'cover' }}
                  src={item.url}
                  onClick={() => handleClickVideo(item.video_id)}
                  preview={false}
                  fallback="data:image/png;base64,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"
                />
              }
              hoverable
              key={item.video_id}>
              <div style={{ position: 'absolute', bottom: '55px', right: '5px' }}>
                <VideoDurationOverlay duration={item.duration} />

              </div>
              <div style={{ color: 'white', fontSize: '10px', top: '5px', position: 'absolute', right: '5px', backgroundColor: 'black', opacity: '0.9', borderRadius: '8px', padding: '3px' }}
              >
                <Space>
                  <VideoRate _video={item} color="white" />
                </Space>

                ˙</div>

              <VideoCardChannelBody item={item} />
              <VideoCardBody item={item} />



            </Card>

          </List.Item>
        )}
      />
    </div>
    <br></br>

  </>);
};




export default VideographyOnCards;
