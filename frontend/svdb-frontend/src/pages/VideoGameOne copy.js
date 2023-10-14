import {
  ReloadOutlined, YoutubeOutlined, EyeOutlined, LineChartOutlined,
  LikeOutlined,
  ArrowRightOutlined,
  PlayCircleOutlined,
  StarFilled,
  CheckSquareOutlined,
  ArrowLeftOutlined,

} from '@ant-design/icons';
import { HeartOutlined } from '@ant-design/icons';
import { Button, Card, Col, Rate, Input, List, Row, Space, Collapse, Typography, Divider, Avatar, Empty, Popover, Tag, Spin, Tooltip, Modal } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormatter from '../hooks/useFormatter';
import variables from '../sass/antd.module.scss';
import VideoRate from '../components/video/VideoRate';
import VideoGrowthLine from '../components/graphs/VideoGrowthLine';
import ReactPlayer from 'react-player';
import Locations from '../components/video/Locations';
import UpdateVideoModal from '../components/video/UpdateVideoModal';
import { getGameOneFn } from "../services/videoApi.ts";
import TinyLineViews from '../components/graphs/TinyLineViews';

const stringSimilarity = require('string-similarity');

const { Title, Text } = Typography;
const { Search } = Input;

const VideoGameOne = () => {
  const { id } = useParams();
  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [videos, setVideos] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [round, setRound] = useState();

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextVideo = () => {
    // Increment the currentIndex to move to the next video
    setCurrentIndex((prevIndex) => (prevIndex === videos.length - 1 ? 0 : prevIndex + 1));
  };

  const prevVideo = () => {
    // Decrement the currentIndex to move to the previous video
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? videos.length - 1 : prevIndex - 1));
  };

  function evaluateTitleSimilarity(originalTitle, guessTitle) {
    // Convert both titles to lowercase for a case-insensitive comparison
    const lowercaseOriginalTitle = originalTitle.toLowerCase();
    const lowercaseGuessTitle = guessTitle.toLowerCase();

    // Use the Jaro-Winkler similarity algorithm to compare the titles
    const similarity = stringSimilarity.compareTwoStrings(
      lowercaseOriginalTitle,
      lowercaseGuessTitle
    );

    // You can adjust the threshold value as needed to determine how close the titles need to be
    const threshold = 0.8; // Example threshold value (80% similarity)

    if (similarity >= threshold) {
      return 'Correct'; // Titles are similar enough, consider it correct
    } else {
      return 'Incorrect'; // Titles are not similar enough
    }
  }

  // evaluateTitleSimilarity(originalTitle, guessTitle)


  useEffect(() => {
    // init game

    asyncFetch();
  }, []);

  useEffect(() => {
    // setVideo(videos[currentIndex]);
    setRound(rounds[currentIndex]);
  }, [currentIndex]);

  const asyncFetch = async () => {
    await getGameOneFn().then((res) => {
      console.log(res)
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
            lives: 5,
            available_points: availablePoints,
            gained_points: gainedPoints,
            used_thumbnail_help: false,
            used_stats_help: false,
            show_title: false,
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
  // width: 100%; /* Adjust the width as needed */
  // white-space: nowrap;
  // text-overflow: ellipsis;
  insertCss(`

  .headerPanel {
    padding-top: 10px;
    color: `+ variables.sdmnYellow + `;
   
  }

  .headerPanel h3 {
    color: `+ variables.sdmnBlack + `;
  }

  .divider {
    margin: 0px 10px;
  }

.videoContainer {
    height: 400px;
    border-radius: 8px;
    object-fit: cover;
    overflow: hidden;
}

.panelContainer {
  height: 600px;
  overflow: auto;
}

.infoStatsComponent {
  float: right; 
  background-color: black;
  opacity: 0.9;
  border-radius: 8px;
  padding: 5px;
  margin-bottom: 8px;
  margin-top: 12px;
}

.infoStatsComponent span {
  color: white; 
  font-size: 13px;
}

.evenMoreInfoComponent{
  height: 352px;
  overflow: auto
}

.showPointer:hover {
    cursor: pointer;
}

.title:hover {
  cursor: pointer; /* Change the cursor to indicate interactivity */
}

.gray-bar {
  background-color: #ccc; /* Gray background color */
  padding: 10px; /* Adjust the padding as needed */
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.gray-bar span {
  font-weight: bold;
}

/* Style the "Play Scrabble?" button */
.play-button {
  background-color: #007bff; /* Blue background color */
  color: #fff; /* White text color */
  padding: 5px 10px; /* Adjust the padding as needed */
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

/* Change button appearance on hover */
.play-button:hover {
  background-color: #0056b3; /* Darker blue on hover */
}

/* Hide the obfuscated title when the gray bar is shown */
.gray-bar:hover + h2 {
  display: none;
}

.blur-image {
  filter: blur(25px); /* Adjust the blur radius as needed */
}

// .blur-image:hover {
//   filter: blur(0px);
// }


.bttm-container {
  position: absolute;
  bottom: 100px;
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
    z-index: 1000;
}

/* Define the custom styles for the Space component */
.custom-space {
  display: flex;
  justify-content: space-between;
  width: 100%;
}

/* Define the styles for the first element (75% width) */
.first-element {
  flex: 3; /* 75% width */
  
  padding: 10px; /* Adjust as needed */
}

/* Define the styles for the second and third elements (12.5% width each) */
.second-element,
.third-element {
  flex: 1; /* 12.5% width each */
  padding: 10px; /* Adjust as needed */
}

@media (max-width: 1480px) {
    .videoContainer {
        height: 400px;
    }

    .divider {
      margin: 0px 6px;
    }

}

@media (max-width: 900px) {
    .videoContainer {
        height: 300px;
    }
}

@media (max-width: 600px) {
    .videoContainer {
        height: 240px;
    }

    .panelContainer {
        height: 350px;
    }

    .divider {
      margin: 0px 4px;
    }

    .infoStatsComponent  {
      margin-top: 0px;
      margin-bottom: 0px;
    }
    .infoStatsComponent span {
      font-size: 10px;
    }

    .evenMoreInfoComponent{
      height: 250px;
    }
}

  `)

  


  const goToChannel = (id) => {
    // console.log('going to channel?');
    const url = '/channel/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  };

  const goToCreator = (id) => {
    console.log('heere: ', id);
    const url = '/creator/' + id;
    // not necessary, kind of redudant at the moment. Params are set through useParams and useLocation (state)
    navigate(url, { state: { id: id } });
  }

  const obfuscateTitle = (originalTitle) => {
    // Replace characters in the original title with asterisks or other obfuscation method.
    // You can customize this logic to suit your needs.
    return '_'.repeat(originalTitle.length);
  };


  const replaceThumbnailUrl = (url) => {
    return url?.replace('hqdefault', 'maxresdefault');
  }

  const backgroundImageStyle = {
    backgroundImage: `url(${replaceThumbnailUrl(round?.video?.url)})`,
    backgroundSize: 'cover', // Adjust as needed
    backgroundPosition: 'center center', // Adjust as needed
    backgroundRepeat: 'no-repeat', // Prevent image repetition
    width: '100%',
    height: '100%', // Adjust as needed,

  };

  {/* <YoutubeOutlined />  */ }

  const GuessBttn = () => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [modalText, setModalText] = useState('Content of the modal');
    const showModal = () => {
      setOpen(true);
    };
    const handleOk = () => {
      setModalText('The modal will be closed after two seconds');
      setConfirmLoading(true);
      setTimeout(() => {
        setOpen(false);
        setConfirmLoading(false);
      }, 2000);
    };
    const handleCancel = () => {
      console.log('Clicked cancel button');
      setOpen(false);
    };
    return (
      <>
        <Button onClick={showModal}>
          Guess
        </Button>
        <Modal
          title="Title"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <p>{modalText}</p>
        </Modal>
      </>
    );
  };

  const handleThumbnailHelpClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points-50,
      used_thumbnail_help: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
  };
  const handleStatsHelpClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points-50,
      used_stats_help: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
  };
  const handleSeeTitleClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points-50,
      show_title: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
  };
  const handleSeeChannelClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points-50,
      show_channel: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
  };




  return (<>
    {isFetched && round ? <>
      <div className={`${round?.used_thumbnail_help ? '' : 'blur-image'}`} style={backgroundImageStyle}></div>
      <div>
        <div className="bttm-container">
          <Row style={{ paddingRight: '25px', paddingLeft: '25px' }}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Card style={{ backgroundColor: "rgba(48, 48, 48, 0.8)" }} bodyStyle={{ padding: '10px 15px', height: '115px' }} >
                <Title level={5} className="headerPanel" >
                  {round?.used_stats_help ?
                    <VideoRate _video={round?.video}></VideoRate> :
                    <Tooltip title="Use help Unblur Video Stats to unlock" placement="bottomRight">
                      <StarFilled style={{ fontSize: '18px', color: '#FDDF01' }} /> <Text strong style={{ fontSize: '15px' }}>X</Text>
                      <Text style={{ fontSize: '13px' }}>/10</Text>
                    </Tooltip>}
                  <Divider type="vertical"></Divider>{round?.show_title ? round?.video?.title : obfuscateTitle(round?.video?.title)}
                </Title>
                <Space>
                  <Avatar className={`${round?.show_channel ? '' : 'blur-image'}`} src={round?.video?.channel?.logo_url} onClick={() => goToChannel(round?.video?.channel?.channel_id)} />
                  <Space.Compact direction="vertical" className={`${round?.show_channel ? '' : 'blur-image'}`}>
                    <Text>{round?.video?.channel?.title}</Text>
                    <Text type="secondary">{round?.video?.channel?.subs} subscribers</Text>

                  </Space.Compact>
                </Space>
              </Card>

            </Col>

          </Row>
        </div>

        <Card style={{ backgroundColor: "rgba(48, 48, 48, 0.8)", position: 'absolute', top: '85px', right: '25px' }} bodyStyle={{ padding: '10px 15px', width: '300px' }}
          actions={[
            <Tooltip title="Previous"><Button onClick={() => prevVideo()}><ArrowLeftOutlined /></Button></Tooltip>,
            <Tooltip title="Next"><Button onClick={() => nextVideo()}><ArrowRightOutlined /></Button></Tooltip>,
            <Tooltip title="Guess"><GuessBttn /></Tooltip>
          ]}>
          <table>
            <tbody>
              <tr>
                <th style={{ width: '40%' }}>Lives</th>
                <td style={{ textAlign: 'right' }}><Rate character={<HeartOutlined />} allowHalf /></td>
              </tr>
              <tr>
                <th style={{ width: '40%' }}>Round</th>
                <td style={{ textAlign: 'right' }}>{round?.round_number}</td>
              </tr>
              <tr>
                <th style={{ width: '40%' }}>Available Points</th>
                <td style={{ textAlign: 'right' }}>{round?.available_points}</td>
              </tr>
              <tr>
                <th style={{ width: '40%' }}>Points</th>
                <td style={{ textAlign: 'right' }}>{round?.gained_points}</td>
              </tr>
            </tbody>
          </table>
          <br></br>
          <Collapse
            size="small"
            items={[
              {
                key: '1',
                label: 'Helps',
                children: <>
                  <table>
                    <tbody>
                      <tr>
                        <th style={{ width: '40%' }}>Unblur Thumbnail</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.used_thumbnail_help} onClick={() => handleThumbnailHelpClick()}>50p</Button></td> 
                      </tr>
                      <tr>
                        <th style={{ width: '60%' }}>Unblur Video Stats</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.used_stats_help}  onClick={() => handleStatsHelpClick()}>50p</Button></td>
                      </tr>
                      <tr>
                        <th style={{ width: '60%' }}>Guess the Title</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.used_stats_help}  onClick={() => handleStatsHelpClick()}>50p</Button></td>
                      </tr>
                       {/* <tr>
                        <th style={{ width: '60%' }}>See Title</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.show_title} onClick={() => handleSeeTitleClick()}>50p</Button></td>
                      </tr>
                      <tr>
                        <th style={{ width: '60%' }}>Unblur Channel</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.show_channel} onClick={() => handleSeeChannelClick()}>50p</Button></td>
                      </tr>  */}
                    </tbody>
                  </table>
                </>,
              },
            ]}
          />

        </Card>

        <br></br>
      </div></>
      : <Spin />
    }
  </>);
};




export default VideoGameOne;
