import { useMemo } from 'react';
import dayjs from 'dayjs';
var duration = require('dayjs/plugin/duration')
dayjs.extend(duration)
var relativeTime = require('dayjs/plugin/relativeTime')
dayjs.extend(relativeTime)

const useFormatter = () => {
  const intToStringBigNumber = useMemo(
    () => {
      const formatNumber = num => {
        if (num === undefined || num === null) return 0;
        const numericString = num.toString().replace(/[^0-9.]/g, '');
        const parsedNum = parseFloat(numericString).toFixed(0);
        if (parsedNum < 1000) {
          return parsedNum.toString();
        }
        const si = [
          { v: 1E3, s: 'K' },
          { v: 1E6, s: 'M' },
          { v: 1E9, s: 'B' },
          { v: 1E12, s: 'T' },
          { v: 1E15, s: 'P' },
          { v: 1E18, s: 'E' },
        ];
        let index;
        for (index = si.length - 1; index > 0; index--) {
          if (parsedNum >= si[index].v) {
            break;
          }
        }
        const formattedNum = (parsedNum / si[index].v).toFixed(2).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, '$1');
        return formattedNum + si[index].s;
      };
      return formatNumber;
    },
    []
  );

  const parseDateToFromNow = useMemo(
    () => {
      return (date) => dayjs(date).fromNow();
    },
    []
  );

  const parseDate = useMemo(
    () => {
      return (date, format = 'DD MMM YYYY HH:mm:ss') => dayjs(date).format(format);
    },
    []
  );

  const parseDuration = useMemo(
    () => {
      return duration => dayjs.duration(duration).format('HH:mm:ss');
    },
    []
  );

  const humanizeDurationFromSeconds = useMemo(
    () => {
      return (durationAsSeconds) => dayjs.duration(durationAsSeconds, 'seconds').humanize();
    }, 
    []
  )


//        const returnValue = parsed.get('days') + 'd, ' + parsed.get('hours') + 'h and ' + parsed.get('minutes') + 'm'
  const displayDurationFromSeconds = useMemo(
    () => {
      return (durationAsSeconds) => {
        const parsed = dayjs.duration(durationAsSeconds, 'seconds');
        const returnValue = parsed.get('days') + 'd' + parsed.get('hours') + 'h' + parsed.get('minutes') + 'm'
        return returnValue;
      }
    }, 
    []
  )

  // TODO add days and other stuff? (parsed.get('days') ? parsed.get('days') + ':' : '') + 
  const displayVideoDurationFromSeconds = useMemo(
    () => {
      return (durationAsSeconds) => {
        const parsed = dayjs.duration(durationAsSeconds, 'seconds');
        const returnValue = parsed.get('hours') + ':' + parsed.get('minutes') + ':' + parsed.get('seconds');
        return returnValue;
      }
    }, 
    []
  )

  const displayVideoDurationFromSecondsWithLegend = useMemo(
    () => {
      return (durationAsSeconds) => {
        const parsed = dayjs.duration(durationAsSeconds, 'seconds');
        const returnValue = (parsed.get('days') > 0 ? (parsed.get('days') + 'd') : '') + (parsed.get('hours') > 0 ? (parsed.get('hours') + 'h') : '') + parsed.get('minutes') + 'm' + parsed.get('seconds') + 's';
        return returnValue;
      }
    }, 
    []
  )

  return { intToStringBigNumber, parseDateToFromNow, parseDate, parseDuration, humanizeDurationFromSeconds, displayDurationFromSeconds, displayVideoDurationFromSecondsWithLegend, displayVideoDurationFromSeconds };
};

export default useFormatter;
