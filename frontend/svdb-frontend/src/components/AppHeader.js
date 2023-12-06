import { MenuFoldOutlined, MenuUnfoldOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Button, Layout, Space, theme, notification, Popover, Typography, Spin } from 'antd';
import insertCss from 'insert-css';
import React, { useMemo, useState, useEffect } from 'react';
import variables from '../sass/antd.module.scss';
import useFormatter from '../hooks/useFormatter';

import { AppLogo } from './index';
import { fetchInfo, callLatestRefresh } from '../services/channelApi.ts';



const { Header } = Layout;
const { Title, Text } = Typography;

// import { logo } from '../assets/images/sidemenpluslogo.png'

const AppHeader = ({ collapsed, childToParent }) => {
  const { parseDateToFromNow } = useFormatter();

  insertCss(`
.infoPopup {
  color: white;
  width: 300px;
}
.info:hover{
  cursor: pointer;
}

  .mainHeader {
    padding: 0 100px auto;
  }

  @media (max-width: 600px) {
    .mainHeader {
      padding: 0 20px;
    }
  }
  `);

  const headerStyle = {
    // padding: "0 100px",
    // margin: '0 100px auto',
    background: variables.coolerGray10,
    borderBottom: "1px solid " + variables.richBlack,
    color: variables.richBlack
  }; // sdmnDarkBlue

  const handleClick = () => {
    childToParent(!collapsed);
  };

  const callRefresh = () => {
callLatestRefresh();
notification.success({
  message: 'Fetch and refresh latest videos',
  description: 'The job FETCH LATEST was called',
});
  };

  const InfoPopover = () => {
    const [lastUpdated, setLastUpdated] = useState();
    const [creators, setCreators] = useState(0);
    const [channels, setChannels] = useState(0);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
      async function fetch() {
        const stats = await fetchInfo();
        setCreators(stats?.results.creators);
        // console.log(stats?.results.creators);
        setChannels(stats?.results.channels);
        setLastUpdated(stats?.results.last_updated_at);
        setIsLoaded(true);
        // console.log(stats);
      }
      fetch();
    }, []);

    return (
      <div className="infoPopup">
        {isLoaded ? (
          <>
            <Text>This website contains data last fetched </Text> {parseDateToFromNow(lastUpdated)}
            <Text> from </Text> {creators} <Text> Creators </Text>
            <Text> and </Text> {channels} <Text> Channels</Text>
          </>
        ) : (
            <Spin></Spin>
          )}

      </div>
    );
  };



  // style={headerStyle}
  return (
    <Header className="mainHeader" style={headerStyle}>
      <Space>
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={handleClick}
          style={{
            fontSize: '20px',
            color: variables.richBlack,
            width: 60,
            height: 60,
          }}
        />
        <AppLogo></AppLogo>
      </Space>
      <Space style={{ float: 'right' }}><Popover placement="bottom" content={<InfoPopover />}> <span className="info" onDoubleClick={() => callRefresh()}
      ><InfoCircleOutlined/> Info</span></Popover></Space>

    </Header>
  )
}

export default AppHeader
