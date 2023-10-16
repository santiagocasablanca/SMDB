import { Input, Typography, Spin, Button, Avatar, Modal, Table, Row, Col, Card } from 'antd';
import { CloseOutlined, ReloadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import {
  getGameOneFn, fetchGameOneLeaderboard,
  gameOneAddToLeaderboard
} from "../../services/videoApi.ts";
import VideoGameOneRound from './VideoGameOneRound';
import insertCss from 'insert-css';
import { gsap } from 'gsap';

const stringSimilarity = require('string-similarity');

const { Title, Text } = Typography;
const { Search } = Input;

const VideoGameOne = () => {
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [videos, setVideos] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState();
  const [remainingLives, setRemainingLives] = useState(3);
  const [totalOfPoints, setTotalOfPoints] = useState(0);
  const [gameover, setGameover] = useState(false);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardTotalResults, setLeaderboardTotalResults] = useState(0);
  const [canAdd, setCanAdd] = useState(true);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const [refreshKeyLB, setRefreshKeyLB] = useState(0);

  const nextVideo = (updatedRound) => {
    // Increment the currentIndex to move to the next video
    // console.log(updatedRound);
    rounds[currentIndex] = updatedRound;
    setCurrentIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  };

  const prevVideo = (updatedRound) => {
    console.log(updatedRound);
    rounds[currentIndex] = updatedRound;
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));

  };

  const handleGuess = (updatedRound) => {
    // console.log(updatedRound);
    rounds[currentIndex] = updatedRound;
    const newRemainingLives = remainingLives;
    if (updatedRound.guessed) {
      //  console.log('do nothing');
    } else {
      // console.log('removing life', );
      setRemainingLives((prev) => prev - 1);
      if (newRemainingLives - 1 === 0) {
        console.log('gameover', newRemainingLives);
        setGameover(true);
        // fetchGameOneLeaderboard().then((res) => { setLeaderboard(res.results) });
      }
    }
    // console.log('remainingLives', newRemainingLives);
    setRefreshKey((prevIndex) => (prevIndex + 1));
  };

  const handleAddToLeaderboard = (playerName) => {
    gameOneAddToLeaderboard({
      player_name: playerName,
      total_points: totalOfPoints,
      total_rounds: currentIndex,
      rounds: rounds.slice(0, currentIndex + 1)
    }).then((res) => {
      setCanAdd(false);
      setRefreshKeyLB((prevIndex) => (prevIndex + 1));
    })

  };


  insertCss(`
  #thumbnail-mural {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .thumbnail {
    width: 250px;
    height: 140px;
    margin: 10px;
    cursor: pointer;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.3);
    transition: box-shadow 0.3s ease-in-out;
  }
  
  .thumbnail:hover {
    box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.5);
  }
  
  .thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }


  .failed_round {
    filter: grayscale(90%);
    border: 1px solid red;
  }
  .failed_round:hover {
    filter: grayscale(0%);
  }

  .gained_round {
    border: 1px solid green;
  }
  
  `)

  useEffect(() => {
    // init game
    asyncFetch();
  }, []);

  useEffect(() => {
    fetchGameOneLeaderboard().then((res) => { setLeaderboard(res.results); setLeaderboardTotalResults(res.count); });
  }, [refreshKeyLB]);

  useEffect(() => {
    setRound(rounds[currentIndex]);
    setTotalOfPoints(rounds.reduce((total, round) => {
      return total + round.gained_points;
    }, 0));

  }, [currentIndex, refreshKey]);

  const asyncFetch = async () => {
    await getGameOneFn().then((res) => {
      let temp_rounds = [];
      let roundNumber = 1; // Initialize the round number

      // Set the initial available and gained points for the first round
      let availablePoints = 500; // You can adjust this initial value as needed
      let gainedPoints = 0;

      if (res.videos) {
        res.videos.forEach(el => {

          const round = {
            video: el,
            round_number: roundNumber,
            guesses: [],
            guessed: false,
            available_points: availablePoints,
            gained_points: gainedPoints,
            used_thumbnail_help: false,
            used_stats_help: false,
            show_title: false,
            chosen_vowels: new Set,
            show_channel: false
          }
          // Add the round to the rounds array
          temp_rounds.push(round);

          // Increment the round number for the next iteration
          roundNumber++;
        });

        setRounds(temp_rounds);
        setRound(temp_rounds[currentIndex]);
        setVideos(res.videos);
        // setVideo(res.videos[currentIndex]);
        // setChannel(res.videos[currentIndex].channel)
        setIsFetched(true);
      }
    });
  }

  const AddToLeaderboard = ({ handle }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [playerName, setPlayerName] = useState('');

    const showModal = () => {
      setOpen(true);
    };
    const handleOk = () => {
      setConfirmLoading(true);
      setTimeout(() => {
        handle(playerName);
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
    };
    const handleCancel = () => {
      setOpen(false);
    };


    // style={{ width: '100%' }}
    return (
      <> 
        <div >
          <label>Player Name</label>
          <Input
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            style={{ width: '50%', margin: '10px' }}
            />
          <Button onClick={handleOk}>
            Add to Leaderboard
         </Button>
        </div>
      </>
      // <>
      //   <Button onClick={showModal}>
      //     Add to Leaderboard
      //   </Button>
      //   <Modal
      //     title="Adding Record to Leaderboard"
      //     open={open}
      //     onOk={handleOk}
      //     confirmLoading={confirmLoading}
      //     onCancel={handleCancel}
      //   >
      //     <div>
      //       <label>Player Name</label>
      //       <Input
      //         value={playerName}
      //         onChange={(e) => setPlayerName(e.target.value)}
      //         style={{ width: '100%' }}
      //       />
      //     </div>

      //   </Modal>
      // </>
    );
  };

  const DisplayGameOver = () => {
    const handleRefresh = () => {
      window.location.reload(); // This line will refresh the page
    };
    const columns = [
      {
        title: 'Name',
        dataIndex: 'player_name',
        key: 'player_name',
        render: (text) => <p>{text}</p>,
      },
      {
        title: 'Rounds',
        dataIndex: 'total_rounds',
        width: '10%',
        key: 'total_rounds',
        sorter: {
          compare: (a, b) => a.total_rounds - b.total_rounds,
          multiple: 1,
        },
      },
      {
        title: 'Points',
        dataIndex: 'total_points',
        width: '15%',
        key: 'total_points',
        sorter: {
          compare: (a, b) => a.total_points - b.total_points,
          multiple: 2,
        },
      }
    ];

    return (<><Title level={1} style={{ textAlign: 'center', color: 'black', marginTop: '25px' }}>Gameover!</Title>
      <div style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '15px', textAlign: 'center', color: 'black', marginBottom: '15px' }}>
        <Row gutter={[16, 16]}>
          <Col sm={24} md={24} lg={12}>
            <Title level={4}>Results</Title>
            <Row gutter={[16, 16]}>
              <Col span={24}>
                <Card>
                  <Text strong>Rounds Won: {currentIndex}</Text>
                  <br></br>
                  <Text strong>Total of Points: {totalOfPoints}</Text>
                  <br></br>
                  <br></br>
                  {canAdd && totalOfPoints > 0 ?
                    <><AddToLeaderboard handle={(playerName) => handleAddToLeaderboard(playerName)} />
                      <br></br></>
                    : <></>
                  }
                </Card>
              </Col>
              <Col span={24}>
                <Button style={{ fontSize: '20px', width: '100%', marginTop: '10px', height: '70px', backgroundColor: '#78FECF', color: 'black' }}
                  onClick={() => handleRefresh()}><ReloadOutlined /> Play Again</Button>
              </Col>
            </Row>

          </Col>
          <Col sm={24} md={24} lg={12}>
            <Title level={4}>Leaderboard</Title>
            <Table
              columns={columns} 
              // dataSource={leaderboard} 
              dataSource={leaderboard.map((item) => ({
                ...item,
                key: item.id,
              }))}
              size="small" pagination={{
              // simple: true,
              total: leaderboardTotalResults,
              // showQuickJumper: true,
              showSizeChanger: false,
              defaultPageSize: 5,
              // pageSizeOptions: ["5", "30", "50"]
            }} />
          </Col>
        </Row>
      </div>

      <div id="thumbnail-mural">
        {
          rounds
            .slice(0, currentIndex + 1)
            // .filter((el, index) => el.guessed || (index === 0 && (el.guessed === false)))
            .map((el, index) => {
              return <div className="thumbnail" key={index}>
                {/*  ROUND  */}
                <img src={el.video.url} className={el.gained_points === 0 ? 'failed_round' : 'gained_round'}></img>
                {/* <Text style={{ position: 'relative', bottom: '35px', left: '5px', color: 'yellow', fontSize: '20px', zIndex: '100' }}># {el.round_number}</Text> */}

                {/* POINTS */}
                <div style={{ position: 'relative', bottom: '31px', zIndex: '100', backgroundColor: 'rgba(0, 0, 0, 0.5)', padding: '3px' }}>
                  <Text style={{ color: 'yellow', fontSize: '16px' }}># {el.round_number}</Text>
                  <Text style={{ color: el.gained_points === 0 ? 'red' : 'green', float: 'right', fontSize: '14px' }}>{el.gained_points} pts</Text>
                  <Avatar className={el.gained_points === 0 ? 'failed_round' : 'gained_round'} style={{ marginLeft: '5px' }} src={el.video.channel.logo_url} />
                </div>
                {/* <Avatar src={el.video.channel.logo_url}></Avatar>  */}
                {/* <span style={{ position: 'relative', color: 'green', top: '50%', left: '50%', zIndex: '100' }}>{el.gained_points > 0 ? el.gained_points : <CloseOutlined />}</span> */}
              </div>
            })
        }
      </div>
    </>);
  };


  return (<>
    {isFetched && round ? <>
      {gameover ? <DisplayGameOver /> :
        <VideoGameOneRound key={currentIndex} _round={round} remainingLives={remainingLives} totalPoints={totalOfPoints} handleNextVideo={(updatedRound) => nextVideo(updatedRound)}
          handlePrevVideo={(updatedRound) => prevVideo(updatedRound)} handleGuessCB={(updatedRound) => handleGuess(updatedRound)} />
      }
    </>
      : <Spin />
    }
  </>);
};


export default VideoGameOne;
