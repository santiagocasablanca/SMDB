import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { Treemap,Heatmap, G2 } from '@ant-design/plots';
import { Card,Divider, Carousel,
  Row, Space,
  Col, List, Statistic } from 'antd';
import { getVideosFn, getTreeMapPlotForTagsFn, fetchVideoFrequencyFn } from "../services/videoApi.ts"
import dayjs from "dayjs"
import { LikeOutlined,StarOutlined,MessageOutlined, EyeOutlined, NumberOutlined } from '@ant-design/icons';
import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import insertCss from 'insert-css';


var weekOfYear = require('dayjs/plugin/weekOfYear')
dayjs.extend(weekOfYear)

const Dashboard = () => {

  const [data, setData] = useState([]);
  const [likedSeriesData, setLikedSeriesData] = useState([]);
  const [refreshKey, setRefreshKey] = useState(0);
  const [videos, setVideos] = useState([]);
  const [moreSidemenTop10, setMoreSidemenTop10] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
     asyncFetch();
  }, [refreshKey]);

  const handleRefresh = () => {
    // Increment the refreshKey value to force component remount
    setRefreshKey((prevKey) => prevKey + 1);
  };
  const IconText = ({ icon, text }) => (
    <Space size="small" className="card-Stats-elements" >
      {React.createElement(icon)}
      {text}
    </Space>
  );

  const asyncFetch = () => {

    getTreeMapPlotForTagsFn()
      .then((result) => {

        // Transform the fetched data into the required format
      const transformedData = result.results.map((item) => {
        return {
          name: item.serie, // Assuming the title property holds the name
          value: item.views, // Assuming the likes property holds the value
          // Additional properties can be added here if needed
          likes: item.likes,
          views: item.views,
          comments:item.comments,
          totalVideos: item.noVideos
        };
      });

      const transformedLikedData = result.results.map((item) => {
        return {
          name: item.serie, // Assuming the title property holds the name
          value: item.likes, // Assuming the likes property holds the value
          // Additional properties can be added here if needed
          likes: item.likes,
          views: item.views,
          comments:item.comments,
          totalVideos: item.noVideos
        };
      });
        setData(transformedData);
        setLikedSeriesData(transformedLikedData);
        setIsLoading(false);

        console.log("finished fetching");
      });




      let params = new URLSearchParams();
      params.append("sort", "views%desc")
      params.append("channels", ['UCDogdKl7t7NHzQ95aEwkdMw']); //Sidemen
      getVideosFn(1,10, params)
      .then((result) => {
        setVideos(result.videos)
      })

      let paramsMoreSidemenTop10 = new URLSearchParams();
      paramsMoreSidemenTop10.append("sort", "views%desc")
      paramsMoreSidemenTop10.append("channels", ['UCh5mLn90vUaB1PbRRx_AiaA']); // MoreSidemen
      getVideosFn(1,10, paramsMoreSidemenTop10)
      .then((result) => {
        setMoreSidemenTop10(result.videos)
      })
  };

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




const contentStyle = {
  height: '160px',
  color: '#fff',
  lineHeight: '160px',
  textAlign: 'center',
  background: '#364d79',
};


  insertCss(`
  .card-Stats-elements {
font-size: 12px;
gap: 4px !important;
  }
  .ant-list-vertical .ant-list-item .ant-list-item-action >li {
    padding: 0 8px;
}
.ant-list-vertical .ant-list-item .ant-list-item-action {
  margin-block-start: -15px;
  margin-inline-start: auto;
}
.ant-list .ant-list-pagination {
  margin-block-start: 33px;
}
  .container-xxl {
width: 100% !important;
  }
  .container{
    padding: 16px 0px;
    width: 160px;
    display: flex;
    flex-direction: column;
  }
  .title{
    font-weight: bold;
  }
  .tooltip-item{
    margin-top: 12px;
    display: flex;
    width: 100%;
    justify-content: space-between;
  }

`);

  const typeOfStats = 'views'
  const mostViewedSeries = {
    name: 'Most Viewed Series',
    children: data
  };
  const config = {
    data: mostViewedSeries,
    colorField: 'name',

    tooltip: {
      follow: true,
      enterable: true,
      offset: 5,
      customContent: (value, items) => {
        if (!items || items.length <= 0) return;
        const { data: itemData } = items[0];
        return (
          `<div class='container'>` +
          `<div class='title'>${itemData.name}</div>` +
          // `<div class='tooltip-item'><span>${itemData.published_at}</span></div>` +
          `<div class='tooltip-item'><span>Views: </span><span>${intToStringBigNumber(itemData.views)}</span></div>` +
          `<div class='tooltip-item'><span>Likes: </span><span>${intToStringBigNumber(itemData.likes)}</span></div>` +
          `<div class='tooltip-item'><span>Comments: </span><span>${intToStringBigNumber(itemData.comments)}</span></div>` +
          `<div class='tooltip-item'><span>Number of videos: </span><span>${itemData.totalVideos}</span></div>`


        );
      },
    },
  };
  const mostLikedSeries = {
    name: 'Most Liked Series',
    children: likedSeriesData
  };
  const configLikedSeries = {
    data: mostLikedSeries,
    colorField: 'name',
    tooltip: {
      follow: true,
      enterable: true,
      offset: 5,
      customContent: (value, items) => {
        if (!items || items.length <= 0) return;
        const { data: itemData } = items[0];
        return (
          `<div class='container'>` +
          `<div class='title'>${itemData.name}</div>` +
          // `<div class='tooltip-item'><span>${itemData.published_at}</span></div>` +
          `<div class='tooltip-item'><span>Views: </span><span>${intToStringBigNumber(itemData.views)}</span></div>` +
          `<div class='tooltip-item'><span>Likes: </span><span>${intToStringBigNumber(itemData.likes)}</span></div>` +
          `<div class='tooltip-item'><span>Comments: </span><span>${intToStringBigNumber(itemData.comments)}</span></div>` +
          `<div class='tooltip-item'><span>Number of videos: </span><span>${itemData.totalVideos}</span></div>`


        );
      },
    },
  };
  const style = {
    padding: '4px 0',
  };
  const tabListNoTitle = [
    {
      key: 'views',
      tab: 'Views',
    },
    {
      key: 'likes',
      tab: 'Likes',
    }
  ];
  const contentListNoTitle = {
    views: <Treemap key={refreshKey} {...config} />,
    likes: <Treemap key={refreshKey} {...configLikedSeries} />
  };
  const [activeTabKey2, setActiveTabKey2] = useState('views');
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };
  return (
    <>
    {isLoading ? (
      <p>Loading...</p>
    ) : (

      <>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style= {{marginBottom: 25+'px'}}>
        <Col className="gutter-row" span={6}>

              <ChannelTotalStats/>

        </Col>
        <Col className="gutter-row" span={16}>
            {/* <div style={style}> */}
              <UploadTimeFrequencyCard/>
            {/* </div> */}
        </Col>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style= {{marginBottom: 25+'px'}}>

        <ChannelTotalStats/>
      </Row>


      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style= {{marginBottom: 25+'px'}}>
        <UploadTimeFrequencyCard> </UploadTimeFrequencyCard>
      </Row>

      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style= {{marginBottom: 25+'px'}}>
        <FrequencyCard></FrequencyCard>
      </Row>

      <Divider orientation="left">Sidemen Video Stats</Divider>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={12}>
            <div style={style}>
        <Card title="Sidemen Top 10 Most Viewed Videos" bordered={false} size="small">
            <List
              size="small"
              itemLayout="vertical"
              pagination= {{pageSize: 5, defaultPageSize: 5, size:"small" }}
              dataSource={videos}
              renderItem={(item, index) => (
                <List.Item
                  key={item.title}
                  actions={[
                    // <IconText icon={NumberOutlined} text={item.totalVideos} key="list-vertical-star-o" />,
                    <IconText icon={EyeOutlined} text={intToStringBigNumber(item.views)} key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text={intToStringBigNumber(item.likes)} key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text={intToStringBigNumber(item.comments)} key="list-vertical-message" />,
                  ]}
                  extra={
                    <img
                      width={152}
                      alt="logo"
                      src={item.url}
                    />
                  }
                  >
                  <List.Item.Meta
                    title={item.title}
                    description={dayjs(item.published_at).format("DD MMM YYYY HH:MM")}
                  />

                </List.Item>
              )}
              />
            </Card>
            </div>
          </Col>
          <Col className="gutter-row" span={12}>
            <div style={style}>
        <Card title="MoreSidemen Top 10 Most Viewed Videos" bordered={false} size="small">
            <List
              size="small"
              itemLayout="vertical"
              pagination= {{pageSize: 5, defaultPageSize: 5, size:"small" }}
              dataSource={moreSidemenTop10}
              renderItem={(item, index) => (
                <List.Item
                  key={item.title}
                  actions={[
                    // <IconText icon={NumberOutlined} text={item.totalVideos} key="list-vertical-star-o" />,
                    <IconText icon={EyeOutlined} text={intToStringBigNumber(item.views)} key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text={intToStringBigNumber(item.likes)} key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text={intToStringBigNumber(item.comments)} key="list-vertical-message" />,
                  ]}
                  extra={
                    <img
                      width={152}
                      alt="logo"
                      src={item.url}
                    />
                  }
                  >
                  <List.Item.Meta
                    title={item.title}
                    description={dayjs(item.published_at).format("DD MMM YYYY HH:MM")}
                  />

                </List.Item>
              )}
              />
            </Card>
            </div>
          </Col>
        </Row>


      <Divider orientation="left">Sidemen Sundays Stats by Series</Divider>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={7}>
            <div style={style}>
            <Card title="Most Videos by Series" bordered={false} size="small">
            <List
              size="small"
              itemLayout="vertical"
              pagination= {{pageSize: 5, defaultPageSize: 5, size:"small" }}
              dataSource={data.sort((a,b) => b.totalVideos - a.totalVideos)}
              renderItem={(item, index) => (
                <List.Item
                  key={item.name}
                  actions={[
                    <IconText icon={NumberOutlined} text={item.totalVideos} key="list-vertical-star-o" />,
                    <IconText icon={EyeOutlined} text={intToStringBigNumber(item.views)} key="list-vertical-star-o" />,
                    <IconText icon={LikeOutlined} text={intToStringBigNumber(item.likes)} key="list-vertical-like-o" />,
                    <IconText icon={MessageOutlined} text={intToStringBigNumber(item.comments)} key="list-vertical-message" />,
                  ]}>
                  <List.Item.Meta
                    title={item.name}
                  />

                </List.Item>
              )}
              />
            </Card>

            </div>
          </Col>
          <Col className="gutter-row" span={17}>
            <div style={style}>
            <Card title="Most Viewed Sidemen Sunday Series (all time)" bordered={false} size="small"
            tabList={tabListNoTitle}
            activeTabKey={activeTabKey2}
            onTabChange={onTab2Change}
            >
              {contentListNoTitle[activeTabKey2]}
            </Card>
            </div>
          </Col>
        </Row>



        {/* <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={9}>
            <div style={style}>
            <Card title="Card title" bordered={false}>
              Card content
            </Card>
            </div>
          </Col>
          <Col className="gutter-row" span={15}>
          <Card title="Most Liked Sidemen Sunday Series (all time)" bordered={false} >
            <Treemap key={refreshKey} {...configLikedSeries} />
          </Card>
          </Col>
        </Row> */}
      </>
    )}
    </>
  )
}

export default Dashboard
