import React, { useState, useEffect } from 'react';
import { getCreatorsFn } from "../../services/creatorApi.ts";
import variables from '../../sass/antd.module.scss';


const ChannelsFilterPage = ({ channels, onSelectedChannelsChange }) => {

    const [selectedChannels, setSelectedChannels] = useState([]);

    useEffect(() => {
        setSelectedChannels(channels);
        onSelectedChannelsChange(channels);
    }, [channels]);
   

    const handleChannelClick = (channel) => {
        // Toggle the selection of channels
        const updatedSelectedChannels = selectedChannels.includes(channel)
            ? selectedChannels.filter((sC) => sC.id !== channel.id)
            : [...selectedChannels, channel];

        // Update SelectedChannels state
        setSelectedChannels(updatedSelectedChannels);

        // Call the callback function to inform the parent about the new selected channels
        onSelectedChannelsChange(updatedSelectedChannels);
    };

    return (
        <div>
            <div style={{display: 'flex', overflowY: 'hidden'}}>
                {channels.map((channel) => (
                    <img
                        key={channel.channel_id}
                        src={channel.logo_url}
                        alt={channel.title}
                        onClick={() => handleChannelClick(channel)}
                        style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            objectFit: 'cover',
                            border: selectedChannels.includes(channel) ? '1px solid ' + variables.sdmnYellow : '1px solid transparent',
                            filter: selectedChannels.includes(channel) ? 'none' : 'grayscale(80%)',
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

export default ChannelsFilterPage;