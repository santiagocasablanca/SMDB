import { FilterOutlined } from '@ant-design/icons';
import { Button, Col, Row, Space, Tooltip, List, Carousel, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import TopCreators from './TopCreators';
import VideoPreviewForHighlight from '../video/VideoPreviewForHighlight';






const { Title } = Typography;

const MonthlyHighlightedCreators = ({ top10videos, topChannelIds, channelsGrowth }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  const [fetchedData, setFetchedData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();


  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {

  }

  const HighlightedVideos = ({ title, videos, segmentedValue, onChangeSegmentedValue }) => {
    const [index, setIndex] = useState(0);
    return (
      <>
        <Row><Col span={24}><Title style={{ color: 'black', marginBottom: '25px' }} level={4}>{title}</Title></Col></Row>

        <Carousel dots={false} style={{ color: variables.richBlack }} autoplay autoplaySpeed={8000} speed={900} fade={true}>
          {videos?.map((video, index) => {
            // setIndex(index);
            return (
              <VideoPreviewForHighlight _video={video} key={video.video_id}></VideoPreviewForHighlight>
            )

          })}
        </Carousel>
        {/* <List 
         dataSource={videos}
         renderItem={(item, index) => (
           <List.Item >
             {item.video_id}
           </List.Item>
         )}
         /> */}
         {/* <VideoPreviewForHighlight _video={item} key={item.video_id}></VideoPreviewForHighlight> */}
        
      </>
    );
  }

  // const HighlightedCreators = ({ title, channel_ids }) => {

  //   return (
  //     <>
  //       <Row><Col span={24}><Title style={{ color: 'black' }} level={5}>{title}</Title></Col></Row>

  //       <Carousel dots={false} style={{ color: variables.richBlack }} autoplay >
  //         {videos?.map((video, index) => {
  //           return (
  //             <VideoPreviewForHighlight _video={video} key={video.video_id}></VideoPreviewForHighlight>
  //           )

  //         })}
  //       </Carousel>
  //     </>
  //   );
  // }


  return (<>
    <Row gutter={[16, 16]}>
      <Col span={24} sm={24} md={24} lg={12} xl={15} xs={{ order: 2 }} sm={{ order: 2 }} md={{ order: 1 }} lg={{ order: 1 }}>
        <HighlightedVideos title="Highlighted" videos={top10videos}></HighlightedVideos>
      </Col>
      <Col span={24} sm={24} md={24} lg={12} xl={9} xs={{ order: 1 }} sm={{ order: 1 }} md={{ order: 2 }} lg={{ order: 2 }}>
        <TopCreators channel_ids={topChannelIds} channelsGrowth={channelsGrowth}/>
      </Col>
    </Row>
  </>);
};


export default MonthlyHighlightedCreators;
