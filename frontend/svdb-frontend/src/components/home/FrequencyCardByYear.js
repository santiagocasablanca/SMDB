import { FilterOutlined } from '@ant-design/icons';
import { G2, Heatmap } from '@ant-design/plots';
import { Avatar, Button, Card, Col, Popover, Row, Select, Space, Spin, Typography } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
// import LoadingAnimation from './LoadingAnimation';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { fetchVideoFrequencyFn, getVideosFn } from "../../services/videoApi.ts";



var weekOfYear = require('dayjs/plugin/weekOfYear')
var weekYear = require('dayjs/plugin/weekYear') // dependent on weekOfYear plugin
var timezone = require('dayjs/plugin/timezone')
var utc = require('dayjs/plugin/utc')
var localizedFormat = require('dayjs/plugin/localizedFormat')
dayjs.extend(localizedFormat)
dayjs.extend(utc)
dayjs.extend(timezone);
dayjs.tz.setDefault("Europe/London")
require('dayjs/locale/en-gb')
dayjs.locale('en-gb')
dayjs.extend(weekOfYear)
dayjs.extend(weekYear)
dayjs().weekYear()


const { Option } = Select;
const { Title, Text } = Typography;

const FrequencyCardByYear = ({ _channels, year }) => {
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();
  const [selectedChannels, setSelectedChannels] = useState(_channels.map(item => { return item.channel_id; }));
  const [defaultValue, setDefaultValue] = useState([]);
  const [channels, setChannels] = useState([]);
  const [frequencyData, setFrequencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);


  const handleChannelChange = (channel) => {
    setSelectedChannels(channel);
  };

  useEffect(() => {
    // console.log(_channels, year);
    const temp = [];
    const temp_ids = [];
    if (_channels) {
      _channels.map(item => {
        temp_ids.push(item.channel_id);
        temp.push({
          label: item.title,
          value: item.channel_id,
        });
      })
      setDefaultValue(temp_ids);
      setChannels(temp);
    }
    asyncFetch();
  }, [_channels, refreshKey, year, selectedChannels]);

  const asyncFetch = () => {
    // console.log(selectedYear, year);
    const startDate = dayjs(year);
    // console.log(startDate);
    const endDate = dayjs(year).add(1, 'y'); // Defaults to today

    let daysArray = [];
    let currentDate = startDate;

    while (currentDate.isBefore(endDate)) {
      const month = dayjs(currentDate).format('M');
      let week = dayjs(currentDate).week();
      // console.log(month, week); // Format the date as YYYY-MM-DD
      if (month == 1 && week > 50) {
        week = 0;
      } else if (month == 12 && week == 1) {
        
        // console.log(month, week, currentDate);
        week = 53;
      }
      daysArray.push({
        date: currentDate.format('YYYY-MM-DD'),
        count: 0,
        month: month,
        day: currentDate.format('ddd'),
        week: week,
        extraInfo: {
          views: 0,
          likes: 0,
          comments: 0,
        }
      });
      currentDate = currentDate.add(1, 'day');
    }

    let params = new URLSearchParams();
    params.append("channels", selectedChannels);
    params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    fetchVideoFrequencyFn(params).then((result) => {

      const transformedDataFrequency = result.results.map((item) => {
        const date = dayjs(item.day).format('YYYY-MM-DD');

        return {
          date: date,
          count: item.frequency,
          extraInfo: {
            views: item.views ? item.views : 0,
            likes: item.likes ? item.likes : 0,
            comments: item.comments ? item.comments : 0,
          }
        };
      });

      daysArray.map((item) => {
        // console.log(item);
        const found = transformedDataFrequency.find(it => { return it.date === item.date });
        if (found) {
          item.count = found.count;
          item.extraInfo = found.extraInfo
        }
      })
      setFrequencyData(daysArray);
      setIsLoading(false);
    })
  }


  G2.registerShape('polygon', 'boundary-polygon', {
    draw(cfg, container) {
      const group = container.addGroup();
      const attrs = {
        stroke: '#fff',
        lineWidth: 1,
        fill: cfg.color,
        paht: [],
      };
      const points = cfg.points;
      const path = [
        ['M', points[0].x, points[0].y],
        ['L', points[1].x, points[1].y],
        ['L', points[2].x, points[2].y],
        ['L', points[3].x, points[3].y],
        ['Z'],
      ]; // @ts-ignore

      attrs.path = this.parsePath(path);
      group.addShape('path', {
        attrs,
      });

      if (cfg.data.lastWeek) {
        const linePath = [
          ['M', points[2].x, points[2].y],
          ['L', points[3].x, points[3].y],
        ]; // 最后一周的多边形添加右侧边框

        group.addShape('path', {
          attrs: {
            path: this.parsePath(linePath),
            lineWidth: 4,
            stroke: '#404040',
          },
        });

        if (cfg.data.lastDay) {
          group.addShape('path', {
            attrs: {
              path: this.parsePath([
                ['M', points[1].x, points[1].y],
                ['L', points[2].x, points[2].y],
              ]),
              lineWidth: 4,
              stroke: '#404040',
            },
          });
        }
      }

      return group;
    },
  });

  const heatmapConfig = {
    data: frequencyData,
    height: 200,
    width: 1300,
    autoFit: true,
    xField: 'week',
    yField: 'day',
    colorField: 'count',
    color: ({ count }) => {

      if (count == 0) {
        return '#d92121';
      } else if (count == 1) {
        return variables.freq2;
      }
      else if (count > 1 && count <= 3) {
        return variables.freq3;
      }
      else if (count > 3 && count <= 5) {
        return variables.freq4;
      }
      return variables.freq5;
    },
    reflect: 'y',
    shape: 'boundary-polygon',
    meta: {
      day: {
        type: 'cat',
        values: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      week: {
        type: 'cat',
        values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19',
          '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39',
          '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '50', '51', '52', '53'],
      },
      count: {
        sync: true,
      },
      date: {
        type: 'cat',
      }
    },
    yAxis: {
      grid: null,
    },
    tooltip: {
      title: 'date',
      showMarkers: false,
      customContent: (value, items) => {
        if (!items || items.length <= 0) return;
        const { data: itemData } = items[0];
        let dateParsed = dayjs(itemData.date).format("dddd, MMMM D, YYYY")
        let views = intToStringBigNumber(itemData.extraInfo.views);
        let likes = intToStringBigNumber(itemData.extraInfo.likes);
        let comments = intToStringBigNumber(itemData.extraInfo.comments);
        return (
          `<div class='heatmap-container'>` +
          `<div class='title'>${dateParsed}</div>` +
          `<div class='tooltip-item'><span>#Videos: </span><span>${itemData.count}</span></div>` +
          `<div class='tooltip-item'><span>Views: </span><span>${views}</span></div>` +
          `<div class='tooltip-item'><span>Likes: </span><span>${likes}</span></div>` +
          `<div class='tooltip-item'><span>Comments: </span><span>${comments}</span></div>` +
          `</div>`
        );


        // console.log(dayjs(value))
        const searchDate = dayjs(value);
        const nextDate = searchDate.add(1, 'day');
        // console.log(nextDate.add(1, 'day'));


        let params = new URLSearchParams();
        params.append("sort", "views%desc");
        params.append("channels", ['Sidemen']);
        params.append("publishedAtRange", [value, nextDate.format("YYYY-MM-DD")]);
        getVideosFn(1, 10, params)
          .then((result) => {

            console.log('views')
            return (
              `<div class='container'>` +
              `<div class='title'>${itemData.day} ${itemData.date}</div>` +
              // `<div class='tooltip-item'><span>Frequency: </span><span>${itemData.count}</span></div>` +
              //  `<div class='tooltip-item'><span>Views: </span><span>${views}</span></div>` +
              // `<div class='tooltip-item'><span>Likes: </span><span>${likes}</span></div>` +
              // `<div class='tooltip-item'><span>Comments: </span><span>${comments}</span></div>` +
              `</div>`
            );
          })
          .catch((error) => {
            console.log('error: ' + error);

            return (
              `<div class='container'>` +
              `<div class='title'>${itemData.day} ${itemData.date}</div>` +
              `<div class='tooltip-item'><span>Frequency: </span><span>${itemData.count}</span></div>` +
              `</div>`
            );
          })
      },
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
    xAxis: {
      position: 'top',
      tickLine: null,
      line: null,
      label: {
        offset: 12,
        style: {
          fontSize: 12,
          fill: '#666',
          textBaseline: 'top',
        },
        formatter: (val) => {
          // return val;
          if (val === 1) {
            return 'JAN';
          } else if (val === '6') {
            return 'FEV';
          } else if (val === '9') {
            return 'MAR';
          } else if (val === '15') {
            return 'MAY';
          } else if (val === '22') {
            return 'JUN';
          } else if (val === '35') {
            return 'SET';
          } else if (val === '40') {
            return 'OCT';
          } else if (val === '48') {
            return 'DEZ';
          }

          return '';
        },
      },
    },
  };

  insertCss(`
  
  .heatmapContainer {
    padding: 20px 20px 20px 20px;
    width: 100%;
  }
  .title{
    font-weight: bold;
    font-size: 15px;
  }

  @media (max-width: 600px) {
    .heatmapContainer {
    }
  }
  `);

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
          <>
            <Row>
              <Col span={24}>
                <Title style={{ color: "black" }} level={5}>
                  <Select require mode="multiple" allowClear maxTagCount='responsive' style={{ width: "350px", fontSize: '11px' }} onChange={handleChannelChange} value={selectedChannels} options={channels}>

                  {/* Add more options as needed */}
                </Select> {year} Upload Frequency Heatmap</Title>
              </Col>
            </Row>
            <Row>
              <Card bodyStyle={{ padding: 0, paddingTop: '16px', paddingBottom: '16px' }} className="heatmapContainer">

                <Heatmap {...heatmapConfig} />
                <div style={{ position: 'absolute', bottom: '5px', right: '10px' }}>
                  <Text style={{ float: 'right', marginTop: '10px' }} type="secondary">Less <Space gutter={2}>
                    <Popover content={<Text>0 Uploads</Text>} placement="top">
                      <Avatar style={{ backgroundColor: variables.freq1 }} shape="square" size="small" />
                    </Popover>
                    <Popover content={<Text>1 Upload</Text>} placement="top">
                      <Avatar style={{ backgroundColor: variables.freq2 }} shape="square" size="small" />
                    </Popover>
                    <Popover content={<Text>1 to 3 Uploads</Text>} placement="top">
                      <Avatar style={{ backgroundColor: variables.freq3 }} shape="square" size="small" />
                    </Popover>
                    <Popover content={<Text>4 to 5 Uploads</Text>} placement="top">
                      <Avatar style={{ backgroundColor: variables.freq4 }} shape="square" size="small" />
                    </Popover>
                    <Popover content={<Text>More than 6 Uploads</Text>} placement="top">
                      <Avatar style={{ backgroundColor: variables.freq5 }} shape="square" size="small" />
                    </Popover>
                  </Space> More</Text>
                </div>
              </Card>


            </Row>

          </>
        )
      }
    </>
  )
}

export default FrequencyCardByYear
