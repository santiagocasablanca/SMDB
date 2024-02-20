
import { EyeOutlined, LikeOutlined, LineChartOutlined, YoutubeOutlined } from '@ant-design/icons';
import { Avatar, Col, Row, Space, Spin, Typography, Tabs, Table, Timeline, Tag, Grid, Drawer, Image, Card, Collapse, Divider } from 'antd';
import dayjs from 'dayjs';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HorizontalHighlightedList from '../components/video/HorizontalHighlightedList';
import HorizontalShortsList from '../components/video/HorizontalShortsList';
import VideoPreviewForHighlight from '../components/video/VideoPreviewForHighlight';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';
import { getChannelsFn, fetchMostSubChannelByMonth } from "../services/channelApi.ts";
import { getCreatorsFn } from "../services/creatorApi.ts";
import { getVideosFn, getVideoFn } from "../services/videoApi.ts";
// import VideoDrawer from './VideoDrawer';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import AppLoading from '../components/AppLoading';
import Year23Timeline from './Year23Timeline';
import Year23Overview from './Year23Overview';
import VideographyPage from '../components/videography/VideographyPage';
import CreatorFilterPage from '../components/videography2023/CreatorFilterPage';
import ChannelsFilterPage from '../components/videography2023/ChannelsFilterPage';
import ChannelSelector from '../components/videography2023/ChannelSelector';
import CreatorGraphsPanel from '../components/videography2023/CreatorGraphsPanel';

const { Title, Text, Paragraph } = Typography;
const { CheckableTag } = Tag;
const { useBreakpoint } = Grid;

const Year23Page = () => {
  const navigate = useNavigate();
  const { xs } = useBreakpoint(); // xs is one of the elements returned if screenwidth exceeds 991
  const myDrawerSize = xs ? 'small' : 'large';

  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState([]);
  const [top100videos, setTop100videos] = useState([]);
  const [channels, setChannels] = useState([]);
  const [creators, setCreators] = useState([]);
  const [selectedCreators, setSelectedCreators] = useState([]);
  const [selectedCreatorsChannels, setSelectedCreatorsChannels] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  const handleSelectedCreatorsChange = (newSelectedCreators) => {
    setSelectedCreators(newSelectedCreators);

    const channels = newSelectedCreators.reduce((acc, creator) => {
      creator.channels.forEach((channel) => {
        const existingChannel = acc.find((c) => c.channel_id === channel.channel_id);
        if (!existingChannel) {
          acc.push({
            channel_id: channel.channel_id,
            custom_url: channel.custom_url,
            title: channel.title,
            subs: channel.subs,
            videos: channel.videos,
            views: channel.views,
            likes: channel.likes,
            comments: channel.comments,
            logo_url: channel.logo_url,
            banner_url: channel.banner_url,
            channel_created_at: channel.channel_created_at,
          });
        }
      });
      return acc;
    }, []);
    // console.log(newSelectedCreators, channels);
    setSelectedCreatorsChannels(channels);
  };

  const handleSelectedChannelsChange = (newSelectedChannels) => {
    setSelectedChannels(selectedCreatorsChannels.filter((channel) => { return newSelectedChannels.includes(channel.channel_id)}));
  };


  const [open, setOpen] = useState(false);

  insertCss(`  
  .year23Container {
    margin: 0 80px auto;
    margin-top: 25px;
  }

  @media (max-width: 1400px) {
    .year23Container {
      margin: 0 20px;
      margin-top: 25px;
    }
  }

  @media (max-width: 600px) {
    .year23Container {
      margin: 0 10px;
      margin-top: 25px;
    }
  }
  `
  );


  return (<>
    {/* <HeaderPanel title="Home" channels={channels}></HeaderPanel> */}
    {true ?
      (
        <>
          <div className="year23Container">
            <Row justify="center">
              <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={18}>
                <Title style={{ color: 'black', justify: 'center' }} level={2}><YoutubeOutlined style={{ marginRight: '5px' }} />2023</Title>
                <Collapse
                  size="small"
                  open={true}
                  defaultActiveKey={['1']}
                  items={[
                    {
                      key: '1',
                      label: 'Filter Creators/Channels',
                      children: <span>
                        <Title level={5}>Creators</Title>
                        <CreatorFilterPage onSelectedCreatorsChange={handleSelectedCreatorsChange} />
                        <Title level={5}>Channels</Title>
                        {/* <ChannelsFilterPage onSelectedChannelsChange={handleSelectedChannelsChange} channels={selectedCreatorsChannels} /> */}
                        <ChannelSelector channels={selectedCreatorsChannels} onChange={handleSelectedChannelsChange} />
                      </span>,
                    },
                  ]}
                />

              </Col>
            </Row>
            <Row justify="center">
              <Tabs
                style={{ width: '100%' }}
                defaultActiveKey="1"
                items={[
                  {
                    key: '1',
                    label: 'Overview',
                    children: <Year23Overview selectedChannels={selectedChannels} selectedCreators={selectedCreators} />,
                  },
                  {
                    key: '2',
                    label: 'Timeline',
                    children: <Year23Timeline selectedChannels={selectedChannels} />,
                  },
                  {
                    key: '3',
                    label: 'Graphs',
                    children: <CreatorGraphsPanel title="Graphs" _channels={selectedCreatorsChannels} />,
                  },
                  // {
                  //   key: '3',
                  //   label: 'Videography',
                  //   children: <VideographyPage />,
                  // },
                ]}
              />
            </Row>
            <br></br>
          </div>

        </>
      ) : (
        <AppLoading />
      )
    }
  </>);
};


export default Year23Page;
