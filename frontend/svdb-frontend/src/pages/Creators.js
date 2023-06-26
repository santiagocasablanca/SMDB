import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image, Badge, Space, Popover, Tag } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import ReactPlayer from 'react-player'


import { getCreatorsFn } from "../services/creatorApi.ts";
import { getVideosFn } from "../services/videoApi.ts";


import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import variables from '../sass/antd.module.scss'


import dayjs from "dayjs"
// import insertCss from 'insert-css';
// // import LoadingAnimation from './LoadingAnimation';

// var weekOfYear = require('dayjs/plugin/weekOfYear')
// var weekYear = require('dayjs/plugin/weekYear') // dependent on weekOfYear plugin
// var timezone = require('dayjs/plugin/timezone')
// var utc = require('dayjs/plugin/utc')
// var localizedFormat = require('dayjs/plugin/localizedFormat')
// dayjs.extend(localizedFormat)
// dayjs.extend(utc)
// dayjs.extend(timezone);
// dayjs.tz.setDefault("Europe/London")
// require('dayjs/locale/en-gb')
// dayjs.locale('en-gb')
// dayjs.extend(weekOfYear)
// dayjs.extend(weekYear)
// dayjs().weekYear()

const CreatorPage = () => {

  const [fetchedData, setFetchedData] = useState([]);

  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    let params = new URLSearchParams();
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    getCreatorsFn(params).then((result) => {
      console.log(result)
      if (result.results) {
        setFetchedData(result.results);
      }
    })
  }

  const intToStringBigNumber = num => {
    if (num == undefined) return 0;
    num = num.toString().replace(/[^0-9.]/g, '');
    if (num < 1000) {
      return num;
    }
    let si = [
      { v: 1E3, s: "K" },
      { v: 1E6, s: "M" },
      { v: 1E9, s: "B" },
      { v: 1E12, s: "T" },
      { v: 1E15, s: "P" },
      { v: 1E18, s: "E" }
    ];
    let index;
    for (index = si.length - 1; index > 0; index--) {
      if (num >= si[index].v) {
        break;
      }
    }
    return (num / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + si[index].s;
  };

  insertCss(`
  .stats-panel {
    position: absolute;
    bottom: 55px;
    right: 10px;
    z-index: 10;
    background-color: rgba(255, 245, 54, 0.7);
    padding: 5px;
    border-radius: 5px;
  }
  
  .stats-tag {
    display: grid;
    gap: 5px;
  }

  .stats-tag span {
    margin-inline-end: 0px;
  }

  .since-panel {
    position: absolute;
    top: 10px;
    right: 5px;
    z-index: 10;
    background-color: rgba(255, 245, 54, 0.7);
    color: black;
    padding: 2px;
    border-radius: 5px;
  }

  .since-tag {
  }
  .since-tag span {
    white-space:nowrap;
  }

  `)

  const StatsPanel = ({ subs, views, videos }) => {
    const content = (
      <div>
        <p>Total Subscribers: {subs}</p>
        <p>Total Views: {views}</p>
        <p>Total Videos: {videos}</p>
      </div>
    );

    return (
      <div className="stats-panel">
        <Popover content={content} placement="topLeft">
          <div className="stats-tag">
            <Tag icon={<YoutubeOutlined />} color="blue">{subs}</Tag>
            <Tag icon={<EyeOutlined />} color="green">{views}</Tag>
            <Tag icon={<VideoCameraOutlined />} color="orange">{videos}</Tag>
          </div>
        </Popover>
      </div>
    );
  };

  const SincePanel = ({ channels }) => {
    const [isFetched, setIsFetched] = useState(false);
    const [oldestCreationDate, setOldestCreationDate] = useState({});

    const sortedChannels = channels.sort(
      (a, b) => new Date(a.channel_created_at) - new Date(b.channel_created_at)
    );

    useEffect(() => {
      // console.log(channels);
      if (channels) {
        const oldestChannel = channels.reduce((oldest, current) => {
          console.log(current.channel_created_at);
          if (!oldest) {
            return current;
          }
          return current.channel_created_at < oldest.channel_created_at ? current : oldest;
        }, null);

        setIsFetched(true);
        setOldestCreationDate(oldestChannel.channel_created_at);
      }
    }, []);

    const content = (
      <List
        size="small"
        dataSource={sortedChannels}
        renderItem={(channel) => (
          <List.Item><p>{channel.title} - {dayjs(channel.channel_created_at).format("MMM YYYY")}</p></List.Item>
        )}
      />
    );

    // header={<div><div style={{left:'5px'}}>Channel</div> <div style={{right:'5px'}}> Created at</div></div>}
    return (
      <>
        {!isFetched ? (
          // <LoadingAnimation />
          <p>Loading...</p>
        ) : (
            <div className="since-panel">
              <Popover content={content} placement="bottomRight">
                <div className="since-tag">
                  <span><CalendarOutlined /> Since {dayjs(oldestCreationDate).format("MMM YYYY")}</span>
                </div>
              </Popover>
            </div>
          )}
      </>
    );
  };
  
  return (<>
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
      className="scrollmenu"
      itemLayout="horizontal"
      style={{
        background: variables.sdmnPink,
        padding: 20,
        marginTop: 20,
        marginBottom: 20,
        borderRadius: '5px'
      }}
      // loading={isTop10VideosLoaded}
      dataSource={fetchedData}
      renderItem={(item) => (
        <List.Item>
          <Card title={item.name}
            style={{ width: '100%', maxWidth: '450px' }}
            // bodyStyle={{ padding: 0 }}
            // actions={[
            //   <YoutubeOutlined key="setting" />,
            //   <EyeOutlined key="edit" />,
            //   <VideoCameraOutlined key="ellipsis" />,
            // ]}
            cover={
              // <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                <Image alt={item.name}
                  // style={{ maxHeight: '100%', objectFit: 'cover' }}
                  style={{ height: '300px', objectFit: 'cover', borderRadius: '5px' }}
                  src={item.profile_picture}
                  preview={false}
                  fallback="data:image/png;base64,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"
                />
              // </div>
            }
            hoverable
          >
            <SincePanel channels={item.channels}></SincePanel>
            <StatsPanel subs={intToStringBigNumber(item.subs)} videos={intToStringBigNumber(item.videos)} views={intToStringBigNumber(item.views)}></StatsPanel>
          </Card>
        </List.Item>
      )}
    />
  </>);
};


export default CreatorPage;