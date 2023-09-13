import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined, FilterOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Tag, Col, Image, Input, List, Row, Space, Typography, Divider, Avatar, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { getVideosFn } from "../../services/videoApi.ts";
import VideoRate from '../video/VideoRate';
import Locations from '../video/Locations';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import VideographyFilterPopoverPanel from './VideographyFilterPopoverPanel';




const { Title, Text } = Typography;
const { Search } = Input;

const VideographyOnList = ({ fetchedData, initLoading, isLoading, hasMore, loadMore }) => {
  const navigate = useNavigate();
  const location = useLocation();

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
        console.log('loading handleScroll')
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

  const goToChannel = (id) => {
    // console.log('going to channel?');
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  };

  const goToCreator = (id) => {
    console.log('heere: ', id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  // className="videos-list"
  // itemLayout="horizontal"

  const IconText = ({ icon, text }) => (
    <Space style={{ color: 'black' }}>
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const ItemDescription = ({ item }) => (
    <Space style={{ color: 'black' }}>
      <a style={{ color: 'black' }} onClick={() => goToChannel(item.channel?.channel_id)}> <Avatar src={item?.channel?.logo_url} /> {item.channel?.title}</a>
      <Text style={{ color: 'lightgray' }} type="secondary">{parseDateToFromNow(item.published_at)}</Text>
    </Space>
  );

  return (<>
    <div className="videolistBodyContainer">
      <List

        itemLayout="vertical"
        size="large"
        loading={initLoading}
        loadMore={
          <LoadMoreButton />
        }
        dataSource={fetchedData}
        renderItem={(item, index) => (
          <List.Item
            style={{ padding: '16px 0px' }}
            key={item.video_id}
            actions={[
              <IconText icon={EyeOutlined} text={intToStringBigNumber(item.views)} key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text={intToStringBigNumber(item.likes)} key="list-vertical-like-o" />,
              <IconText icon={CommentOutlined} text={intToStringBigNumber(item.comments)} key="list-vertical-message" />,
              <span style={{ color: 'black', fontSize: '16px' }}>
                <Popover title="Video Statistics Growth" content={<VideoGrowthLine _video={item} />}>
                  <LineChartOutlined />
                </Popover>
              </span>,
            ]}
            extra={
              <Image
                width={540}
                alt="thumbnail"
                style={{ height: '300px', borderRadius: '7px', objectFit: 'cover' }}
                src={item.url}
                preview={false}
              />
            }>
            <List.Item.Meta
              title={
                <div>
                  <a style={{ color: 'black' }} onClick={() => handleClickVideo(item.video_id)}>{item.title}</a>
                  <Divider type="vertical"></Divider>
                  <span style={{
                    background: 'black',
                    padding: '2px',
                    borderRadius: '7px'
                  }}>
                    <VideoRate _video={item} />
                  </span>
                </div>}
              description={<ItemDescription item={item} />}
            />
            {/* {item.published_at} */}
            <div style={{ color: 'black', overflowY: 'auto', height: '172px' }}>
              <Row gutter={[8, 10]}>
                {item?.serie ?
                  <Col span={24}>
                    <Space>
                      <Text strong style={{ color: 'black' }}>Series </Text>
                      <Space size={[0, 6]} wrap>
                        {item.serie && [item.serie]?.map((tag, index) => {
                          return (
                            <Tag
                              key={tag + 'series'}
                              color={variables.sdmnPink}
                              closable={false}
                              style={{
                                userSelect: 'none',
                              }}>
                              <span>
                                {tag}
                              </span>
                            </Tag>
                          )
                        })
                        }
                      </Space>
                    </Space>

                  </Col> : null
                }
                {item?.game ?
                  <Col span={24}>
                    <Space>
                      <Text strong style={{ color: 'black' }}>Game </Text>
                      <Space size={[0, 6]} wrap>
                        {item.game && [item.game]?.map((tag, index) => {
                          return (
                            <Tag
                              key={tag + 'game'}
                              color={variables.sdmnLightBlue}
                              closable={false}
                              style={{
                                userSelect: 'none',
                              }}>
                              <span>
                                {tag}
                              </span>
                            </Tag>
                          )
                        })
                        }
                      </Space>
                    </Space>

                  </Col> : null
                }
                {/* <br></br> */}
                {item?.locations ?
                  <Col span={24}>
                    <Locations video={item} />
                  </Col> : null
                }
              </Row>

              <Row
                gutter={[8, 10]}>
                <Col span={24}>
                  <List
                    header={<Text strong style={{ color: 'black' }}>Cast</Text>}
                    size="small"
                    itemLayout="horizontal"
                    dataSource={item?.cast}
                    renderItem={(creator, index) => (
                      <List.Item key={creator.id} onClick={() => goToCreator(creator.id)} className="showPointer">
                        <List.Item.Meta
                          avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                          title={<><Text style={{color: 'black'}}>{creator.name}</Text> <Text italic style={{color: 'black'}}> as {creator.video_creator.role}</Text></>}

                        />
                      </List.Item>
                    )} >
                  </List>

                </Col>
              </Row>
              {item?.tags ?
                <Row>
                  <Col span={24}>
                    <Space>
                      <Text strong style={{ color: 'black' }}>Tags </Text>
                      <Space size={[0, 6]} wrap>
                        {item.tags && item.tags?.map((tag, index) => {
                          return (
                            <Tag
                              key={tag + 'tags'}
                              closable={false}
                              style={{
                                userSelect: 'none',
                              }}>
                              <span>
                                {tag}
                              </span>
                            </Tag>
                          )
                        })
                        }
                      </Space>
                    </Space>

                  </Col>
                </Row>
                : null
              }
              {/* <Text>Directed by</Text> {item.directedBy?.map(el => {
                return <a style={{ color: 'black' }} onClick={() => alert(el)}>
                  <Avatar src={item?.channel?.logo_url} /> {item.channel?.title}</a>
              })} */}

              {/* <VideoGrowthLine _video={item} /> */}
            </div>
          </List.Item>
        )}
      />
    </div>
    <br></br>

  </>);
};




export default VideographyOnList;
