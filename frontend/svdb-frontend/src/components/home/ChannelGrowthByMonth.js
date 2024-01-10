import { Col, Image, List, Row, Select, Spin, Space, Card, Typography, DatePicker, Avatar, Skeleton } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import { getChannelsFn, fetchMostSubChannelByMonth } from "../../services/channelApi.ts";
import { UserOutlined, VideoCameraOutlined, EyeOutlined, LikeOutlined, YoutubeOutlined, RiseOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';
import TopCreatorsMonthly from './TopCreatorsMonthly';



const { Option } = Select;
const { Title, Text, Paragraph } = Typography;

const ChannelGrowthByMonth = () => {
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
  const [topCreators, setTopCreators] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState(dayjs().format('YYYY-MM'));
  const [channelsGrowth, setChannelsGrowth] = useState([]);

  useEffect(() => {

    async function fetchData() {
      await fetchMostSubChannelByMonth(month)
        .then((result) => {
          setIsLoading(false);
          setChannelsGrowth(result.results);
        })

    }
    fetchData();
  }, [month]);


  const handleClick = (id) => {
    const url = '/creator/' + id;
    navigate(url, { state: { id: id } });
  }

  const onRangeChange = (date, dateString) => {
    setMonth(dateString);
    // console.log(date, dateString);
  };
  return (
    <>
      <Row>
        <Col span={24}>
          <Title style={{ color: "black", marginBottom: '25px' }} level={4}>Channel Growth in
          <DatePicker defaultValue={dayjs()}
              style={{marginLeft: '5px'}}
              // size="small" 
              bordered={true}
              onChange={onRangeChange} picker="month" />
          </Title>
        </Col>
      </Row>

      <Row gutter={[16, 16]} justify="center">
        <Col span={12}>

          {
            isLoading ?
              (
                <p>Hello, World {month}</p>
              ) :
              (
                <TopCreatorsMonthly channelsGrowth={channelsGrowth} />
              )
          }

        </Col>
        <Col span={12}>

          {
            isLoading ?
              (
                <p>Hello, World {month}</p>
              ) :
              (
                <p>Otheerside!</p>
                // <TopCreatorsMonthly channelsGrowth={channelsGrowth} />
              )
          }

        </Col>
      </Row>
    </>
  )
}


export default ChannelGrowthByMonth;