import { useMemo } from 'react';
import dayjs from 'dayjs';

const useFormatter = () => {
  const intToStringBigNumber = useMemo(
    () => {
      const formatNumber = num => {
          console.log(num);
        if (num === undefined) return 0;
        const numericString = num.toString().replace(/[^0-9.]/g, '');
        const parsedNum = parseFloat(numericString);
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

  return { intToStringBigNumber, parseDate, parseDuration };
};

export default useFormatter;
