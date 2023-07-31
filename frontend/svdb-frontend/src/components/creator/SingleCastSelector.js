
import { React, useEffect, useState } from "react"
import { getCreatorsFn } from "../../services/creatorApi.ts";
import { Card, List, Row, Col, Image, Select, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Input, notification } from 'antd';


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
        value={creator}
        onChange={handleCreatorChange}
        options={options}>
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