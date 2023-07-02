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
    if (channels === undefined) return;
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
    width: 100%;
    display: grid;
    color: #fff;
    font-size: 24px;
  }

  .profile {
    width: 128px;
    height: 128px;
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

  .creatorContainer {
    margin: 10px auto;
    
  }

  .scrollmenu {
    overflow: auto;
    white-space: nowrap;
  }

  .scrollmenu div {
    display: inline-block;
   
  }

  `)

  const bannerUrl = creator.banner_picture + '=w2560-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj';
  return (
    <>
      {!isFetched ? (
        // <LoadingAnimation />
        <p>Loading...</p>
      ) : (
          <div>
            <div className="banner">
              <Image src={bannerUrl}
                style={{ height: '300px', objectFit: 'cover' }}
                preview={false} />
            </div>
            <div className="profile">
              <Image className="radius" src={creator.profile_picture} />
            </div>
            <div className="name">{creator.name}</div>

            <div className="creatorContainer">

              <Row gutter={16}>
                <Col span={24}>
                  <List
                    grid={{
                      gutter: 8,
                      column: 8,
                    }}
                    title="this could work as channel filters for the 'body' of the page"
                    className="scrollmenu"
                    itemLayout="horizontal"
                    style={{
                      background: variables.sdmnPink,
                      padding: 10,
                      marginTop: 20,
                      marginBottom: 20
                    }}
                    // loading={isTop10VideosLoaded}
                    dataSource={creator.channels}
                    renderItem={(item) => (
                      <List.Item>
                        {/* title={item.title} */}
                        <Card
                          bodyStyle={{ padding: 0 }}
                          cover={
                            // <div style={{height: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                            <Image alt={item.name}
                              // style={{height: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                              src={item.logo_url}
                              preview={false}
                              fallback="data:image/png;base64,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"
                            />
                            // </div>
                          }>
                          {/* <span>{item.likes}</span> */}
                        </Card>
                      </List.Item>
                    )}
                  />
                </Col>
              </Row>

              {/* <Row gutter={16}>
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
                  dataSource={top10videos}
                  renderItem={(item) => (
                    <List.Item>
                      <Card title={item.title}
                        style={{ width: '600px' }}
                        bodyStyle={{ padding: 0, width: '600px' }}>
                        <ReactPlayer url={item.player.embedHtml} width='100%'></ReactPlayer>
                      </Card>
                    </List.Item>
                  )}
                />
              </Col>
            </Row> */}

              {/* <div className="yearly-heatmap"> */}
              {/* <FrequencyCard /> */}
              {/* </div> */}
            </div>
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
