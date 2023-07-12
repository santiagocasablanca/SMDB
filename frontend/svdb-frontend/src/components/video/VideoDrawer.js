import React, { useState, useEffect } from 'react';

import { Card, List, Row, Col, Image, Avatar, Table, Typography, Space, Spin, Drawer, Button } from 'antd';
import insertCss from 'insert-css';

import variables from '../../sass/antd.module.scss';
import useFormatter from '../../hooks/useFormatter';
import ReactPlayer from 'react-player'



const { Title, Text } = Typography;



const VideoDrawer = ({ _video, _open, childToParent }) => {

    const { intToStringBigNumber, parseDate, parseDuration } = useFormatter();
    const [video, setVideo] = useState(_video);
    const [open, setOpen] = useState(_open);

    useEffect(() => {
        setVideo(_video);
        setOpen(_open);
        console.log('video drawer')
    }, [_video, _open]);


    const onClose = () => {
        console.log('video drawer on close')

        childToParent(false);
        setOpen(false);
    };

    const title = (
        <>
            {video.title}
        </>
    );

    return (
        <> {
            open ? (
                <Drawer title={title}
                    placement="bottom"
                    width={500}
                    height={800}
                    onClose={onClose}
                    open={open}
                    extra={
                        <Space>
                            <Text>{parseDate(video.published_at, "DD MMM YYYY")}</Text>
                            {/* <Button onClick={onClose}>Cancel</Button>
                        <Button type="primary" onClick={onClose}>OK</Button> */}
                        </Space>
                    }
                >

                    {/* <p>{video.title}</p> */}
                    <ReactPlayer url={video.player.embedHtml} width='100%' height='600px'></ReactPlayer>
                    <Space>

                    </Space>
                    <p>Some contents...</p>
                    <p>Some contents...</p>
                </Drawer>
            ) : ('')
        }
        </>
    );
}

export default VideoDrawer;