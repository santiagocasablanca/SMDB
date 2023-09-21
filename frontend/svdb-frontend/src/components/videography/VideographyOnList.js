import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined, FilterOutlined,
  CommentOutlined
} from '@ant-design/icons';
import { Button, Tag, Col, Image, Input, List, Row, Space, Typography, Divider, Modal, Avatar, Popover } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import VideoRate from '../video/VideoRate';
import VideoGrowthLine from '../graphs/VideoGrowthLine';
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { gsap } from "gsap";


const { Title, Text } = Typography;
const { Search } = Input;

const VideographyOnList = ({ fetchedData, initLoading, isLoading, hasMore, loadMore }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const loadMoreRef = useRef(null);
  const { intToStringBigNumber, parseDate, parseDuration, parseDateToFromNow } = useFormatter();

  const onEnter = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: variables.sdmnYellow, marginBottom: '30px', scale: 1.1 });
  };

  const onLeave = ({ currentTarget }) => {
    gsap.to(currentTarget, { backgroundColor: variables.coolerGray9, scale: 1, marginBottom: '10px' });
  };

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

  .ant-list-vertical .ant-list-item .ant-list-item-main {
    padding: 10px;
    overflow-x: auto;
  }

  .ant-list-vertical .ant-list-item .ant-list-item-extra {
    margin-inline-start: 0;
  }

  .ant-list-vertical .ant-list-item .ant-list-item-action {
    text-wrap: nowrap;
    overflow: hidden;
    width: 800px;
    float: left;
  }

  .moreInfoPanel {
    color: black; 
    overflow-y: auto; 
    height: 150px;
    margin-left: 10px;
  }

  .tagsScroller {
    width: 550px; 
    overflow-x: scroll;
    text-wrap: nowrap;
  }

  .thumbnailOnList{
    width: 540px;
    height: 300px; 
  }

  @media (max-width: 1500px) {
    .tagsScroller {
      width: 350px; 
    }
  }


  @media (max-width: 1400px) {
    .ant-list-vertical .ant-list-item .ant-list-item-action {
      width: 800px;
    }

    .tagsScroller {
      width: 330px; 
    }
    .moreInfoPanel {
      height: 105px;
    }
    .thumbnailOnList{
      width: 465px;
      height: 260px; 
    }
  }

  @media (max-width: 1200px) {
    .ant-list-vertical .ant-list-item .ant-list-item-action {
      width: 600px;
    }
    .tagsScroller {
      width: 300px; 
    }
  }

  @media (max-width: 1100px) {
    .tagsScroller {
      width: 255px; 
    }
    .moreInfoPanel {
      height: 50px;
    }
    .thumbnailOnList{
      width: 365px;
      height: 200px; 
    }
    .ant-list-vertical .ant-list-item .ant-list-item-action {
      width: 500px;
    }
  }

  @media (max-width: 900px) {
    .tagsScroller {
      width: 115px; 
    }
    .thumbnailOnList{
      width: 265px;
      height: 200px; 
    }

    .ant-list-vertical .ant-list-item .ant-list-item-action {
      width: 400px;
    }
  }

  @media (max-width: 700px) {
    .tagsScroller {
      width: 100px; 
    }
    .thumbnailOnList{
      width: 265px;
      height: 200px; 
    }

    .ant-list-vertical .ant-list-item .ant-list-item-action {
      width: 200px;
    }
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
    <Space style={{ color: 'black', fontSize: '13px' }}>
      <a style={{ color: 'black' }} onClick={() => goToChannel(item.channel?.channel_id)}> <Avatar src={item?.channel?.logo_url} style={{ marginRight: '5px' }} /> {item.channel?.title}</a>
      <Text style={{ color: variables.coolerGray6 }} type="secondary">{parseDateToFromNow(item.published_at)}</Text>
    </Space>
  );

  const Locations = ({ video }) => {
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleAll, setVisibleAll] = useState(false);
    const [locations, setLocations] = useState({});
    const [location, setLocation] = useState({});
    const [zoom, setZoom] = useState(11);
    const [center, setCenter] = useState();


    useEffect(() => {
      // console.log(video?.locations);
      setLocations(video?.locations);
      setLoaded(true);

    }, [video]);


    const showModal = (location) => {
      setLocation(location);
      setZoom(location.zoom);
      setCenter(location.coords)
      setVisible(true);
    };

    const handleCancel = () => {
      setLocation({});
      setVisible(false);
      // setLoaded(false);
    };

    const showAll = () => {
      setVisibleAll(true);
      // setLoaded(true);
    };

    const handleCancelAll = () => {
      setVisibleAll(false);
      // setLoaded(false);
    };

    return (
      <>
        {loaded && locations ?
          <>
            <Tag style={{ marginLeft: '5px', cursor: 'pointer' }} color='#101010' key='allTag' onClick={showAll}>See All </Tag>
            {Object.keys(locations).map(key => {
              const _locations = locations[key];
              return _locations.map(location => {
                return (
                  <Tag style={{ cursor: 'pointer' }} color={location.color} key={location.title + '_list'} onClick={() => showModal(location)}>
                    {location.title}
                  </Tag>
                );
              })
            })}

            <Modal
              title={location.modalTitle}
              open={visible}
              onCancel={handleCancel}
              footer={null}>

              <Map height={400} center={center} zoom={zoom} onBoundsChanged={({ center, zoom }) => {
                setCenter(center)
                setZoom(zoom)
              }} >
                <ZoomControl />
                <Marker width={50} color={location.color} anchor={location.coords} />
              </Map>
            </Modal>

            <Modal
              title='Locations'
              open={visibleAll}
              width={750}
              onCancel={handleCancelAll}
              footer={null}>

              <Map height={500} width={700} defaultCenter={[51.4873439, 0.0335215]} zoom={3} onBoundsChanged={({ center, zoom }) => {
                // setCenter(center)
                setZoom(zoom)
              }} >
                <ZoomControl />
                {loaded && locations && Object.keys(locations).map(key => {
                  // console.log(locations);
                  // console.log(key);
                  const _locations = locations[key];
                  // console.log(_locations)
                  return _locations.map(location => {
                    return (
                      <Marker width={50} color={location.color} anchor={location.coords} />
                    );
                  })
                })}
              </Map>
            </Modal>
          </>
          : <Text italic style={{ color: variables.coolerGray6 }}>N/A</Text>

        }
      </>

    )
  }

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
            style={{ marginBottom: '10px', padding: '0px', background: variables.coolerGray9, borderRadius: '8px' }}
            key={item.video_id}
            onMouseEnter={onEnter}
            onMouseLeave={onLeave}
            actions={[
              <>
                {/* <Text strong style={{ color: 'black', marginLeft: '10px' }}>Stats </Text> */}
                <IconText icon={EyeOutlined} text={intToStringBigNumber(item.views)} key="list-vertical-star-o" /> <Divider type="vertical" />
                <IconText icon={LikeOutlined} text={intToStringBigNumber(item.likes)} key="list-vertical-like-o" /> <Divider type="vertical" />
                <IconText icon={CommentOutlined} text={intToStringBigNumber(item.comments)} key="list-vertical-message" />
              </>,
              <span style={{ color: 'black', fontSize: '16px' }}>
                <Popover title="Video Statistics Growth" content={<VideoGrowthLine _video={item} />}>
                  <LineChartOutlined />
                </Popover>
              </span>,
              <Space >
                <Text strong style={{ color: 'black', textWrap: 'nowrap' }}>Tags </Text>
                {item?.tags ?
                  <Space size={[0, 6]} className="tagsScroller">
                    {item.tags && item.tags?.map((tag, index) => {
                      return (
                        <Tag
                          key={tag + 'tags'}
                          color="black"
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
                  : <Text italic style={{ color: variables.coolerGray6 }}>N/A</Text>
                }
              </Space>
            ]}
            extra={
              <div className="thumbnailOnList">
                <Image
                  style={{ borderRadius: '7px', objectFit: 'cover', cursor: 'pointer' }}
                  width="100%"
                  height="100%"
                  onClick={() => handleClickVideo(item.video_id)}
                  alt="thumbnail"
                  src={item.url}
                  preview={false}
                />
              </div>
            }>
            <List.Item.Meta
              // div.b {
              //   white-space: nowrap; 
              //   width: 50px; 
              //   overflow: hidden;
              //   text-overflow: ellipsis; 
              //   border: 1px solid #000000;
              // }
              title={
                <>
                  <div>
                    <ItemDescription item={item} />
                    <div style={{ paddingLeft: '40px', fontSize: '16px' }}>
                      <span style={{
                        background: 'black',
                        padding: '5px',
                        borderRadius: '7px'
                      }}>
                        <VideoRate _video={item} />
                      </span>
                      <Divider type="vertical"></Divider>
                      <a style={{
                        color: 'black', textOverflow: 'ellipsis', overflow: 'hidden', width: '77%', display: 'inline-grid',
                        whiteSpace: 'nowrap', fontSize: '20px'
                      }} onClick={() => handleClickVideo(item.video_id)}>{item.title}</a>

                    </div>
                  </div>
                </>
              }
            // description={} 
            //, height: '172px'
            />
            <div className="moreInfoPanel">
              <Row>
                <Col span={24}>
                  <Text strong style={{ color: 'black' }}>Locations </Text>
                  <Locations video={item} />
                </Col>
              </Row>

              <Row style={{ marginTop: '5px' }}>
                <Col span={24}>

                  <Space>
                    <Text strong style={{ color: 'black' }}>Series </Text>
                    {item?.serie ?
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
                      : <Text italic style={{ color: variables.coolerGray6 }}>N/A</Text>
                    }
                  </Space>
                </Col>
              </Row>

              <Row style={{ marginTop: '5px' }}>
                <Col span={24}>
                  <Space>
                    <Text strong style={{ color: 'black' }}>Game </Text>
                    {item?.game ?
                      <Space size={[0, 6]} wrap>
                        {item.game && [item.game]?.map((tag, index) => {
                          return (
                            <Tag
                              key={tag + 'series'}
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
                      : <Text italic style={{ color: variables.coolerGray6 }}>N/A</Text>
                    }
                  </Space>
                </Col>
              </Row>
              <Row gutter={[8, 16]}>

                <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Space style={{ float: 'right' }}>
                    {
                      (item.directedBy?.length > 0) ? (<>
                        <Text strong>Directed by</Text>
                        <Avatar.Group maxCount={2} maxStyle={{ color: '#000000', backgroundColor: '#FFFFFF' }}>
                          {item.directedBy?.map(director => {
                            return (<Avatar key={"director" + director.id} size="small" src={director.profile_picture} />);
                          })}
                        </Avatar.Group>

                      </>) : ('')
                    }
                    {
                      item.cast?.length > 0 ? (
                        <>
                          <Divider></Divider>
                          <Text strong>Cast</Text>
                          {/* <Popover placement="bottom" title="Cast" content={castContent(item.cast)} trigger="click"> */}

                          <Avatar.Group maxCount={5} maxStyle={{ color: '#000000', backgroundColor: variables.primary }}>
                            {item.cast.map(cast_creator => {
                              return (<Avatar key={"cast_" + cast_creator.id} size="small" src={cast_creator.profile_picture} />);
                            })}
                          </Avatar.Group>
                          {/* </Popover> */}
                        </>) : ('')
                    }
                  </Space>
                </Col>

              </Row>
            </div>


          </List.Item>
        )}
      />
    </div>
    <br></br>

  </>);
};




export default VideographyOnList;
