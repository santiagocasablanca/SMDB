import React, { useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Space, Input, Tag, Tooltip, theme } from 'antd';

const SeriesOrGameAdd = ({ _tag, onChange }) => {
  const editInputRef = useRef(null);

  useEffect(() => {
    editInputRef.current?.focus();
  }, [_tag]);

  const handleEditInputChange = (e) => {
    console.log('handling input change', e.target.value);
    onChange(e.target.value);
  };
  
  const tagInputStyle = {
    width: 100,
    height: 25,
    marginInlineEnd: 8,
    verticalAlign: 'top',
  };

  return (
    <Space size={[0, 8]} wrap>

      <Input
        ref={editInputRef}
        key={_tag + '-edit'}
        size="small"
        style={tagInputStyle}
        defaultValue={_tag}
        onChange={(e) => handleEditInputChange(e)}
      />

    </Space>
  );
};
export default SeriesOrGameAdd;