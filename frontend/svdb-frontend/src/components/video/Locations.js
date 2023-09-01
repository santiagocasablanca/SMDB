import React, { useEffect, useState } from 'react';
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { Avatar, Col, Modal, List, Row, Space, Tag, Typography, Divider } from 'antd';


const { Text } = Typography;

const Locations = ({ video }) => {
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleAll, setVisibleAll] = useState(false);
    const [locations, setLocations] = useState({});
    const [location, setLocation] = useState({});
    const [zoom, setZoom] = useState(11);
    const [center, setCenter] = useState();


    useEffect(() => {
        console.log(video?.locations);
        setLocations(video?.locations);
        setLoaded(true);

    }, [video]);


    const showModal = (location) => {
        setLocation(location);
        setZoom(location.zoom);
        setCenter(location.coords)
        setVisible(true);
    };

    const handleCancel = () => {
        setLocation({});
        setVisible(false);
        // setLoaded(false);
    };

    const showAll = () => {
        setVisibleAll(true);
        // setLoaded(true);
    };

    const handleCancelAll = () => {
        setVisibleAll(false);
        // setLoaded(false);
    };

    return (
        <>
            {loaded && locations ?
                <>
                    <Text strong style={{ marginLeft: '20px' }}>Locations </Text>
                    <Tag color='#101010' key='allTag' onClick={showAll}>See All </Tag>
                    {Object.keys(locations).map(key => {
                        const _locations = locations[key];
                        return _locations.map(location => {
                            return (
                                <Tag color={location.color} key={location.title + '_list'} onClick={() => showModal(location)}>
                                    {location.title}
                                </Tag>
                            );
                        })
                    })}

                    <Modal
                        title={location.modalTitle}
                        open={visible}
                        onCancel={handleCancel}
                        footer={null}>

                        <Map height={400} center={center} zoom={zoom} onBoundsChanged={({ center, zoom }) => {
                            setCenter(center)
                            setZoom(zoom)
                        }} >
                            <ZoomControl />
                            <Marker width={50} color={location.color} anchor={location.coords} />
                        </Map>
                    </Modal>

                    <Modal
                        title='Locations'
                        open={visibleAll}
                        width={750}
                        onCancel={handleCancelAll}
                        footer={null}>

                        <Map height={500} width={700} defaultCenter={[36.5310301, -4.9085383]} zoom={4} onBoundsChanged={({ center, zoom }) => {
                            // setCenter(center)
                            setZoom(zoom)
                        }} >
                            <ZoomControl />
                            {loaded && locations && Object.keys(locations).map(key => {
                                console.log(locations);
                                console.log(key);
                                const _locations = locations[key];
                                console.log(_locations)
                                return _locations.map(location => {
                                    return (
                                        <Marker width={50} color={location.color} anchor={location.coords} />
                                    );
                                })
                            })}
                        </Map>
                    </Modal>
                </>
                : <></>

            }
        </>

    )
}

export default Locations;