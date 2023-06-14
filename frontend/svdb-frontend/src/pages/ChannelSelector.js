
import { React, useEffect, useState } from "react"
import { getChannelsFn } from "../services/channelApi.ts"
import { getCreatorsFn } from "../services/creatorApi.ts";
import { fetchAllSeries, fetchAllTags } from "../services/videoApi.ts"
import { Card, Space, Col, Row, Select } from 'antd';


import dayjs from "dayjs"

const ChannelSelector = ({ channels, onChange }) => {
  const [creators, setCreators] = useState([]);
  // const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchChannels();
  }, []);


  const fetchChannels = () => {
    let params = new URLSearchParams();

    getCreatorsFn(params)
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          if (item.channels && item.channels.length > 0) {

            temp.push({
              label: item.name,
              options: item.channels.map((channel) => (
                {
                  label: channel.title,
                  value: channel.channel_id
                }
              )
              ),
            });
          }
        })

        setOptions(temp);

        result.results ? setCreators(result.results) : setCreators([])
      })
  }

  const handleChannelChange = (e) => {
    onChange({ channels: e });
  };


  return (
    <Select mode="multiple" style={{ width: '100%' }} placeholder="Please select a channel"
      value={channels}
      allowClear
      onChange={handleChannelChange}
      options={options}
    // defaultValue={['Sidemen', 'MoreSidemen']}
    >
    </Select>
  )
}

export default ChannelSelector
