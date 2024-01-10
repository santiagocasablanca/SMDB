import { Col, Row, Carousel, Typography } from 'antd';
import React from 'react';
import variables from '../../sass/antd.module.scss';
import TopCreators from './TopCreators';
import VideoPreviewForHighlight from '../video/VideoPreviewForHighlight';


const { Title } = Typography;

const MonthlyHighlightedCreators = ({ top10videos, topChannelIds, channelsGrowth }) => {
  
  const HighlightedVideos = ({ title, videos, segmentedValue, onChangeSegmentedValue }) => {
    return (
      <>
        <Row><Col span={24}><Title style={{ color: 'black', marginBottom: '25px' }} level={4}>{title}</Title></Col></Row>

        <Carousel dots={false} style={{ color: variables.richBlack }} autoplay autoplaySpeed={8000} speed={900} fade={true}>
          {videos?.map((video, index) => {
            return (
              <VideoPreviewForHighlight _video={video} key={video.video_id}></VideoPreviewForHighlight>
            )

          })}
        </Carousel>
      </>
    );
  }

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
