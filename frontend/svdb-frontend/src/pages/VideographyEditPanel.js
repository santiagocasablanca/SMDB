import { Row, Col, Typography, List, Avatar, Button, Popconfirm, Space, Card, Image, Descriptions, Form, Input, DatePicker, Select } from 'antd';
import { LikeOutlined, MessageOutlined, EyeOutlined } from '@ant-design/icons';
import { React, useEffect, useState } from "react"
import { getVideosFn } from "../services/videoApi.ts"
import variables from '../sass/antd.module.scss'
import ReactPlayer from 'react-player'


import dayjs from "dayjs"
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
const { Text, Link } = Typography;

const VideographyEditPanel = ({ video, onChange }) => {

  const parseDuration = (duration) => {
    return dayjs.duration(duration).format('HH:mm:ss')
  }

  const parseDate = (date) => {
    return dayjs(date).format('YYYY-MM-DD HH:mm:ss')
  }

  const intToStringBigNumber = num => {
    if (num == null || num == '') return '';
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


  const stats = [
    {
      key: 'views',
      title: 'Views',
      icon: <EyeOutlined />
    },
    {
      key: 'likes',
      title: 'Likes',
      icon: <LikeOutlined />
    },
    {
      key: 'comments',
      title: 'Comments',
      icon: <MessageOutlined />
    }
  ];


  const divStyle = {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }

  const iframeStyle = {
    flexGrow: 1,
    border: 'none',
    margin: 0,
    padding: 0,
  }


  return (
    <div className="editPanel">
      <Row>
        <ReactPlayer url={video.player.embedHtml} width='100%'></ReactPlayer>
      </Row>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginTop: 5 + 'px', padding: 10 }}>
        <Col className="gutter-row" span={24}>
          <Descriptions title={video.title} layout="horizontal">
            <Descriptions.Item label="Channel">{video.channel_title}</Descriptions.Item>
            <Descriptions.Item label="Published At">{parseDate(video.published_at)}</Descriptions.Item>
            <Descriptions.Item label="Duration">{parseDuration(video.duration)}</Descriptions.Item>
            <Descriptions.Item label="Views">{intToStringBigNumber(video.views)}</Descriptions.Item>
            <Descriptions.Item label="Likes">{intToStringBigNumber(video.likes)}</Descriptions.Item>
            <Descriptions.Item label="Comments">{intToStringBigNumber(video.comments)}</Descriptions.Item>
          </Descriptions>
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
