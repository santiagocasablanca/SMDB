
import { Select } from 'antd';
import { React, useEffect, useState } from "react";
import { getCreatorsFn } from "../../services/creatorApi.ts";


const CreatorSelector = ({ _selectedCreators, onChange }) => {
  const [creators, setCreators] = useState(_selectedCreators || []);
  // const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    fetchCreators();
  }, [_selectedCreators]);


  const fetchCreators = () => {
    let params = new URLSearchParams();

    getCreatorsFn(params)
      .then((result) => {
        const temp = []
        result.results.forEach((item) => {
          temp.push({
            label: item.name,
            value: item.id
          });
        })

        setOptions(temp);

        // result.results ? setCreators(result.results) : setCreators([])
      })
  }

  const handleCreatorChange = (selectedCreators) => {
    setCreators(selectedCreators);
    onChange(selectedCreators);
  };


  return (
    <Select mode="multiple" style={{ width: '100%' }} placeholder="Please select a creator"
      value={creators}
      showSearch
      allowClear
      onChange={handleCreatorChange}
      options={options}
      optionFilterProp="children"
      filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
      }
    >
    </Select>
  )
}

export default CreatorSelector
