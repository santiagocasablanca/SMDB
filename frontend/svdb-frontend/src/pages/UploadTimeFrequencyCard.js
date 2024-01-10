import { Heatmap } from '@ant-design/plots';
import { Card, Col, Row, Select, Space } from 'antd';
import dayjs from "dayjs";
// import { LikeOutlined,StarOutlined,MessageOutlined, EyeOutlined, NumberOutlined } from '@ant-design/icons';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { fetchVideoUploadTimeFrequencyFn } from "../services/videoApi.ts";



const { Option } = Select;

const UploadTimeFrequencyCard = () => {
  const [selectedYear, setSelectedYear] = useState();
  const [selectedChannels, setSelectedChannels] = useState(['Sidemen','MoreSidemen', 'SidemenReacts']);
  const [frequencyData, setFrequencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleYearChange = (year) => {
    setSelectedYear(year);
  };

  const handleChannelChange = (channel) => {
    setSelectedChannels(channel);
  };


  useEffect(() => {
    asyncFetch();
 }, [refreshKey, selectedYear, selectedChannels]);

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

    if(selectedYear) {
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
          views: item.views ? item.views: 0,
          likes: item.likes ? item.likes : 0,
          comments: item.comments ? item.comments : 0,
      }};
    });

    weekArray.map((item) => {
      const found = transformedDataFrequency.find(it => {return (it.week === item.week & it.time === item.time)});

      if(found) {
        item.count = found.count;
        item.extraInfo = found.extraInfo
      }
    })

    setFrequencyData(weekArray);
    setIsLoading(false);
    })
 }

 const intToStringBigNumber = num => {
  num = num.toString().replace(/[^0-9.]/g, '');
  if (num < 1000) {
      return num;
  }
  let si = [
    {v: 1E3, s: "K"},
    {v: 1E6, s: "M"},
    {v: 1E9, s: "B"},
    {v: 1E12, s: "T"},
    {v: 1E15, s: "P"},
    {v: 1E18, s: "E"}
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
  .heatmap-container{
    padding: 16px 0px;
    width: 200px;
    display: flex;
    flex-direction: column;
  }
  .title{
    font-weight: bold;
    font-size: 15px;
  }
`);

const heatmapTimeConfig = {
  data: frequencyData,
  xField: 'time',
  yField: 'week',
  colorField: 'count',
  legend: true,
  color: '#BAE7FF-#1890FF-#1028ff',
  // color: ({ count }) => {

  //   if(count == 0){
  //     return 'azure';
  //   } else if(count == 1) {
  //     return '#89CFF0';
  //   }
  //   else if(count == 2) {
  //     return '#0096FF';
  //   }
  //   else if(count == 3) {
  //     return '#0047AB';
  //   }
  //   return '#581845';
  // },
  coordinate: {
    // 坐标轴属性配置
    type: 'polar',
    // 极坐标
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
      values: ['0', '1', '2', '3', '4', '5', '6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23'],
      formatter: (val) => {
        return val+'h';
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


  return (
    <>
    {isLoading ? (
      <p>Loading...</p>
    ) : (
      <>
    <Card title="Day and Time Upload Frequency" style={{width:100+'%'}}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="end" style={{marginBottom:15+'px'}}>
        <Col>
          <Space.Compact block>
            <Select defaultValue={selectedYear} onChange={handleYearChange} >
              <Option value="">All Years</Option>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
              <Option value="2021">2021</Option>
              <Option value="2020">2020</Option>
              <Option value="2019">2019</Option>
              <Option value="2018">2018</Option>
              <Option value="2017">2017</Option>
              <Option value="2016">2016</Option>

            </Select>

            <Select mode="multiple" value={selectedChannels} defaultValue={selectedChannels} onChange={handleChannelChange}>
              <Option value="Sidemen">Sidemen</Option>
              <Option value="MoreSidemen">MoreSidemen</Option>
              <Option value="SidemenReacts">SidemenReacts</Option>

            </Select>
          </Space.Compact>
        </Col>

      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row">
          <Heatmap {...heatmapTimeConfig} />
        </Col>
      </Row>
    </Card>

      </>
    )}
    </>
  )
}

export default UploadTimeFrequencyCard
