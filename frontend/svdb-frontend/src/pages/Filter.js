import React, { useState } from 'react';
import { Button, Collapse, DatePicker, Form, Input, Select } from 'antd';

const { Panel } = Collapse;
const { RangePicker } = DatePicker;
const { Option } = Select;

const Filters = () => {
  const [form] = Form.useForm();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterSubmit = () => {
    form.validateFields().then((values) => {
      // Apply filters and trigger table update
      console.log('Applied filters:', values);
    });
  };

  const handleReset = () => {
    form.resetFields();
    // Reset table filters and trigger update
    console.log('Filters reset');
  };

  const toggleFilters = () => {
    setIsExpanded((prevExpanded) => !prevExpanded);
  };
  const onChange = (key) => {
    console.log(key);
  };

  return (
    <div >
      {/* <Button type="primary" onClick={toggleFilters}>
        {isExpanded ? 'Collapse Filters' : 'Expand Filters'}
      </Button> */}
      <Collapse activeKey={isExpanded ? ['filters'] : []}
        onChange={toggleFilters}
        expandIconPosition="end"
        size="large"
        // collapsible="header"
        bordered={false}>
        <Panel header="Filters" key="filters">
          <Form form={form} layout="inline" onFinish={handleFilterSubmit}>
            <Form.Item name="title" label="Title">
              <Input placeholder="Enter title" />
            </Form.Item>
            <Form.Item name="channels" label="Channels">
              <Select mode="multiple" placeholder="Select channels">
                {/* Options go here */}
              </Select>
            </Form.Item>
            <Form.Item name="publishedAt" label="Published At">
              <RangePicker style={{ width: '100%' }} />
            </Form.Item>
            {/* Add more form items for other filters */}
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Apply
              </Button>
              <Button onClick={handleReset}>Reset</Button>
            </Form.Item>
          </Form>
        </Panel>
      </Collapse>
    </div>
  );
};

export default Filters;
