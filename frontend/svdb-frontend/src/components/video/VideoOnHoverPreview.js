import React from 'react';
import ReactPlayer from 'react-player/youtube';

const VideoOnHoverPreview = ({ video }) => {
    return (
        <div style={{ borderRadius: '8px', cursor: 'pointer', width:'316px', height:'189px', overflow: 'hidden' }}>
            <ReactPlayer url={video.player.embedHtml} playing={true} controls={false} width='100%' height='100%' ></ReactPlayer>
        </div>
    );
}

export default VideoOnHoverPreview;