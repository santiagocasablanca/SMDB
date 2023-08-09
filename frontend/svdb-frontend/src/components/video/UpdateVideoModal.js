import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification } from 'antd';
import React, { useState } from 'react';
import { updateVideoFn } from "../../services/videoApi.ts";
import CastSelector from '../creator/CastSelector';
import CreatorSelector from '../creator/CreatorSelector';


const UpdateVideoModal = ({ video }) => {
    const [visible, setVisible] = useState(false);
    const [directorIds, setDirectorIds] = useState();
    const [cast, setCast] = useState();

    const [form] = Form.useForm();

    const showModal = () => {
        console.log('video: ', video);
        setDirectorIds(video?.directedBy?.map(creator => creator.id) || []);
        setCast(video?.cast?.map(creator => {return {creator:creator.video_creator.creator_id, role: creator.video_creator.role}}) || []);
        console.log(directorIds);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = (values) => {
        console.log(video);
        console.log(directorIds, cast);
        // const director_ids = values.directors.split(',').map((id) => id.trim());
        updateVideoFn(values.apiKey, video.video_id, { directedBy: directorIds, cast: cast });
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
        console.log('handling cast, ' + JSON.stringify(values));
        setCast(values);
        form.setFieldsValue({ cast: values });
    }

    return (
        <>
            <Button type="text" onClick={showModal} icon={<EditOutlined />} />
            <Modal
                title="Update Video Information"
                open={visible}
                onCancel={handleCancel}
                footer={null}>

                <Form onFinish={onFinish} form={form}>
                    <Form.Item
                        name="apiKey"
                        label="Api Key"
                        rules={[
                            { required: true, message: 'Please enter the api key' },
                        ]}>
                        <Input
                            placeholder="Enter the Api Key"
                        />
                    </Form.Item>
                    <Form.Item
                        name="directedBy"
                        label="Directed by"
                        rules={[
                            { required: false, message: 'Please enter at least one creator' },
                        ]}>
                        <CreatorSelector onChange={handleDirector} _selectedCreators={directorIds} />
                    </Form.Item>
                    <Form.Item
                        label="Cast"
                        name="cast"
                        rules={[
                            { required: false, message: 'Please enter at least one creator' },
                        ]}>
                        <CastSelector onChange={handleCast} _selectedCast={cast} />
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