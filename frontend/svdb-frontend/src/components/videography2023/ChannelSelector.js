
import { Select, Space, Button } from 'antd';
import { React, useEffect, useState } from "react";

const { Option } = Select;

const ChannelSelector = ({ channels, onChange }) => {
  const [options, setOptions] = useState([]);
  const [selectedChannels, setSelectedChannels] = useState([]);

  useEffect(() => {
    const temp = channels.map((item) => ({ label: <span><img src={item.logo_url} style={{ height: '25px', width: '25px', borderRadius: '50%', marginRight: '5px' }} />{item.title}</span>, value: item.channel_id, logo: item.logo_url }));
    // channels.forEach((item) => {
    //   temp.push({
    //     label: item.title,
    //     value: item.channel_id,
    //     logo: item.logo_url
    //   });
    // })
    const selected = channels.map((ch) => ch.channel_id);
    setSelectedChannels(selected);
    handleChannelChange(selected)
    setOptions(temp);

  }, [channels]);

  const handleSelectAll = () => {
    const allChannelIds = channels.map((ch) => ch.channel_id);
    setSelectedChannels(allChannelIds);
    onChange(allChannelIds);
  };

  const handleDeselectAll = () => {
    setSelectedChannels([]);
    onChange([]);
  };


  const handleChannelChange = (e) => {
    setSelectedChannels(e);
    onChange(e);
  };


  return (
    <Space style={{ width: '100%' }}>
      <Select
        mode="multiple"
        maxTagCount={5}
        style={{ minWidth: '150px', width: '100%' }}
        placeholder="Please select a channel"
        value={selectedChannels}
        onChange={handleChannelChange}
        options={options}
        optionLabelProp="label"
      />
      <Space>
        <Button onClick={handleSelectAll}>Select All</Button>
        <Button onClick={handleDeselectAll}>Deselect All</Button>
      </Space>
    </Space>
  )
}

export default ChannelSelector
