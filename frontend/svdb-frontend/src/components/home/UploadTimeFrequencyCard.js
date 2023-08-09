import { FilterOutlined } from '@ant-design/icons';
import { Heatmap } from '@ant-design/plots';
import { Avatar, Button, Card, Col, Popover, Row, Select, Space, Spin, Typography } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
// import { LikeOutlined,StarOutlined,MessageOutlined, EyeOutlined, NumberOutlined } from '@ant-design/icons';
import useFormatter from '../../hooks/useFormatter';
import variables from '../../sass/antd.module.scss';
import { fetchVideoUploadTimeFrequencyFn } from "../../services/videoApi.ts";




const { Title, Text } = Typography;
const { Option } = Select;

const UploadTimeFrequencyCard = (_channels) => {
  const { intToStringBigNumber, parseDate, parseDuration, humanizeDurationFromSeconds, displayVideoDurationFromSeconds, displayDurationFromSeconds } = useFormatter();

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedChannels, setSelectedChannels] = useState(_channels._channels.map(item => { return item.channel_id; }));
  const [frequencyData, setFrequencyData] = useState([]);
  const [defaultValue, setDefaultValue] = useState([]);
  const [channels, setChannels] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleChannelChange = (channel) => {
    setSelectedChannels(channel);
  };


  useEffect(() => {
    const temp = [];
    const temp_ids = [];
    if (_channels) {
      _channels._channels.map(item => {
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
  }, [_channels, refreshKey, selectedYear, selectedChannels]);

  const asyncFetch = () => {
    const weekArray = [];
    const daysInWeek = 7;
    const hoursInDay = 24;

    for (let day = 0; day < daysInWeek; day++) {
      for (let hour = 0; hour < hoursInDay; hour++) {
        const obj = {
          week: day,
          time: hour,
          count: 0,
          extraInfo: {}
        };
        weekArray.push(obj);
      }
    }

    // console.log(weekArray);

    let params = new URLSearchParams();
    params.append("channels", selectedChannels);

    if (selectedYear) {
      const startDate = dayjs(selectedYear);
      const endDate = dayjs(selectedYear).add(1, 'y'); // Defaults to today
      params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    }
    fetchVideoUploadTimeFrequencyFn(params).then((result) => {

      const transformedDataFrequency = result.results.map((item) => {
        // const date = dayjs(item.day).format('YYYY-MM-DD');
        return {
          week: parseInt(item.week_day),
          time: parseInt(item.upload_hour),
          count: parseInt(item.frequency),
          extraInfo: {
            views: item.views ? item.views : 0,
            likes: item.likes ? item.likes : 0,
            comments: item.comments ? item.comments : 0,
          }
        };
      });

      weekArray.map((item) => {
        const found = transformedDataFrequency.find(it => { return (it.week === item.week & it.time === item.time) });

        if (found) {
          item.count = found.count;
          item.extraInfo = found.extraInfo
        }
      })

      // console.log(weekArray);

      setFrequencyData(weekArray);
      setIsLoading(false);
    })
  }

  insertCss(`
  .heatmap-container{
    margin-top:10px;
    padding: 16px 0px;
    width: 200px;
    display: flex;
    flex-direction: column;
  }
  .title{
    font-weight: bold;
    font-size: 15px;
  }
  .heatmapLegend {
    position: absolute;
    bottom: 5px; 
    right: 10px
  }

  @media (max-width: 600px) {
    .heatmapLegend {
      position: absolute;
      bottom: 5px; 
      right: 10px
    }
  }
`);

  const heatmapTimeConfig = {
    data: frequencyData,
    xField: 'time',
    yField: 'week',
    colorField: 'count',
    // legend: true,
    color: ({ count }) => {

      if (count == 0) {
        return variables.freq1;
      } else if (count > 0 && count <= 10) {
        return variables.freq2;
      }
      else if (count > 10 && count <= 20) {
        return variables.freq3;
      }
      else if (count > 20 && count <= 30) {
        return variables.freq4;
      }
      return variables.freq5;
    },
    coordinate: {
      type: 'polar',
      cfg: {
        innerRadius: 0.2,
      },
    },
    heatmapStyle: {
      stroke: '#f5f5f5',
      opacity: 0.8,
    },
    meta: {
      week: {
        type: 'cat',
        values: ['0', '1', '2', '3', '4', '5', '6'],
        formatter: (val) => {
          if (val == '0') {
            return 'Sunday';
          } else if (val == 1) {
            return 'Monday';
          } else if (val == 2) {
            return 'Tuesday';
          } else if (val == 3) {
            return 'Wednesday';
          } else if (val == 4) {
            return 'Thursday';
          } else if (val == 5) {
            return 'Friday';
          } else if (val == 6) {
            return 'Saturday';
          }

          return '';
        },
      },
      time: {
        type: 'cat',
        values: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'],
        formatter: (val) => {
          return val + 'h';
        }
      },
      count: {
        sync: true,
      },

    },
    xAxis: {
      line: null,
      grid: null,
      tickLine: null,
      label: {
        offset: 12,
        style: {
          fill: '#666',
          fontSize: 12,
          textBaseline: 'top',
        },
      },
    },
    yAxis: {
      top: true,
      line: null,
      grid: null,
      tickLine: null,
      label: {
        offset: 0,
        style: {
          fill: '#fff',
          textAlign: 'center',
          shadowBlur: 2,
          shadowColor: 'rgba(0, 0, 0, .45)',
        },
      },
    },
    tooltip: {
      showMarkers: false,
    },
    interactions: [
      {
        type: 'element-active',
      },
    ],
  };

  const filterPopover = (
    <Space.Compact block >
      <Select defaultValue={selectedYear} onChange={handleYearChange}>
        <Option value="2023">2023</Option>
        <Option value="2022">2022</Option>
        <Option value="2021">2021</Option>
        <Option value="2020">2020</Option>
        <Option value="2019">2019</Option>
        <Option value="2018">2018</Option>
        <Option value="2017">2017</Option>
        <Option value="2016">2016</Option>
        <Option value="2015">2015</Option>
        <Option value="2014">2014</Option>
        <Option value="2013">2013</Option>
        <Option value="2012">2012</Option>
        <Option value="2011">2011</Option>
        <Option value="2010">2010</Option>
        <Option value="2009">2009</Option>
        <Option value="2008">2008</Option>
        {/* Add more options as needed */}
      </Select>


      <Select mode="multiple" allowClear maxTagCount='responsive' style={{ width: "350px", fontSize: '12px' }} value={selectedChannels} onChange={handleChannelChange} options={channels}>
        {/* Add more options as needed */}
      </Select>
    </Space.Compact>

  );

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
          <>
            <Row>
              <Col span={24}>
                <Title style={{ color: "black" }} level={5}>Day and Time Upload Frequency Heatmap</Title>
              </Col>
            </Row>
            <Row justify="center">
              <Col span={24}>
                <Card bodyStyle={{ padding: '3px', paddingTop: '20px', paddingBottom: '50px' }}>
                  <div style={{ position: 'absolute', top: '5px', right: '10px' }}>
                    <Popover content={filterPopover} placement="bottom">
                      <Button style={{ color: "white", paddingBottom: "2px" }} type="text" icon={<FilterOutlined />} />
                    </Popover>
                  </div>
                  <Heatmap {...heatmapTimeConfig} />
                  <div className="heatmapLegend">

                    <Text style={{ float: 'right', marginTop: '0px' }} type="secondary">Less <Space gutter={2}>
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
              </Col>
            </Row>
          </>
        )}
    </>
  )
}

export default UploadTimeFrequencyCard
