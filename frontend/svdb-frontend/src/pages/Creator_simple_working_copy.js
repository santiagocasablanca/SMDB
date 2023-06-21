import React,{ useState, useEffect }  from 'react';
import { Card, Row, Col, Image } from 'antd';
import insertCss from 'insert-css';


import { getCreatorsFn } from "../services/creatorApi.ts";

import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";

const CreatorPage = () => {

  const [fetchedData, setFetchedData] = useState([]);


  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    console.log('heere')
    let params = new URLSearchParams();
    // params.append("channels", selectedChannels);
    // params.append("publishedAtRange", [startDate.format("YYYY-MM-DD"), endDate.format("YYYY-MM-DD")]);
    getCreatorsFn(params).then((result) => {
      console.log(result)
      if (result.results) {
        console.log(result.results)
        setFetchedData(result.results);
      }
    })
  }


  insertCss(`
  .banner {
    background-color: #222;
    color: #fff;
    padding: 20px;
    font-size: 24px;
  }

  .profile {
    width: 150px;
    height: 150px;
    // background-color: #ddd;
    margin: 20px auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    // border: 2px solid #ffffff;
    border-radius: 120px;
    margin: 0 auto;
    margin-top: -60px;
  }

  .radius {
    border-radius: 50%;
  }

  .name {
    text-align: center;
    font-size: 30px;
    font-weight: bold;
    margin-bottom: 20px;
  }

  .stats-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .stats-header {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  .stats-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .stats-list-item {
    display: flex;
    align-items: center;
  }

  .stats-list-item-icon {
    margin-right: 10px;
  }

  .stats-list-item-label {
    font-weight: bold;
  }

  .stats-list-item-value {
    margin-left: auto;
  }

  .heatmap-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
  }

  .carousel {
    padding: 20px;
  }

  .carousel-card {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-bottom: 20px;
  }

  .carousel-card-title {
    font-size: 18px;
    font-weight: bold;
  }

  .carousel-card-created-at {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .carousel-card-total-videos {
    margin-top: 10px;
    font-size: 14px;
    color: #666;
  }

  .carousel-card-subs,
  .carousel-card-likes {
    margin-top: 10px;
    font-size: 16px;
    font-weight: bold;
    color: #333;
  }

  .yearly-heatmap {
    padding: 20px;
    background-color: #f5f5f5;
    border-radius: 8px;
    margin-top: 20px;
    height: 200px;
  }

  `)

  return (
    <div>
      <div className="banner">
        <Image src={fetchedData.length ? fetchedData[2].banner_picture : null}  />
      </div>
      <div className="profile">
       {fetchedData.length ?
        <Image className="radius" src={fetchedData.length ? fetchedData[2].profile_picture : null}  />
        : ''}
      </div>
      <div className="name">{fetchedData.length ? fetchedData[2].name : null}</div>

      <Row gutter={16}>
        <Col span={12}>
          <Card className="stats-card">
            <div className="stats-header">Total Stats</div>
            <div className="stats-list">Stats List</div>
          </Card>
        </Col>
        <Col span={12}>
          {/* <Card className="heatmap-card"> */}
            <UploadTimeFrequencyCard />
          {/* </Card> */}
        </Col>
      </Row>

      <div className="carousel">Channel Carousel</div>

      {/* <div className="yearly-heatmap"> */}
        <FrequencyCard />
      {/* </div> */}
    </div>
  );
};

export default CreatorPage;
