import { CalendarOutlined, CommentOutlined, EyeOutlined, LikeOutlined, LineChartOutlined } from '@ant-design/icons';
import { Avatar, Col, List, Row, Space, Typography, Popover } from 'antd';
import insertCss from 'insert-css';
import { React, useEffect, useState } from "react";
import ReactPlayer from 'react-player';
import UpdateVideoModal from '../components/video/UpdateVideoModal';
import useFormatter from '../hooks/useFormatter';
import { getVideoFn } from "../services/videoApi.ts";
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';



const { Text, Link } = Typography;

const VideographyEditPanel = ({ _video, onChange }) => {
  const [video, setVideo] = useState(_video);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();

  useEffect(() => {

    async function fetchData() {
      console.log('videoeditpanel loaded')
      await getVideoFn(_video.video_id).then(res => {
        if (res.result) {
          setVideo(res.result);
        }
      })
    }
    fetchData();
  }, [_video]);

  insertCss(`
        .editVideoContainer {
            padding: 0 20px 0 20px;
        }
        
        .videoDimensions {
            height: 550px;
        }


        @media (max-width: 900px) {
            .editVideoContainer {
                padding: 0 10px 0 10px;
            }
        }

        @media (max-width: 600px) {
            .videoDimensions {
                height: 215px;
                width: 315px;
            }
        }
    `);


  return (
    // <div className="editPanel">
    //   <Row>
    //     <ReactPlayer url={video.player.embedHtml} width='100%'></ReactPlayer>
    //   </Row>
    //   <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginTop: 5 + 'px', padding: 10 }}>
    //     <Col className="gutter-row" span={24}>
    //       <Descriptions title={video.title} layout="horizontal" extra={<Button type="primary">Edit</Button>}>
    //         <Descriptions.Item label="Channel">{video.channel_title}</Descriptions.Item>
    //         <Descriptions.Item label="Published At">{parseDate(video.published_at)}</Descriptions.Item>
    //         <Descriptions.Item label="Duration">{parseDuration(video.duration)}</Descriptions.Item>
    //         <Descriptions.Item label="Views">{intToStringBigNumber(video.views)}</Descriptions.Item>
    //         <Descriptions.Item label="Likes">{intToStringBigNumber(video.likes)}</Descriptions.Item>
    //         <Descriptions.Item label="Comments">{intToStringBigNumber(video.comments)}</Descriptions.Item>
    //       </Descriptions>
    //     </Col>
    //   </Row>
    // </div>
    <div className="editVideoContainer">
      <Row gutter={[8, 12]}>
        <Col span={24} md={24} lg={16} xl={18}>
          <Row gutter={[8, 12]}>
            <Col span={24}>
              <div className="videoDimensions">
                <ReactPlayer url={video.player.embedHtml} width='100%' height="100%"></ReactPlayer>
              </div>
            </Col>

          </Row>
        </Col>

        <Col span={24} md={24} lg={8} xl={6}>
          <Row style={{
            height: "550px",
            overflow: "auto"
          }}>
            <Col span={24}>
              <Space.Compact direction="vertical" style={{ float: 'right', color: 'white' }}>
                <Space size="small" style={{ float: 'right' }}>
                  <UpdateVideoModal video={video} />
                  <CalendarOutlined /> <Text type="secondary" style={{ float: 'right' }}>  {parseDate(video.published_at)}</Text>
                </Space>
                <Space size="small" style={{ float: 'right' }}>
                  <EyeOutlined />{intToStringBigNumber(video.views)}
                  <LikeOutlined />{intToStringBigNumber(video.likes)}
                  <CommentOutlined />{intToStringBigNumber(video.comments)}
                  <Popover title={_video.title} content={<div style={{ width: '600px' }} trigger="click"><VideoGrowthLine _video={video} /></div>}>
                    <span style={{ color: 'white', fontSize: '16px' }}><LineChartOutlined /></span>
                  </Popover>
                </Space>

              </Space.Compact>
            </Col>
            {/* <Col className="gutter-row" span={24}>
              <Descriptions  layout="horizontal" extra={<Button type="primary">Edit</Button>}>
                <Descriptions.Item label="Duration">{parseDuration(video.duration)}</Descriptions.Item>
              </Descriptions>
            </Col> */}
            <Col span={24}>
              <List
                header={<Text strong style={{ marginLeft: '20px' }}>Directed by</Text>}
                size="small"
                itemLayout="vertical"
                dataSource={video?.directedBy}
                //   style={{ width: '100%' }}
                renderItem={(creator, index) => (
                  <List.Item key={creator.id}>
                    <List.Item.Meta
                      avatar={<Avatar key={"drawerDirector" + index} src={creator.profile_picture} />}
                      title={creator.name}
                    />
                  </List.Item>
                )} >
              </List>
            </Col>
            <Col span={24}>
              <List
                header={<Text strong style={{ marginLeft: '20px' }}>Cast</Text>}
                size="small"
                itemLayout="vertical"
                dataSource={video?.cast}
                renderItem={(creator, index) => (
                  <List.Item key={creator.id}>
                    <List.Item.Meta
                      avatar={<Avatar key={"draweCast" + index} src={creator.profile_picture} />}
                      title={<><Text>{creator.name}</Text> <Text italic type="secondary"> as {creator.video_creator.role}</Text></>}

                    />
                  </List.Item>
                )} >
              </List>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  )
}

export default VideographyEditPanel


/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 25 + 'px' }}>
      <Col className="gutter-row" span={16}>
        <div dangerouslySetInnerHTML={{ __html: video.player.embedHtml }} />
      </Col>
      <Col className="gutter-row" span={6}>
        <List
          itemLayout="horizontal"
          dataSource={stats}
          renderItem={(item, index) => (
            <List.Item>
              <List.Item.Meta
                avatar={item.icon}
                title={item.title}
                description={intToStringBigNumber(video[item.key])}
              />
            </List.Item>
          )}
        />
        {/* <Descriptions title="Video stats" layout="vertical"> */
/* <Descriptions.Item label="Views">{intToStringBigNumber(video.views)}</Descriptions.Item>
          <Descriptions.Item label="Likes">{intToStringBigNumber(video.likes)}</Descriptions.Item>
          <Descriptions.Item label="Comments">{intToStringBigNumber(video.comments)}</Descriptions.Item>
        </Descriptions> */

      //   </Col>

      // </Row>
      // <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: 25 + 'px' }}>
      //   <Col className="gutter-row" span={24}>
      //     <Descriptions title={video.title} layout="vertical">
      //       <Descriptions.Item label="Channel">{video.channel_title}</Descriptions.Item>
      //       <Descriptions.Item label="Published At">{parseDate(video.published_at)}</Descriptions.Item>
      //       <Descriptions.Item label="Duration">{parseDuration(video.duration)}</Descriptions.Item>
      //     </Descriptions>
      //   </Col>
      // </Row> */}



      //     <Space size={12}>
      //     {/* {video.player.embedHtml} */}
      //     <div dangerouslySetInnerHTML={{ __html: video.player.embedHtml }} />

      //     {/* <Image
      //       width={200}
      //       src={video.url}
      //     /> */}

      //     {/* <iframe
      //       title="YouTube Video"
      //       width="560"
      //       height="315"
      //       src={videoUrl}
      //       frameborder="0"
      //       allow="autoplay; encrypted-media"
      //       allowfullscreen
      //     ></iframe> */}

      //     <Descriptions title="Video Info" layout="horizontal">
      //       <Descriptions.Item label="Channel">{video.channelTitle}</Descriptions.Item>
      //       <Descriptions.Item label="Published At">{parseDate(video.publishedAt)}</Descriptions.Item>
      //       <Descriptions.Item label="Title" span={2}>{video.title}</Descriptions.Item>
      //       <Descriptions.Item label="Duration">{parseDuration(video.duration)}</Descriptions.Item>
      //       {/* <Descriptions.Item label="Description" span={2}>{video.description}</Descriptions.Item> */}
      //       <Descriptions.Item label="Views">{video.views}</Descriptions.Item>
      //       <Descriptions.Item label="Likes">{video.likes}</Descriptions.Item>
      //       <Descriptions.Item label="Comments">{video.comments}</Descriptions.Item>
      //     </Descriptions>
      //     </Space>
      //   {/* <Card title="{video.title}" bordered={false}>
      //     <p>{video.title}</p>
      //     <p>Hello, world!</p>
      //  </Card> */}
      //   </>
      // )
