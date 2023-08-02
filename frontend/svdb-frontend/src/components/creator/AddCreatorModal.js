import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, List, Row, Col, Image, Table, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Input, notification } from 'antd';
import { LikeOutlined, UserAddOutlined } from '@ant-design/icons';

import insertCss from 'insert-css';
import { getCreatorsFn, createAndAssociateChannelsFn } from "../../services/creatorApi.ts";
import variables from '../../sass/antd.module.scss'
import useFormatter from '../../hooks/useFormatter';


const AddCreatorModal = ({ }) => {
    const [visible, setVisible] = useState(false);

    const showModal = () => {
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = (values) => {        const channel_ids = values.channelIds.split(',').map((id) => id.trim());
        createAndAssociateChannelsFn({ name: values.name, custom_url: values.custom_url, profile_picture: values.profile_picture, banner_picture: values.banner_picture, channel_ids: channel_ids })
        // Close the modal
        setVisible(false);

        // Show a success notification
        notification.success({
            message: 'Creator added',
            description: 'The Creator was added, however it might take a few minutes until all channel and video information is completely fetched.',
        });
    };

    return (
        <>
            <Button onClick={showModal} icon={<UserAddOutlined />}/>
            <Modal
                title="Add new Creator and Associate Channels Ids"
                visible={visible}
                onCancel={handleCancel}
                footer={null}>
                {/* name	custom_url	profile_picture	banner_picture */}
                <Form onFinish={onFinish}>
                    {/* name */}
                    <Form.Item
                        name="name"
                        label="Name"
                        rules={[
                            { required: true, message: 'Please enter at least one channel ID' },
                        ]}
                    >
                        <Input
                            placeholder="Enter the Creator name"
                        />
                    </Form.Item>
                    <Form.Item
                        name="custom_url"
                        label="Custom Url"
                        rules={[
                            { required: true, message: 'Please enter the Custom Url' },
                        ]}
                    >
                        <Input
                            placeholder="Enter the Custom url"
                        />
                    </Form.Item>
                    <Form.Item
                        name="profile_picture"
                        label="Profile Picture URl"
                        rules={[
                            { required: true, message: 'Please enter the profile picture url' },
                        ]}
                    >
                        <Input
                            placeholder="Enter the url for the profile picture"
                        />
                    </Form.Item>
                    <Form.Item
                        name="banner_picture"
                        label="Banner Picture URl"
                        rules={[
                            { required: true, message: 'Please enter the banner picture url' },
                        ]}
                    >
                        <Input
                            placeholder="Enter the url for the banner picture"
                        />
                    </Form.Item>

                    <Form.Item
                        name="channelIds"
                        label="Channel IDs"
                        rules={[
                            { required: true, message: 'Please enter at least one channel ID' },
                        ]}
                    >
                        <Input.TextArea
                            placeholder="Enter channel IDs (separated by commas)"
                            autoSize={{ minRows: 3, maxRows: 6 }}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}


export default AddCreatorModal;