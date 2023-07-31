import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Row, Col, Image, Table, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Input, notification } from 'antd';
import { LikeOutlined, UserAddOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import { getCreatorsFn } from "../../services/creatorApi.ts";
import { updateVideoFn } from "../../services/videoApi.ts";
import variables from '../../sass/antd.module.scss'
import useFormatter from '../../hooks/useFormatter';
import CreatorSelector from '../creator/CreatorSelector';
import CastSelector from '../creator/CastSelector';

const UpdateVideoModal = ({ video }) => {
    const [visible, setVisible] = useState(false);
    const [directorIds, setDirectorIds] = useState([]);
    const [cast, setCast] = useState([]);

    const [form] = Form.useForm();

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = (values) => {
        console.log(video);
        console.log(directorIds, cast);
        // const director_ids = values.directors.split(',').map((id) => id.trim());
        updateVideoFn(video.video_id, { directedBy: directorIds, cast: cast });
        // Close the modal
        setVisible(false);

        // Show a success notification
        notification.success({
            message: 'Video updated',
            description: 'The video is being updated, however it might take a few minutes until all channel and video information is completed.',
        });
    };

    const handleDirector = (values) => {
        console.log('handling director, ' + values);
        setDirectorIds(values);
    }

    const handleCast = (values) => {
        console.log('handling cast, ' + values);
        setCast(values);
        form.setFieldsValue({ cast: values });
    }

    return (
        <>
            <Button onClick={showModal} icon={<UserAddOutlined />} />
            <Modal
                title="Update Video Information"
                visible={visible}
                onCancel={handleCancel}
                footer={null}>

                <Form onFinish={onFinish} form={form}>

                    <Form.Item
                        name="directedBy"
                        label="Directed by"
                        rules={[
                            { required: true, message: 'Please enter at least one creator' },
                        ]}>
                        <CreatorSelector onChange={handleDirector} />
                    </Form.Item>
                    <Form.Item
                        label="Cast"
                        name="cast"
                        rules={[
                            { required: true, message: 'Please enter at least one creator' },
                        ]}>
                        <CastSelector onChange={handleCast} />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}


export default UpdateVideoModal;