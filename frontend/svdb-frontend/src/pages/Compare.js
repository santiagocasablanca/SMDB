import React, { useState } from 'react';
import { Row, Col, Card, Tabs } from 'antd';
import FrequencyCard from "./FrequencyCard";
import UploadTimeFrequencyCard from "./UploadTimeFrequencyCard";
import ChannelTotalStats from "./ChannelTotalsStats";
import VideoFilterPanel from './VideographyFilterPanel'

const Compare = () => {

  const [myFilters, setMyFilters] = useState({
    title: '',
    channels: ['Sidemen','MoreSidemen'],
    publishedAtRange: [],
    locations: '',
    series: '',
    search: Boolean,
    category: '',
    date: null,
  });


  const handleFilterChange = (newFilters) => {
    if(newFilters.search) {
      console.log(' handleFilterChange? ' + JSON.stringify(newFilters))
    }

    myFilters.search = false;
    setMyFilters({ ...myFilters, ...newFilters });
  };

  const tabListNoTitle = [
    {
      key: 'kpi',
      tab: 'KPI',
    },
    {
      key: 'timeFreq',
      tab: 'Upload Time Frequency',
    },
    {
      key: 'freq',
      tab: 'Upload Frequency',
    }
  ];
  const contentListNoTitle = {
    kpi:  <ChannelTotalStats />,
    freq: <FrequencyCard />,
    timeFreq: <UploadTimeFrequencyCard />
  };
  const [activeTabKey2, setActiveTabKey2] = useState('views');
  const onTab2Change = (key) => {
    setActiveTabKey2(key);
  };

  // <Card
  //           style={{ marginBottom: 16 }}
  //           extra={<Tabs defaultActiveKey="kpi"> {/* Change defaultActiveKey to the appropriate tab */}
  //             <Tabs.TabPane tab="KPIs" key="kpi">
  //               <ChannelTotalStats />
  //             </Tabs.TabPane>
  //             {/* <Tabs.TabPane tab="Charts" key="charts">

  //             </Tabs.TabPane> */}
  //             <Tabs.TabPane tab="Upload Time" key="time-frequency">
  //               <UploadTimeFrequencyCard />
  //             </Tabs.TabPane>
  //             <Tabs.TabPane tab="Upload Frequency" key="frequency">
  //               <FrequencyCard />
  //             </Tabs.TabPane>
  //           </Tabs>}
  //         >
  //           {/* Filter controls and comparison components go here */}
  //         </Card>

  return (
    <div>
      <h1>Compare Tab</h1>
      <Row gutter={16}>
        <Col span={6}>
          {/* <Card title="Filters" style={{ marginBottom: 16 }}> */}
            <VideoFilterPanel filters={myFilters} onChange={handleFilterChange} />
          {/* </Card> */}
        </Col>
        <Col span={18}>
          <Card tabList={tabListNoTitle}
            activeTabKey={activeTabKey2}
            onTabChange={onTab2Change}>
               {contentListNoTitle[activeTabKey2]}
            </Card>
        </Col>
      </Row>
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Selected Channels" style={{ marginBottom: 16 }}>
            {/* Display selected channels component goes here */}
          </Card>
        </Col>
        <Col span={12}>
          <Card title="Additional Information" style={{ marginBottom: 16 }}>
            {/* Additional information component goes here */}
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Compare;
