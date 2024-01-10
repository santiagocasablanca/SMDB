import { Col, Image, List, Row, Select, Spin, Space, Card, Typography, Divider, Avatar, Skeleton } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getTopCreatorsFn } from "../../services/creatorApi.ts";
import { UserOutlined, VideoCameraOutlined, EyeOutlined, LikeOutlined, YoutubeOutlined, RiseOutlined } from '@ant-design/icons';



const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const TopCreatorsMonthly = ({ channel_ids, channelsGrowth }) => {
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [creatorsSubGrowth, setCreatorsSubGrowth] = useState(null);




  useEffect(() => {
    setTopCreators(groupData(channelsGrowth));
  }, [channelsGrowth]);

  useEffect(() => {
    setIsLoading(false);
  }, [topCreators]);

  insertCss(`

  .ant-spin-container .ant-row {
    margin-left: 0px !important;
    margin-right: 0px !important;
  }
  

  .stat-paragraph {
    color: gray;
    margin: 0px !important;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

    .creatorCard:hover {
      cursor: pointer;
    }

    .chartPosition {
      width: 35px;
      position: relative; 
      top: -33px; 
      left: 3px;
      color: black;
      font-weight: bold; 
      font-size: 34px; 
      margin-right: 0px;
      text-align: right;
    }

    .chartTitle {
      text-transform: uppercase;
    }

    .chartSubs {
      float: right; 
      margin-right: 3px;
      font-size: 0.6em; 
      color: darkgray;
    } 

    .chartPicture {
        width: 100px;
        height: 100px;
        border-radius: 8px;
        overflow: hidden;
    }

    .listContainer {
      height: 520px;
      overflow: auto;
    }
    
    @media (max-width: 1250px) {
      .chartPicture {
        width: 95px;
        height: 95px;
      }
    }

    @media (max-width: 990px) {
      .listContainer {
        height: 320px;
      }
    }

    @media (max-width: 524px) {
      .chartPosition {
        width: 20px;
        font-size: 18px; 
        margin-right: 0px;
      }

      .listContainer {
        height: 220px;
      }

      .chartTitle {
        font-size: 15px; 
      }

      .chartSubs {
        font-size: 0.5em; 
      }

      .chartPicture {
        width: 90px;
        height: 90px;
      }
      
    }
  `);

  const handleClick = (id) => {
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const groupData = (data) => {
    const groupedMap = new Map();

    data.forEach((item) => {
      const key = item.creator_id;
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          creator_id: item.creator_id,
          name: item.name,
          profile_picture: item.profile_picture,
          total_videos_published: 0,
          total_video_views: 0,
          total_initial_subs: 0,
          total_final_subs: 0,
          total_subs_increase: 0,
          total_subs_growth_percentage: 0,
          total_views: 0,
          total_first_views: 0,
          total_views_increase: 0,
          total_views_growth_percentage: 0,
          channel_stats: [],
          updated_at: item.updated_at,
        });
      }

      const group = groupedMap.get(key);

      group.total_videos_published += parseInt(item.videos_published, 10) || 0;
      group.total_video_views += parseInt(item.videos_views, 10) || 0;
      group.total_initial_subs += parseInt(item._first_subs, 10) || 0;
      group.total_final_subs += parseInt(item.subs, 10) || 0;
      group.total_subs_increase += parseInt(item.total_subs_increase, 10) || 0;
      group.total_subs_growth_percentage += parseFloat(item.subs_growth_percentage) || 0;
      group.total_views += parseInt(item.views, 10) || 0;
      group.total_first_views += parseInt(item._first_views, 10) || 0;
      group.total_views_increase += parseInt(item.total_views_increase, 10) || 0;
      group.total_views_growth_percentage += parseFloat(item.views_growth_percentage) || 0;

      group.channel_stats.push({
        channel_id: item.channel_id,
        title: item.title,
        logo_url: item.logo_url,
        videos_published: item.videos_published,
        videos_views: item.videos_views,
        subs: item.subs,
        _first_subs: item._first_subs,
        total_subs_increase: item.total_subs_increase,
        subs_growth_percentage: item.subs_growth_percentage,
        views: item.views,
        _first_views: item._first_views,
        total_views_increase: item.total_views_increase,
        views_growth_percentage: item.views_growth_percentage,
        updated_at: item.updated_at,
      });

      groupedMap.set(key, group);
    });

    // console.log(groupedMap, ...groupedMap.values());
    const sortedResults = Array.from(groupedMap.values()).sort((a, b) => {
      // Sort by highest total views increase first, then by highest total subs increase
      if (a.total_views_increase === b.total_views_increase) {
        return b.total_subs_increase - a.total_subs_increase;
      }
      return b.total_views_increase - a.total_views_increase;
    });

    // console.log([...groupedMap.values()]);
    // setIsLoading(false);
    return sortedResults;

    // return [...groupedMap.values()];
  };

  const IconText = ({ icon, text }) => (
    <>
      {React.createElement(icon, {
        style: {
          marginRight: 8,
        },
      })}
      {text}
    </>
  );

  const dummylistData = Array.from({
  length: 10,
}).map((_, i) => ({
  href: '',
  title: `ant design part ${i + 1}`,
  avatar: `https://xsgames.co/randomusers/avatar.php?g=pixel&key=${i}`,
  description:
    'Ant Design, a design language for background applications, is refined by Ant UED Team.',
  content:
    'We supply a series of design principles, practical patterns and high quality design resources (Sketch and Axure), to help people create their product prototypes beautifully and efficiently.',
}));

  return (
    <>
      <Row className="listContainer" justify="center">
        <Col span={24}>
          {
            isLoading ?
              (
                <List
                  itemLayout="vertical"
                  size="large"
                  style={{ marginTop: '-10px' }}
                  // loading={isLoading}
                  dataSource={dummylistData}
                  renderItem={(item, index) => (
                    <List.Item
                      key={index}
                      className="creatorCard"
                      style={{
                        borderBlockEnd: 'none',
                        paddingTop: '0px',
                        paddingBottom: '0px',
                        marginBottom: '10px',
                        marginTop: '10px',
                        paddingLeft: '0px',
                        paddingRight: '0px',
                        transition: 'background-color 0.3s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'inherit';
                      }}
                    >
                      <Skeleton loading={isLoading} active avatar>
                        <List.Item.Meta
                          avatar={<Avatar src={item.avatar} />}
                          title={<a href={item.href}>{item.title}</a>}
                          description={item.description}
                        />
                        {item.content}
                      </Skeleton>

                    </List.Item>
                  )}
                />


              ) :
              (<List
                itemLayout="vertical"
                size="large"
                style={{ marginTop: '-10px' }}
                // loading={isLoading}
                dataSource={topCreators.slice(0, 99)}
                renderItem={(item, index) => (
                  <List.Item
                    key={item.title}
                    className="creatorCard"
                    onClick={() => handleClick(item.creator_id)}
                    style={{
                      borderBlockEnd: 'none',
                      paddingTop: '0px',
                      paddingBottom: '0px',
                      marginBottom: '10px',
                      marginTop: '10px',
                      paddingLeft: '0px',
                      paddingRight: '0px',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'hsl(0, 0%, 90%)';
                      e.currentTarget.style.borderRadius= '8px';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'inherit';
                    }}
                  // actions={
                  //   !isLoading
                  //     ? 
                  //     // [
                  //      item?.channel_stats?.map((channel, index) => {
                  //        console.log(channel);
                  //        return <Avatar size={25} src={channel.logo_url}></Avatar>
                  //      })
                  //     // ]
                  //     : undefined
                  // }
                  // extra={
                  //   !isLoading && (
                  //     <img
                  //      className="chartPicture"
                  //       // width={92}
                  //       alt="logo"
                  //       src={item.profile_picture}
                  //     />
                  //   )
                  // }
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="chartPosition">
                        {index + 1}
                      </span>
                      <div style={{ marginLeft: '12px', marginRight: '10px' }}>
                        <div className="chartPicture">
                          <Image
                            alt={item.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                            }}
                            src={item.profile_picture}
                            preview={false}
                          />
                        </div>
                      </div>
                      <div style={{ flex: 1 }}>
                        <Title level={4} style={{ color: 'black', margin: 0, cursor: 'pointer' }}>
                          <span className="chartTitle">{item.name}</span> <span className="chartSubs">{intToStringBigNumber(item.total_final_subs)} subs</span>
                        </Title>
                        <Row gutter={[4, 2]} justify="space-between">
                          <Col span={12}>
                            <Paragraph className="stat-paragraph">
                              <YoutubeOutlined /> <span style={{ fontSize: '0.8em' }}>{intToStringBigNumber(item.total_subs_increase)} </span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}>
                                <RiseOutlined /> {(item.total_subs_growth_percentage).toFixed(1)}% </span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}> Subs Growth</span>
                            </Paragraph>

                          </Col>
                          <Col span={12}>
                            <Paragraph className="stat-paragraph">
                              <VideoCameraOutlined /> <span style={{ fontSize: '0.8em' }}>{item.total_videos_published}</span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}> Videos</span>
                            </Paragraph>
                          </Col>

                        </Row>
                        <Row gutter={[4, 2]} justify="space-between">

                          <Col span={12}>
                            <Paragraph className="stat-paragraph">
                              <EyeOutlined /> <span style={{ fontSize: '0.8em' }}>{intToStringBigNumber(item.total_video_views)}</span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}> Views</span>
                            </Paragraph>
                          </Col>
                          <Col span={12}>
                            <Paragraph className="stat-paragraph">
                              {/* <EyeOutlined /> */}
                              <span style={{ fontSize: '0.8em' }}>{intToStringBigNumber(item.total_views_increase)} </span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}>
                                <RiseOutlined /> {(item.total_views_growth_percentage).toFixed(1)}% </span>
                              <span style={{ fontSize: '0.7em', color: 'darkgray' }}> All Views Growth</span>
                            </Paragraph>
                          </Col>

                          {/* <Col span={24} style={{width: 'max-content'}}>
                          {item?.channel_stats?.map((channel, index) => {
                            // console.log(channel);
                            return <Avatar size={25} src={channel.logo_url}></Avatar>
                          })
                          }
                        </Col> */}


                          {/* <Col span={12}>
                          <Paragraph className="stat-paragraph">
                            <LikeOutlined /> <span style={{ fontSize: '0.9em' }}>{intToStringBigNumber(item.video_likes)} </span> 
                              <span style={{ fontSize: '0.8em', color: 'darkgray' }}> Videos Likes</span>
                          </Paragraph>
                        </Col> */}
                        </Row>
                      </div>
                    </div>

                  </List.Item>
                )}
              />)
          }

        </Col>
      </Row>
    </>
  )
}

export default TopCreatorsMonthly
