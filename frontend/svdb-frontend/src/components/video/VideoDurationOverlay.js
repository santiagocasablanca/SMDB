import { Typography } from 'antd';
import React from 'react';
import useFormatter from '../../hooks/useFormatter';

const { Text } = Typography;


const VideoDurationOverlay = ({ duration }) => {
    const { parseDurationInMinutes } = useFormatter();
    
    // 480 x 270—  value={rating}
    return (
        <Text style={{ fontSize: '10px', color: 'white', padding: '3px', backgroundColor: 'black', opacity: '0.8', borderRadius: '5px' }}>{parseDurationInMinutes(duration)}</Text>
    );
}

export default VideoDurationOverlay;