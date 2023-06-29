import React, { useState, useEffect } from 'react';
import { Card, List, Row, Col, Image } from 'antd';
import insertCss from 'insert-css';
import ReactPlayer from 'react-player'
import {
  useParams, useLocation
} from "react-router-dom";

import { getCreatorFn, getCreatorsFn } from "../services/creatorApi.ts";
import { getVideosFn } from "../services/videoApi.ts";


import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import variables from '../sass/antd.module.scss'
import PokemonCard from '../components/PokemonCard';



const CreatorPage = () => {

  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const [fetchedData, setFetchedData] = useState([]);
  const [top10videos, setTop10videos] = useState([]);
  const [creator, setCreator] = useState([]);
  // const {state} = useLocation();


  useEffect(() => {
    console.log(id);
    asyncFetch();
  }, []);

  const asyncFetch = async () => {
    await getCreatorFn(id).then((res) => {
      if (res.result) {
        console.log(res.result);
        setCreator(res.result);
        fetchChannels(res.result.channels);
        setIsFetched(true);
      }
    });
  }

  const fetchChannels = async (channels) => {
    if(channels === undefined) return;
    const creatorChannels = await channels?.map((channel) => {
      return channel.channel_id;
    });
    let paramsTop10 = new URLSearchParams();
    paramsTop10.append("sort", "views%desc")
    paramsTop10.append("channels", creatorChannels);
    console.log('videos paramsTop10', creatorChannels);

    await getVideosFn(1, 10, paramsTop10)
      .then((result) => {
        console.log('videos creator', result);
        setTop10videos(result.videos);
      })
  }

  // background-color: #ddd;
  // border: 2px solid #ffffff;

  insertCss(`
  .banner {
    background-color: #222;
    color: #fff;
    padding: 20px;
    font-size: 24px;
  }

  .profile {
    width: 200px;
    height: 200px;
    margin: 20px auto;
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    border-radius: 120px;
    margin: 0 auto;
    margin-top: -120px;
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

  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  `)

  return (
    <>
      {!isFetched ? (
        // <LoadingAnimation />
        <p>Loading...</p>
      ) : (
          <div>
            <div className="banner">
              <Image src={creator.banner_picture ? creator.banner_picture : null} />
            </div>
            <div className="profile">
              <Image className="radius" src={creator.profile_picture} />
            </div>
            <div className="name">{creator.name}</div>

            {/* <Row gutter={16}>
        <Col span={12}>
          <Card className="stats-card">
            <div className="stats-header">Total Stats</div>
            <div className="stats-list">Stats List</div>
          </Card>
        </Col>
        <Col span={12}> */}
            {/* <Card className="heatmap-card"> */}
            {/* <UploadTimeFrequencyCard /> */}
            {/* </Card> */}
            {/* </Col>
      </Row> */}

            <Row gutter={16}>
              <Col span={24}>
                <List
                  grid={{
                    gutter: 4,
                    column: 10,
                  }}
                  className="scrollmenu"
                  itemLayout="horizontal"
                  style={{
                    background: variables.sdmnPink,
                    padding: 10,
                    marginTop: 20,
                    marginBottom: 20
                  }}
                  // loading={isTop10VideosLoaded}
                  dataSource={top10videos}
                  renderItem={(item) => (
                    <List.Item>
                      <Card title={item.title}
                        style={{ width: 300 }}
                        bodyStyle={{ padding: 0 }}>
                        <ReactPlayer url={item.player.embedHtml} width='100%'></ReactPlayer>
                        <span>{item.likes}</span>
                      </Card>
                    </List.Item>
                  )}
                />
              </Col>
            </Row>

            {/* <div className="yearly-heatmap"> */}
            {/* <FrequencyCard /> */}
            {/* </div> */}
          </div>
        )}
    </>
  );
};




// headStyle={{
//   textOverflow: 'ellipsis',
//   overflow: 'hidden',
//   whiteSpace: 'nowrap'
// }}
export default CreatorPage;
