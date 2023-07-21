import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Row, Col, Image, Table, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Tooltip, Input, notification } from 'antd';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, NumberOutlined, FilterOutlined } from '@ant-design/icons';
import insertCss from 'insert-css';
import { getCreatorsFn, associateChannelIdsToCreatorFn } from "../services/creatorApi.ts";
import { getVideosFn } from "../services/videoApi.ts";

import variables from '../sass/antd.module.scss'
import useFormatter from '../hooks/useFormatter';





const { Title } = Typography;

const HomePage = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(true);

  const [fetchedData, setFetchedData] = useState([]);
  const [selectedItemIndex, setSelectedItemIndex] = useState(-1);
  const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();


  useEffect(() => {
    asyncFetch();
  }, []);

  const asyncFetch = () => {
    
  }

  const HeaderPanel = ({ title, filters, onChange }) => {
    // style={{ color: 'black' }}
    return (
      <Row className="headerPanel">
        <Col span="22">
          <Title level={3}>{title}</Title>
        </Col>
        <Col span="2">
          <div style={{ float: 'right' }}>
            <Space.Compact block>
              {isAdmin ? (<Tooltip title="Add Creator">
                <p>admin</p>
              </Tooltip>) : ('')}
              <Tooltip title="Filter">
                <Button icon={<FilterOutlined />} />
              </Tooltip>
            </Space.Compact>

          </div>
        </Col>
      </Row>
    );
  };

  return (<>
    <HeaderPanel title="Home"></HeaderPanel>
    <p>Hello, World!</p>
  </>);
};


export default HomePage;
