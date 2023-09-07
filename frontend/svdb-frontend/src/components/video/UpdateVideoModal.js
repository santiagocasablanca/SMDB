import { EditOutlined } from '@ant-design/icons';
import { Button, Form, Input, Modal, notification, Select } from 'antd';
import React, { useState } from 'react';
import { updateVideoFn } from "../../services/videoApi.ts";
import CastSelector from '../creator/CastSelector';
import CreatorSelector from '../creator/CreatorSelector';
import TagsAdd from './TagsAdd';
import Locations from './Locations';
import SeriesOrGameAdd from './SeriesOrGameAdd';

const UpdateVideoModal = ({ video, _icon, _color, big }) => {
    const [visible, setVisible] = useState(false);
    const [directorIds, setDirectorIds] = useState();
    const [cast, setCast] = useState();
    const [tags, setTags] = useState([]);
    const [series, setSeries] = useState();
    const [game, setGame] = useState();



    const [form] = Form.useForm();

    const showModal = () => {
        console.log('video: ', video);
        setDirectorIds(video?.directedBy?.map(creator => creator.id) || []);
        setCast(video?.cast?.map(creator => { return { creator: creator.video_creator.creator_id, role: creator.video_creator.role } }) || []);
        setTags(video?.tags);
        setSeries(video?.serie);
        setGame(video?.game);

        console.log(video?.tags);
        setVisible(true);
    };

    const handleCancel = () => {
        setVisible(false);
    };

    const onFinish = (values) => {
        console.log(values);
        // const director_ids = values.directors.split(',').map((id) => id.trim());
        updateVideoFn(values.apiKey, video.video_id, { directedBy: directorIds, cast: cast, game: game, series: series, tags: tags });
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

    const handleTags = (values) => {
        console.log('handling tags, ' + values);
        setTags(values);
        form.setFieldsValue({ tags: values });
    }

    const handleGame = (values) => {
        console.log('handling game, ' + JSON.stringify(values));
        setGame(values);
        form.setFieldsValue({ game: values });
    }

    const handleSeries = (values) => {
        console.log('handling series, ' + JSON.stringify(values));
        setSeries(values);
        form.setFieldsValue({ gseriesame: values });
    }

    const customIconStyle = {
        fontSize: big ? '24px': '16px',
        color: _color ? _color : 'white',   // Adjust the color
      };

    return (
        <>
            {/* <Button type="text" onDoubleClick={showModal} icon={_icon ? _icon : <EditOutlined style={{width: big ? '24px': '16px'}} />} style={{color: _color ? _color : 'white', cursor: 'default'}}/> */}

            {React.cloneElement(_icon ? _icon : <EditOutlined/>, {
                style: customIconStyle 
            })}

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
                    <Form.Item
                        name="tags"
                        label="Tags"
                        rules={[
                            { required: false, message: 'Please enter at least one tag' },
                        ]}>
                        <TagsAdd _tags={tags} onChange={handleTags} />
                    </Form.Item>
                    <Form.Item
                        label="Game"
                        name="game"
                        rules={[
                            { required: false, message: 'Please enter at least one gamee' },
                        ]}>
                        <SeriesOrGameAdd _tag={game} onChange={handleGame} />
                    </Form.Item>
                    <Form.Item
                        label="Series"
                        name="series"
                        rules={[
                            { required: false, message: 'Please enter at least one series' },
                        ]}>
                        <SeriesOrGameAdd _tag={series} onChange={handleSeries} />
                    </Form.Item>

                    {/* <Form.Item
                        label="Locations"
                        name="locations"
                        rules={[
                            { required: false, message: 'Please enter at least one location' },
                        ]}>
                            <Locations video={{video}}/> 
                    </Form.Item> */}

                    <Form.Item>
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    );
}


export default UpdateVideoModal;