import { EyeOutlined, LikeOutlined, MessageOutlined } from '@ant-design/icons';
import { Card, Col, Row, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';
import { fetchVideosChannelStatsFn } from "../services/videoApi.ts";


const ChannelTotalsStats = () => {

  const [fetchedData, setFetchedData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totals, setTotals] = useState({
    total_videos: 0,
    views: 0,
    likes: 0,
    comments: 0
  });



  useEffect(() => {
    asyncFetch();
  }, [totals]);

  const asyncFetch = () => {
    let params = new URLSearchParams();
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    fetchVideosChannelStatsFn(params).then((result) => {
      if (result.results) {
        result.results.forEach(el => {
          totals.total_videos += parseInt(el.total_videos);
          totals.views += parseInt(el.views);
          totals.likes += parseInt(el.likes);
          totals.comments += parseInt(el.comments);
        });
      }

      setFetchedData(result.results);
      // setTotals(totals);
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

  //  channel
  // total_videos
  // views
  // likes
  // comments justify="center"
  return (
    <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row"  >
          <Card bordered={false} style={{ minWidth: 275 + 'px' }}>
            <Statistic
              title="Total Videos"
              value={totals.total_videos}
              valueStyle={{
                color: '#3f8600',
              }}
            // prefix={<LikeOutlined />}
            // style={{minWidth:250+'px'}}
            // suffix="%"
            />
          </Card>

        </Col>
        <Col className="gutter-row" >

          <Card bordered={false} style={{ minWidth: 275 + 'px' }}>
            <Statistic
              title="Total Views"
              value={intToStringBigNumber(totals.views)}
              precision={2}
              prefix={<EyeOutlined />}
            // suffix="%"
            />
          </Card>

        </Col>
        <Col className="gutter-row" >

          <Card bordered={false} style={{ minWidth: 275 + 'px' }}>
            <Statistic
              title="Total Likes"
              value={intToStringBigNumber(totals.likes)}
              precision={2}
              prefix={<LikeOutlined />}
            // suffix="%"
            />
          </Card>

        </Col>
        <Col className="gutter-row" >
          <Card bordered={false} style={{ minWidth: 275 + 'px' }}>
            <Statistic
              title="Total Comments"
              value={intToStringBigNumber(totals.comments)}
              precision={2}
              prefix={<MessageOutlined />}
            // suffix="%"
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ChannelTotalsStats;
