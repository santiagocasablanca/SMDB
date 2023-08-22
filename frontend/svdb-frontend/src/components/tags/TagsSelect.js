import React, { useState } from 'react';
import { Select } from 'antd';
import { TagsEnum } from '../../services/enums.ts'; // Make sure to import your TagsEnum from the correct path

const { Option } = Select;

const TagsSelect = () => {
  const [selectedTags, setSelectedTags] = useState([]);

  const handleTagChange = (value) => {
    setSelectedTags(value);
  };

  return (
    <Select
      mode="multiple"
      style={{ width: '95%' }}
      placeholder="Tags"
      allowClear
      value={selectedTags}
      onChange={handleTagChange}
    >
      {Object.values(TagsEnum).map((tag) => (
        <Option key={tag} value={tag}>
          {tag}
        </Option>
      ))}
    </Select>
  );
};

export default TagsSelect;
