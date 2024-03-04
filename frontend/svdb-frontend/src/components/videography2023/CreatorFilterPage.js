import React, { useState, useEffect } from 'react';
import { getCreatorsFn } from "../../services/creatorApi.ts";
import variables from '../../sass/antd.module.scss';
import dayjs from 'dayjs';

const CreatorFilterPage = ({ onSelectedCreatorsChange }) => {
    const [creators, setCreators] = useState([]);
    const [selectedCreators, setSelectedCreators] = useState([]);


    const sidemenCreatorIds = ['23ecdddf-ae37-4af4-82a4-d72e572b2072',
        'e4a38cf7-9f23-45a2-840a-2015e67a3a12',
        'd06921bc-e30a-44c8-9e4c-e30c86a404ac',
        'd83880e7-741d-4b0d-a127-47f20d6a07d9',
        '60972f0c-f156-4861-a9e8-91280a3c3f2d',
        '8c877155-c6ac-41ba-b66e-bd2f706b6e87',
        '90ef2faa-8a36-45b9-a025-06bf36769931'
    ];

    // Fetch creator data from your backend
    useEffect(() => {
        async function fetchData() {
            let _params = new URLSearchParams();
            _params.append("publishedAtRange", [dayjs('2023-01-01').format(), dayjs('2024-01-01').format()]);
            await getCreatorsFn(1, 100, _params).then((res) => {
                setCreators(res.results);
                const filteredResults = res.results.filter(item => sidemenCreatorIds.includes(item.id));
                // Update selectedCreators state
                setSelectedCreators(filteredResults);
                // setSelectedCreators(res.results);
                onSelectedCreatorsChange(filteredResults);
            })
        }
        fetchData();
    }, []);

    const handleCreatorClick = (creator) => {
        // Toggle the selection of creators
        const updatedSelectedCreators = selectedCreators.includes(creator)
            ? selectedCreators.filter((sC) => sC.id !== creator.id)
            : [...selectedCreators, creator];

        // Update selectedCreators state
        setSelectedCreators(updatedSelectedCreators);

        // Call the callback function to inform the parent about the new selected creators
        onSelectedCreatorsChange(updatedSelectedCreators);
    };

    return (
        <div>
            <div style={{ display: 'flex', overflowY: 'hidden' }}>
                {creators.map((creator) => (
                    <img
                        key={creator.id}
                        src={creator.profile_picture}
                        alt={creator.name}
                        onClick={() => handleCreatorClick(creator)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: selectedCreators.includes(creator) ? '1px solid ' + variables.sdmnYellow : '1px solid transparent',
                            filter: selectedCreators.includes(creator) ? 'none' : 'grayscale(80%)',
                            cursor: 'pointer',
                        }}
                    />
                ))}
            </div>
            <div>
                {/* Display table with results based on the selectedCreator */}
            </div>
        </div>
    );
};

export default CreatorFilterPage;