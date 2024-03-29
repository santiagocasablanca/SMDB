import { G2, Heatmap } from '@ant-design/plots';
import { Card, Col, Row, Select, Space } from 'antd';
import dayjs from "dayjs";
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { fetchVideoFrequencyFn, getVideosFn } from "../services/videoApi.ts";
// import LoadingAnimation from './LoadingAnimation';

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

const FrequencyCard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
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
  const startDate = dayjs(selectedYear);
  const endDate = dayjs(selectedYear).add(1, 'y'); // Defaults to today

  let daysArray = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate)) {
    const month = dayjs(currentDate).format('M');
    let week = dayjs(currentDate).week(); // Format the date as YYYY-MM-DD
      if(month==1 && week>50) {
        week = 0;
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
          views: item.views ? item.views: 0,
          likes: item.likes ? item.likes : 0,
          comments: item.comments ? item.comments : 0,
      }};
    });

    daysArray.map((item) => {
      // console.log(item);
      const found = transformedDataFrequency.find(it => {return it.date === item.date});
      if(found) {
        item.count = found.count;
        item.extraInfo = found.extraInfo
      }
    })
    setFrequencyData(daysArray);
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
height: 400,
width: 1300,
autoFit: true,
xField: 'week',
yField: 'day',
colorField: 'count',
color: ({ count }) => {

  if(count == 0){
    return 'azure';
  } else if(count == 1) {
    return '#89CFF0';
  }
  else if(count == 2) {
    return '#0096FF';
  }
  else if(count == 3) {
    return '#0047AB';
  }
  return '#581845';
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
    values: ['0','1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19',
    '20','21','22','23','24', '25','26','27','28','29', '30','31','32','33','34', '35','36','37','38','39',
    '40','41','42','43','44', '45','46','47','48','49', '50','51','52'],
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
    const nextDate = searchDate.add(1,'day');
    // console.log(nextDate.add(1, 'day'));


    let params = new URLSearchParams();
    params.append("sort", "views%desc");
    params.append("channels", ['Sidemen']);
    params.append("publishedAtRange", [value, nextDate.format("YYYY-MM-DD")]);
    getVideosFn(1,10, params)
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



  return (
    <>
    {isLoading ? (
      // <LoadingAnimation />
      <p>Loading...</p>
    ) : (
      <>
    <Card title="Yearly Upload Frequency Heatmap" style={{width:100+'%'}}>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="end" style={{marginBottom:15+'px'}}>
        <Col>
          <Space.Compact block>
            <Select defaultValue={selectedYear} onChange={handleYearChange}>
              <Option value="2023">2023</Option>
              <Option value="2022">2022</Option>
              <Option value="2021">2021</Option>
              <Option value="2020">2020</Option>
              <Option value="2019">2019</Option>
              <Option value="2018">2018</Option>
              <Option value="2017">2017</Option>
              <Option value="2016">2016</Option>
              {/* Add more options as needed */}
            </Select>

            <Select mode="multiple" value={selectedChannels} defaultValue={selectedChannels} onChange={handleChannelChange}>
              <Option value="Sidemen">Sidemen</Option>
              <Option value="MoreSidemen">MoreSidemen</Option>
              <Option value="SidemenReacts">SidemenReacts</Option>
              {/* Add more options as needed */}
            </Select>
          </Space.Compact>
        </Col>

      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row">
          <Heatmap {...heatmapConfig} />
        </Col>
      </Row>
    </Card>

      </>
    )}
    </>
  )
}

export default FrequencyCard
