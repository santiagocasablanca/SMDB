
import { Divider, Space, Tag, Typography } from 'antd';
import { React, useEffect, useState } from "react";
import { getCreatorsFn } from "../../services/creatorApi.ts";
import SingleCastSelector from "./SingleCastSelector";


const { Title, Text } = Typography;

const CastSelector = ({ _selectedCast, onChange }) => {
  const [showAddMore, setShowAddMore] = useState(true);
  const [originalOptions, setOriginalOptions] = useState([]);
  const [options, setOptions] = useState([]);
  const [cast, setCast] = useState(_selectedCast || []);
  const [creators, setCreators] = useState([]);

  useEffect(() => {
    fetchCreatorsAndParseOptions();
  }, []);


  const fetchCreatorsAndParseOptions = () => {
    let params = new URLSearchParams();

    getCreatorsFn(params)
      .then((result) => {
        const temp = []
        setCreators(result.results);
        result.results.forEach((item) => {
          temp.push({
            label: item.name,
            value: item.id
          });
        })
        setOriginalOptions(temp);
        setOptions(temp);
      
      })
  };

  const filterOptions = (allOptions, selectedOptions) => {
    // Exclude the selected creators from the options
    return allOptions.filter(option => !selectedOptions.some(selected => selected.value === option.value));
  };

  const handleCastChange = (_cast) => {
    console.log('handling ')
    setCast([...cast, _cast]); // Create a new array with the updated cast
    setOptions(filterOptions(options, [{ value: _cast.creator }]));
    setShowAddMore(true);
    onChange([...cast, _cast]);

  };

  const handleClose = (removedTag) => {
    console.log('removing, ', removedTag)
    const newTags = cast.filter((tag) => tag !== removedTag);
    console.log(newTags);
    setCast(newTags);
    onChange(newTags);
    const findOriginal = originalOptions.find((option) =>  option.value === removedTag.creator);
    setOptions([...options, findOriginal]);
  };

  const getLabelFromValue = (desiredValue) => {
    const foundElement = creators.find((item) => item.id === desiredValue);
    if (foundElement) {
      return foundElement.name;
    } else {
      return null;
    }
  }

  return (
    <>
      {cast.length > 0 ?
        (
          <>
            <Space size={[0, 8]} wrap>
              {cast?.map((tag, index) => {
                return (

                  <Tag
                    key={index}
                    closable={true}
                    style={{
                      userSelect: 'none',
                    }}
                    onClose={() => handleClose(tag)}
                  >
                    <span>{getLabelFromValue(tag.creator)} <Text type="secondary"> as {tag.role}</Text> </span>

                  </Tag>
                )
              })}
            </Space>
            <Divider style={{ margin: "7px 0" }}></Divider>
            {showAddMore ?
              <Tag
                key="addMoreTag"
                closable={false}
                style={{
                  userSelect: 'none',
                }}>
                <span
                  onDoubleClick={(e) => {
                    setShowAddMore(false)
                  }}>
                  Add more</span>
              </Tag> :
              <SingleCastSelector _options={options} onChange={handleCastChange} />
            }
          </>
        )
        :
        (
          <SingleCastSelector _options={options} onChange={handleCastChange} />
        )
      }



    </>
  )
}

export default CastSelector
