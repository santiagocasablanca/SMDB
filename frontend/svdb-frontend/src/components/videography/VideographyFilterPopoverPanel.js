import { Button, Col, Collapse, Drawer, DatePicker, Form, Input, Row, Select, Space } from 'antd';
import { React, useEffect, useState } from "react";
import dayjs from 'dayjs';

import insertCss from 'insert-css';
import { useLocation } from 'react-router-dom';
import { getChannelsFn } from '../../services/channelApi.ts';
import { getCreatorsFn } from "../../services/creatorApi.ts";

import { TagsEnum, SeriesEnum, GamesEnum } from '../../services/enums.ts';

const VideographyFilterPopoverPanel = ({ _filters, _open, childToParent }) => {
  const [searchClicked, setSearchClicked] = useState(false);
  const location = useLocation();
  const [open, setOpen] = useState(_open);
  const [filters, setFilters] = useState();
  const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);
  const [creators, setCreators] = useState([]);
  const [creatorOptions, setCreatorOptions] = useState([]);
  const [series, setSeries] = useState([]);
  const [tags, setTags] = useState([]);
  const [games, setGames] = useState([]);

  useEffect(() => {
    if (_open) {
      // console.log(_filters);
      fetchCreators();
      fetchSeries();
      fetchChannels();
      fetchTags();
      fetchGames();
    }

    setOpen(_open);
  }, [_open]);



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

  const fetchCreators = () => {
    if (creators.length > 0) return;
    let params = new URLSearchParams();
    params.append("sort", "name%asc");

    getCreatorsFn(1, 10000, params)
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          temp.push({
            label: item.name,
            value: item.id,
          });
        })

        setCreatorOptions(temp);

        result.results ? setCreators(result.results) : setCreators([])
      })
  }

  const fetchSeries = () => {
    if (series.length > 0) return;
    const temp = []
    Object.keys(SeriesEnum).map(key => {
      temp.push({
        label: SeriesEnum[key],
        value: SeriesEnum[key],
      });
    });
    setSeries(temp);
  }

  const fetchTags = () => {
    if (tags.length > 0) return;
    const temp = []
    Object.keys(TagsEnum).map(key => {
      temp.push({
        label: TagsEnum[key],
        value: TagsEnum[key],
      });
    });
    setTags(temp);
  }


  const fetchGames = () => {
    if (games.length > 0) return;
    const temp = []
    Object.keys(GamesEnum).map(key => {
      temp.push({
        label: GamesEnum[key],
        value: GamesEnum[key],
      });
    });
    setGames(temp);
  }

  const onCancel = () => {
    // console.log('onCancel: ', form, _filters);
    form.resetFields();
    childToParent(false, null);
    setOpen(false);
  }

  const onClose = () => {
    // console.log('onClose: ', form, _filters);
    childToParent(true, _filters);
    setOpen(false);
  };

  const [form] = Form.useForm();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // onChange({ [name]: value });
  };

  const handleChannelChange = (e) => {
    _filters.channels = e;
    // onChange({ channels: e });
  };

  const handleCreatorChange = (e) => {
    _filters.creators = e;
    // onChange({ channels: e });
  };
  const handleDirectedByChange = (e) => {
    _filters.directedBy = e;
    // onChange({ channels: e });
  };
  const handleCastChange = (e) => {
    _filters.cast = e;
    // onChange({ channels: e });
  };
  

  // const handleLocationsChange = (e) => {
  //   onChange({ locations: e });
  // };
  const handleSeriesChange = (e) => {
    _filters.series = e;
    // onChange({ series: e });
  };

  const handleGamesChange = (e) => {
    _filters.games = e;
    // onChange({ games: e });
  };

  const handleTagsChange = (e) => {
    _filters.tags = e;
    // onChange({ tags: e });
  };

  const handleDateRangeChange = (range) => {
    const rangeStr = [];
    range?.forEach((date) => {
      // console.log(date.format());
      if (date)
        rangeStr.push(date.format())
    })

    _filters.publishedAtRange = rangeStr;

    // onChange({ publishedAtRange: rangeStr });
  };

  const { RangePicker } = DatePicker;



  const handleReset = () => {
    form.resetFields();

    setSearchClicked(true);
    // onChange({
    //   channels: [],
    //   title: '',
    //   publishedAtRange: [],

    //   locations: null,
    //   series: null,
    //   tags: null,
    //   games: null,
    //   cast: null,
    //   search: true
    // });
  };

  insertCss(`
  .filter-container {
    padding: 15px;
  }
  .ant-drawer .ant-drawer-content-wrapper {
    width: 380px;
  }

  @media (max-width: 768px) {
    .filter-container {
      padding: 10px;
       
    }
    .ant-drawer .ant-drawer-content-wrapper {
      width: 280px !important;
    }
    .header-container {
      padding: 16px 6px;
    }
  }

  `)

  return (
    <> {
      open ? (
        <Drawer
          title="Filters"
          placement="right"
          bodyClassName="filter-container"
          headerClassName="header-container"
          style={{ body: { padding: '0px' } }}
          height="95%"

          onClose={onCancel}
          open={open}
          extra={
            <Space>
              <Button onClick={onCancel}>Cancel</Button>
              <Button type="primary" onClick={onClose}>Search</Button>
            </Space>
          }>
          <div className="filter-container">
            <Form form={form} layout="vertical"
              initialValues={{
                ["select-multiple"]: _filters.channels,
                ["select-multiple-creators"]: _filters.creators,
                ["select-multiple-directedBy"]: _filters.directedBy,
                ["select-multiple-cast"]: _filters.cast,
                ["select-series"]: _filters.series,
                ["publishedAt"]: _filters.publishedAtRange?.length > 0 ? [dayjs(_filters.publishedAtRange[0]), dayjs(_filters.publishedAtRange[1])] : [],
                ["select-tags"]: _filters.tags,
                ["select-game"]: _filters.games,
              }}>


              {/* Title */}
              {/* <Row align="top">
                <Col xs={24} sm={24} md={12} lg={12} xl={8}>
                  <Form.Item name="title" label="Title">
                    <Input placeholder="Title"
                      style={{ width: '100%' }}
                      name="title"
                      // value={params?.title}
                      onChange={handleInputChange} />
                  </Form.Item>
                </Col>
              </Row> */}

              {/* Creators  */}
              <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-multiple-creators"
                    label="Published by (Creator)">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Please select a creator"
                      // defaultValue={_filters.channels}
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={handleCreatorChange}
                      options={creatorOptions}>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

               {/* Creators  */}
               <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-multiple-directedBy"
                    label="Directed by (Creator)">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Please select a creator"
                      value={_filters.directedBy}
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={handleDirectedByChange}
                      options={creatorOptions}>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

               {/* Cast  */}
               <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-multiple-cast"
                    label="Cast">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Please select a creator"
                      value={_filters.cast}
                      allowClear
                      filterOption={(input, option) =>
                        (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                      }
                      onChange={handleCastChange}
                      options={creatorOptions}>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>

              {/* Channels  */}
              <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-multiple"
                    label="Channels">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Please select a channel"
                      // defaultValue={_filters.channels}
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
              <Row align="top">
                <Col span={24}>
                  {/* Series */}
                  <Form.Item
                    name="select-series"
                    label="Series">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Series"
                      allowClear
                      value={_filters.series}
                      onChange={handleSeriesChange}
                      options={series}>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row align="top">
                <Col span={24}>
                  {/* Published At< */}
                  <Form.Item
                    name="publishedAt"
                    label="Published At">
                    <RangePicker
                      value={_filters.publishedAtRange}
                      
                      style={{ width: '95%' }}
                      format="YYYY-MM-DD"
                      onChange={handleDateRangeChange} />
                  </Form.Item>
                </Col>


              </Row>
              <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-tags"
                    label="Tags">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Tags"
                      allowClear
                      value={_filters.tags}
                      onChange={handleTagsChange}
                      options={tags}>
                    </Select>
                  </Form.Item>
                </Col>

              </Row>
              <Row align="top">
                <Col span={24}>
                  <Form.Item
                    name="select-game"
                    label="Game">
                    <Select mode="multiple" style={{ width: '95%' }} placeholder="Game"
                      allowClear
                      value={_filters.games}
                      onChange={handleGamesChange}
                      options={games}>
                    </Select>
                  </Form.Item>
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
          </div>
        </Drawer>
      ) : ('')
    }
    </>
  )
}

export default VideographyFilterPopoverPanel
