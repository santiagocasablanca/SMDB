
import { Button, Input, Select, Space } from 'antd';
import { React, useEffect, useState } from "react";


const SingleCastSelector = ({ _options, onChange }) => {
  const [creator, setCreator] = useState();
  // const [channels, setChannels] = useState([]);
  const [options, setOptions] = useState(_options);
  const [role, setRole] = useState('himself'); // Default role is 'himself'


  useEffect(() => {
    setOptions(_options);
  }, [_options]);


  // const fetchCreators = () => {
  //   let params = new URLSearchParams();

  //   getCreatorsFn(params)
  //     .then((result) => {
  //       const temp = []
  //       result.results.forEach((item) => {
  //         temp.push({
  //           label: item.name,
  //           value: item.id
  //         });
  //       })

  //       setOptions(temp);

  //       // result.results ? setCreators(result.results) : setCreators([])
  //     })
  // }

  const handleCreatorChange = (selectedCreator) => {
    setCreator(selectedCreator);
    // onChange({ creators: selectedCreators, role });
  };

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    // onChange({ creators, role: selectedRole });
  };

  const handleAddButtonClick = () => {

    onChange({ creator: creator, role: role });
    setCreator(null);
    setRole('himself');
  };


  return (
    <Space.Compact>

      <Select mode="single" style={{ width: "185px" }} placeholder="Please select a creator"
        showSearch
        allowClear
        onChange={handleCreatorChange}
        options={options}
        optionFilterProp="children"
        filterOption={(input, option) => (option?.label ?? '').toLowerCase().includes(input.toLowerCase())}
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())
        }>
      </Select>

      <Input
        // style={{ marginTop: '1rem' }}
        placeholder="Enter the role"
        value={role}
        onChange={(e) => handleRoleChange(e.target.value)}
      />

      <Button type="primary" onClick={handleAddButtonClick}>
        +
      </Button>

    </Space.Compact>
  )
}

export default SingleCastSelector
