import dayjs from "dayjs";
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { fetchVideoFrequencyFn } from "../services/videoApi.ts";
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



const FrequencyCard = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear().toString());
  const [selectedChannels, setSelectedChannels] = useState(['Sidemen', 'MoreSidemen', 'SidemenReacts']);
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
      if (month == 1 && week > 50) {
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

  const intToStringBigNumber = num => {
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
      
    </>
  )
}

export default FrequencyCard
