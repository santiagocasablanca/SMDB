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
import { Button, Card, Col, Rate, Input, List, Row, Space, Collapse, Typography, Divider, Avatar, message, Popover, Select, Spin, Tooltip, Modal } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import useFormatter from '../../hooks/useFormatter';
import VideoRate from '../video/VideoRate';
import { getChannelsFn } from '../../services/channelApi.ts';

const stringSimilarity = require('string-similarity');

const { Title, Text } = Typography;
const { Search } = Input;
const { Option } = Select;

const VideoGameOneRound = ({ _round, totalPoints, remainingLives, handleNextVideo, handlePrevVideo, handleGuessCB }) => {

  const [isFetched, setIsFetched] = useState(false);
  const navigate = useNavigate();
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
  const [round, setRound] = useState();
  const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);
  const [offuscatedTitle, setOffuscatedTitle] = useState("");
  const vowels = ['a', 'e', 'i', 'o', 'u'];

  const replaceThumbnailUrl = (url) => {
    return url?.replace('hqdefault', 'maxresdefault');
  }


  const nextVideo = () => {
    handleNextVideo(round);
  };

  const prevVideo = () => {
    handlePrevVideo(round);
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

    // console.log(originalTitle, guessTitle, similarity);
    // You can adjust the threshold value as needed to determine how close the titles need to be
    const threshold = 0.8; // Example threshold value (80% similarity)

    if (similarity >= threshold) {
      return true; // Titles are similar enough, consider it correct
    } else {
      return false; // Titles are not similar enough
    }
  }

  // evaluateTitleSimilarity(originalTitle, guessTitle)
  const fetchChannels = () => {
    if (channels.length > 0) return;

    let params = new URLSearchParams();
    // if (_filters.channels)
    //   params.append("channels", _filters.channels);
    params.append("sort", "title%asc");

    getChannelsFn(1, 1000, params)
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          temp.push({
            label: item.title,
            value: item.channel_id,
          });
        })

        setOptions(temp);

        result.results ? setChannels(result.results) : setChannels([])
      })
  }


  useEffect(() => {
    fetchChannels();
    // console.log(_round);
    setRound(_round);
    // setOffuscatedTitle(obfuscateTitle(_round?.video.title));
    setIsFetched(true);
  }, [_round]);

  insertCss(`
  .bttm-container {
    position: absolute;
    bottom: 100px;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
      z-index: 1000;
  }

  .blur-image {
    filter: blur(25px); /* Adjust the blur radius as needed */
  }

  .backgroundImage {
    background-image: url(${replaceThumbnailUrl(round?.video?.url)});
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
  }

  .playing-card {
    background-color: rgba(48, 48, 48, 0.8);
    position: absolute;
    top: 85px; 
    right: 25px;
  }

  @media (max-width: 900px) {
    .backgroundImage {
      background-image: url(${replaceThumbnailUrl(round?.video?.url)});
      background-size: cover;
      background-position: center center;
      background-repeat: no-repeat;
      width: 382px;
    height: 190px;
    margin: 0 auto;
    margin-top: 15px;
    margin-bottom: 15px;
    border-radius: 16px;
    }

    .bttm-container {
      position: absolute;
      top: 285px;
      width: 100%;
      height: 150px;
      max-width: 100%;
      margin: 0 auto;
        z-index: 1000;
    }

    .playing-card {
      display: block;
      right: 0px;
      position: relative;
      top: 145px;
      margin: 0px 15px;
  }
    }
  }

  `)

  const goToChannel = (id) => {
    const url = '/channel/' + id;
    navigate(url, { state: { id: id } });
  };

  const goToCreator = (id) => {
    const url = '/creator/' + id;
    navigate(url, { state: { id: id } });
  }


  function obfuscateTitle(originalTitle) {
    // Check if originalTitle or round is falsy
    if (!originalTitle || !round) {
      return originalTitle;
    }

    // Create a regular expression pattern to match all non-chosen vowels (consonants and unchosen vowels)
    const pattern = new RegExp(`[^${Array.from(round.chosen_vowels).join(' ')} ]`, 'gi');

    // Split the originalTitle into words using spaces as delimiters
    const words = originalTitle.split(' ');

    // Replace non-chosen vowels with underscores for each word
    const obfuscatedWords = words.map((word) => {
      return word.replace(pattern, '_');
    });

    // Join the obfuscated words with spaces to maintain the word structure
    const obfuscatedTitle = obfuscatedWords.join(' ');

    return obfuscatedTitle;
  }


  const backgroundImageStyle = {
    backgroundImage: `url(${replaceThumbnailUrl(round?.video?.url)})`,
    backgroundSize: 'cover', // Adjust as needed
    backgroundPosition: 'center center', // Adjust as needed
    backgroundRepeat: 'no-repeat', // Prevent image repetition
    width: '100%',
    height: '100%', // Adjust as needed,
  };

  const handleGuess = (titleGuess, channelGuess) => {
    // console.log(titleGuess, round?.video.title, channelGuess)
    // const guessedTitle = evaluateTitleSimilarity(round?.video.title, titleGuess);
    // // console.log(guessedTitle, channelGuess, round?.video.channel, channelGuess == round?.video.channel.channel_id);
    // if (guessedTitle) {
    //   console.log('sort of guessed the title')
    //   // if !show_itle => show it
    //   const updatedRound = {
    //     ...round,
    //     gained_points: round.gained_points + round.available_points,
    //     show_title: true,
    //   };

    //   // Update the round state with the new round object
    //   setRound(updatedRound);
    //   message.success(`You guessed the Title. Congrats!`);
    // } else {
    //   // lives--;
    //   const updatedRound = {
    //     ...round,
    //     lives: round.lives- 1
    //   };

    //   setRound(updatedRound);
    //   message.error(`You failed the title, please try again.`);
    // }
    if (channelGuess == round?.video.channel.channel_id) {
      // console.log('guessed the channel')
      const updatedRound = {
        ...round,
        // available_points: round.available_points - 50,
        gained_points: round.gained_points + round.available_points,
        show_title: true,
        used_thumbnail_help: true,
        used_stats_help: true,
        show_channel: true,
        guessed: true,
        guesses: [...round.guesses, channelGuess]
      };

      // Update the round state with the new round object
      setRound(updatedRound);
      handleGuessCB(updatedRound);
      message.success(`You guessed the Channel. Congrats!`);
    } else {

      if (remainingLives - 1 == 0) {
        const updatedRound = {
          ...round,
          available_points: 0,
          show_title: true,
          used_thumbnail_help: true,
          used_stats_help: true,
          show_channel: true,
          guessed: false,
          guesses: [...round.guesses, channelGuess]
        };

        setRound(updatedRound);
        handleGuessCB(updatedRound);
        message.error(`Still NOPE!`);
        return;
      }

      // lives--;
      const updatedRound = {
        ...round,
        guessed: false,
        guesses: [...round.guesses, channelGuess]
      };

      setRound(updatedRound);
      handleGuessCB(updatedRound);
      message.error(`You failed the Channel, please try again.`);

    }
  }

  const GuessBttn = ({ handleGuess }) => {
    const [open, setOpen] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [titleGuess, setTitleGuess] = useState(''); // State for title guess
    const [channelGuess, setChannelGuess] = useState(''); // State for channel guess

    const showModal = () => {
      setOpen(true);
    };
    const handleOk = () => {
      setConfirmLoading(true);
      setTimeout(() => {
        handleGuess(titleGuess, channelGuess);
        setOpen(false);
        setConfirmLoading(false);
      }, 1000);
    };
    const handleCancel = () => {
      setOpen(false);
    };

    const handleChannelChange = (e) => {
      setChannelGuess(e);
      // onChange({ channels: e });
    };
    const onSearch = (value) => {
    };

    return (
      <>
        <Button disabled={round?.guessed} onClick={showModal}>
          Guess
        </Button>
        <Modal
          title="Make your guesses"
          open={open}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >

          {/* {
            round?.show_title ? '' :
              <div>
                <label>Guess Title: {obfuscateTitle(round?.video?.title)}</label>
                <Input
                  value={titleGuess}
                  onChange={(e) => setTitleGuess(e.target.value)}
                  style={{ width: '100%' }}
                  placeholder="Please guess the video title"
                />
              </div>
          }˙ */}
          <div style={{ marginTop: '16px' }}>
            <label>Guess Channel:</label>
            <Select style={{ width: '95%' }} placeholder="Please select a channel"
              // defaultValue={_filters.channels}
              allowClear
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleChannelChange}
              showSearch
              optionFilterProp="children"
              onSearch={onSearch}
              options={options}>
            </Select>
          </div>
        </Modal>
      </>
    );
  };



  const handleThumbnailHelpClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points - 150,
      used_thumbnail_help: true,
    };
    // Update the round state with the new round object
    setRound(updatedRound);
    message.success(`You choose the Unblur Thumbnail Help for 50 points!`);
  };

  const handleStatsHelpClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points - 200,
      used_stats_help: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
    message.success(`You choose the See Stats Help for 50 points!`);
  };

  const handleSeeTitleClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points - 150,
      show_title: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
    message.success(`You choose the See Title Help for 50 points!`);
  };

  const handleSeeChannelClick = () => {
    const updatedRound = {
      ...round,
      available_points: round.available_points - 50,
      show_channel: true,
    };

    // Update the round state with the new round object
    setRound(updatedRound);
    message.success(`You choose the See Channel Help for 50 points!`);
  };



  const handleBuyVowelClick = () => {
    // Check if all vowels have been chosen
    if (round.chosen_vowels.size === vowels.length) {
      // console.log('You have already chosen all vowels.');
      return;
    }

    // Randomly select a vowel that hasn't been chosen
    let randomVowel;
    do {
      randomVowel = vowels[Math.floor(Math.random() * vowels.length)];
    } while (round.chosen_vowels.has(randomVowel));

    // setOffuscatedTitle(obfuscateTitle(round?.video.title));
    // console.log(`You bought the vowel: ${randomVowel}`);

    // Add the chosen vowel to the Set of chosen vowels
    round.chosen_vowels.add(randomVowel);
    const updatedRound = {
      ...round,
      available_points: round.available_points - 10
    };

    // Update the round state with the new round object
    setRound(updatedRound);
    message.success(`You bought the vowel: ${randomVowel} for 10 points!`);
  }
  // style={{wordSpacing: '6px'}} style={backgroundImageStyle}
  return (<>

    {isFetched && round ? <>
      <div className={`backgroundImage ${round?.used_thumbnail_help ? '' : 'blur-image'}`} ></div>
      <div>
        <div className="bttm-container">
          <Row style={{ paddingRight: '14px', paddingLeft: '14px' }}>
            <Col xs={24} sm={24} md={24} lg={12} xl={12}>
              <Card style={{ backgroundColor: "rgba(48, 48, 48, 0.8)" }} bodyStyle={{ padding: '10px 15px', height: '135px' }} >
                <Title style={{ letterSpacing: '2px' }} level={5}>
                  {round?.used_stats_help ?
                    <VideoRate _video={round?.video}></VideoRate> :
                    <Tooltip title="Use help Unblur Video Stats to unlock" placement="bottomRight">
                      <StarFilled style={{ fontSize: '18px', color: '#FDDF01' }} /> <Text strong style={{ fontSize: '15px' }}>X</Text>
                      <Text style={{ fontSize: '13px' }}>/10</Text>
                    </Tooltip>}
                  <Divider type="vertical"></Divider>{round?.show_title ? round?.video?.title : obfuscateTitle(round?.video?.title)}
                </Title>
                <Space>
                  <Avatar className={`${round?.show_channel ? '' : 'blur-image'}`} src={round?.video?.channel?.logo_url} />
                  {/* onClick={() => goToChannel(round?.video?.channel?.channel_id)} */}
                  <Space.Compact direction="vertical" className={`${round?.show_channel ? '' : 'blur-image'}`}>
                    <Text>{round?.video?.channel?.title}</Text>
                    <Text type="secondary">{round?.video?.channel?.subs} subscribers</Text>

                  </Space.Compact>
                </Space>
              </Card>

            </Col>

          </Row>
        </div>

        <Card className="playing-card" bodyStyle={{ padding: '10px 15px', width: '382px' }}
          actions={[
            <Tooltip title="Previous"><Button disabled={round?.round_number === 1} onClick={() => prevVideo()}><ArrowLeftOutlined /></Button></Tooltip>,
            <Tooltip title="Next"><Button disabled={!round?.guessed} onClick={() => nextVideo()}><ArrowRightOutlined /></Button></Tooltip>,
            <Tooltip title="Guess"><GuessBttn handleGuess={(titleGuess, channelGuess) => handleGuess(titleGuess, channelGuess)} /></Tooltip>
          ]}>
          <table key="gameinfo">
            <tbody>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Lives</th>
                <td style={{ textAlign: 'right' }}><Rate disabled character={<HeartOutlined />} count={3} value={remainingLives} /></td>
              </tr>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Round</th>
                <td style={{ textAlign: 'right' }}>{round?.round_number}</td>
              </tr>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Round Guesses</th>
                <td style={{ textAlign: 'right' }}>{round?.guesses.map(el => { return <Text key={el} strong>{channels.find(channel => channel.channel_id === el)?.title} </Text> })}</td>
              </tr>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Available Points</th>
                <td style={{ textAlign: 'right' }}>{round?.available_points}</td>
              </tr>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Round Gained Points</th>
                <td style={{ textAlign: 'right' }}>{round?.gained_points}</td>
              </tr>
              <tr>
                <th style={{ width: '60%', textAlign: 'left' }}>Total Points</th>
                <td style={{ textAlign: 'right' }}>{totalPoints}</td>
              </tr>
            </tbody>
          </table>
          {/* <br></br> */}
          <Collapse
            style={{ marginTop: '4px' }}
            size="small"
            items={[
              {
                key: '1',
                label: 'Helps',
                children: <>
                  <table key="helps">
                    <tbody>
                      <tr>
                        <th style={{ width: '40%' }}>Unblur Thumbnail</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.used_thumbnail_help} onClick={() => handleThumbnailHelpClick()}>-150p</Button></td>
                      </tr>
                      <tr>
                        <th style={{ width: '60%' }}>Unblur Video Stats</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.used_stats_help} onClick={() => handleStatsHelpClick()}>-200p</Button></td>
                      </tr>
                      <tr>
                        <th style={{ width: '60%' }}>See the Title</th>
                        <td style={{ textAlign: 'right' }}><Button disabled={round?.show_title} onClick={() => handleSeeTitleClick()}>-150p</Button></td>
                      </tr>
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




export default VideoGameOneRound;
