import { Button, Popconfirm, Space, Card, Form, Input, DatePicker, Select, Collapse, Row, Col } from 'antd';
import { React, useEffect, useState } from "react"
import { getChannelsFn } from "../services/channelApi.ts"
import { fetchAllSeries, fetchAllTags } from "../services/videoApi.ts"
import ChannelSelector from './ChannelSelector'
import variables from '../sass/antd.module.scss'


import dayjs from "dayjs"

const VideographyFilterPopoverPanel = ({ filters, onChange }) => {
  const [searchClicked, setSearchClicked] = useState(false);
  // const publishedAtRange = useState([]);
  const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchSeries();
    fetchChannels();
    // fetchTags();
  }, []);

  const fetchChannels = () => {
    let params = new URLSearchParams();

    getChannelsFn(1, 50, params)
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

  const fetchSeries = () => {
    fetchAllSeries()
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          temp.push({
            label: item.serie,
            value: item.serie,
          });
        })

        setSeries(temp);
      })
  }

  const fetchTags = () => {
    fetchAllTags()
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          // console.log(item)
          temp.push({
            label: item.tags,
            value: item.tags,
          });
        })
        setTags(temp);
      })
  }

  const handleSearchClick = () => {
    console.log('search clicked videographyFilter');
    console.log(series);
    setSearchClicked(true);
    onChange({
      channels: filters.channels,
      title: filters.title,
      publishedAtRange: filters.publishedAtRange,

      locations: filters.locations,
      series: filters.series,
      tags: filters.tags,
      cast: filters.cast,
      search: true
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onChange({ [name]: value });
  };

  const handleChannelChange = (e) => {
    onChange({ channels: e });
  };

  const handleLocationsChange = (e) => {
    onChange({ locations: e });
  };
  const handleSeriesChange = (e) => {
    onChange({ series: e });
  };

  const handleTagsChange = (e) => {
    onChange({ tags: e });
  };

  const handleDateRangeChange = (range) => {
    console.log(range);
    const rangeStr = [];
    range.forEach((date) => {
      // console.log(date.format());
      // if(date)
      rangeStr.push(date.format())
    })

    onChange({ publishedAtRange: rangeStr });
  };

  const { RangePicker } = DatePicker;

  const handleFilter = (event) => {
    event.preventDefault();
    // Implement your filter logic here
  };

  const [form] = Form.useForm();
  const { Panel } = Collapse;
  const [isExpanded, setIsExpanded] = useState(false);
  const handleReset = () => {
    form.resetFields();
    // Reset table filters and trigger update
    console.log('Filters reset');
  };

  const toggleFilters = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };

  return (
    // <Panel header="Filters" key="filters">
    <Form form={form} layout="vertical" onFinish={handleSearchClick} style={{ width: '150px' }}>
      <Row>
        <Col span={24}>
          {/* Title */}
          <Form.Item name="title" label="Title">
            <Input placeholder="Title"
              style={{ width: '95%' }}
              name="title"
              value={filters.title}
              onChange={handleInputChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {/* Published At< */}
          <Form.Item label="Published At">
            <RangePicker
              // value={publishedAtRange}
              style={{ width: '95%' }}
              format="YYYY-MM-DD"
              onChange={handleDateRangeChange} />
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {/* Channels  */}
          <Form.Item
            name="select-multiple"
            label="Channels">

            <Select mode="multiple" style={{ width: '95%' }} placeholder="Please select a channel"
              value={filters.channels}
              allowClear
              filterOption={(input, option) =>
                (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleChannelChange}
              options={options}>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {/* Series */}
          <Form.Item
            name="select-series"
            label="Series">
            <Select mode="multiple" style={{ width: '95%' }} placeholder="Series"
              allowClear
              value={filters.series}
              onChange={handleSeriesChange}
              options={series}>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          {/* Locations */}
          <Form.Item
            name="select-locations"
            label="Locations">
            <Select mode="multiple" style={{ width: '95%' }} placeholder="Locations" value={filters.locations}
              onChange={handleLocationsChange}>
              <option value="london">London</option>
              <option value="lasvegas">Las Vegas</option>
              <option value="la">LA</option>
              <option value="ams">Amesterdam</option>
            </Select>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Space align="end" style={{ float: 'right', paddingTop: '30px' }}>
            {/* <Popconfirm title="Are you sure clear this form?" okText="Yes" cancelText="No"> */}
            <Button onClick={handleReset}>Clear</Button>
            {/* </Popconfirm> */}
            <Button onClick={handleSearchClick} type="primary">Search</Button>
          </Space>
        </Col>
      </Row>

      {/* Tags  */}
      {/* <Form.Item
            name="select-tags"
            label="Tags">
            <Select mode="multiple" placeholder="Tags" value={filters.tags}
              style={{ width: '300px' }}
              onChange={handleTagsChange}
              options={tags}>
            </Select>
          </Form.Item> */}
    </Form>
    // </Panel>

  )
}

export default VideographyFilterPopoverPanel
