import { Button, Popconfirm, Space, Card, Form, Input, DatePicker, Select, Collapse, Row, Col } from 'antd';
import { React, useEffect, useState } from "react"
import { getChannelsFn } from "../../services/channelApi.ts"
import { fetchAllSeries, fetchAllTags } from "../../services/videoApi.ts"
import dayjs from "dayjs"

const VideographyFilterPanel = ({ filters, onChange }) => {
  const [searchClicked, setSearchClicked] = useState(false);
  // const publishedAtRange = useState([]);
  const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const [tags, setTags] = useState([]);

  useEffect(() => {
    fetchSeries();
    fetchChannels();
    fetchTags();
  }, []);

  const fetchChannels = () => {
    let params = new URLSearchParams();
    if (filters.channels)
      params.append("channels", filters.channels)

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
            label: item,
            value: item,
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
    console.log(e);
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

    <Collapse activeKey={isExpanded ? ['filters'] : []}
      onChange={toggleFilters}
      expandIconPosition="end"
      className="filterPanel"
      size="large"
      // collapsible="header"
      bordered={false}>
      <Panel header="Filters" key="filters">
        <Form form={form} layout="vertical" onFinish={handleSearchClick}>


          <Row align="top">
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              {/* Title */}
              <Form.Item name="title" label="Title">
                <Input placeholder="Title"
                  style={{ width: '95%' }}
                  name="title"
                  value={filters.title}
                  onChange={handleInputChange} />
              </Form.Item>
            </Col>
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
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
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
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
            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              {/* Published At< */}
              <Form.Item label="Published At">
                <RangePicker
                  // value={publishedAtRange}
                  style={{ width: '95%' }}
                  format="YYYY-MM-DD"
                  onChange={handleDateRangeChange} />
              </Form.Item>
            </Col>


            <Col xs={24} sm={24} md={12} lg={12} xl={8}>
              {/* Series */}
              <Form.Item
                name="select-tags"
                label="Tags">
                <Select mode="multiple" style={{ width: '95%' }} placeholder="Tags"
                  allowClear
                  value={filters.tags}
                  onChange={handleTagsChange}
                  options={tags}>
                </Select>
              </Form.Item>
            </Col>
            
              {/* Locations */}
            {/* <Col xs={8} sm={8} md={8} lg={8} xl={8}>
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
            </Col> */}
            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
              <Space align="end" style={{ float: 'right' }}>
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
      </Panel>
    </Collapse>
  )
}

export default VideographyFilterPanel
