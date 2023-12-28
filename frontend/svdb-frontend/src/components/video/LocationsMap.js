import React, { useEffect, useState } from 'react';
import { Map, Marker, ZoomControl } from "pigeon-maps";
import { Avatar, Col, Modal, List, Row, Space, Tag, Typography, Divider, Empty } from 'antd';
import insertCss from 'insert-css';


const { Text } = Typography;

const LocationsMap = ({ video, _showLabel = true }) => {
    const [loaded, setLoaded] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visibleAll, setVisibleAll] = useState(false);
    const [locations, setLocations] = useState({});
    const [location, setLocation] = useState({});
    const [zoom, setZoom] = useState(3);
    const [center, setCenter] = useState([50.879, 4.6997]);
    // defaultCenter={[51.4873439, 0.0335215]} 


    useEffect(() => {
        // console.log(video);
        setLocations(video?.locations);
        // Object.keys(locations).map(key => {
        //     locations[key].map(location=> {
        //         console.log(center, center == undefined, center === undefined, location);
        //         setCenter(location.coords);
        //     })
        // });
        // if(video.locations) {
        //     setCenter(video?.locations[0].coords);
        // }
        setLoaded(true);

    }, [video]);

    insertCss(`
        .mapContainer {
            width: 100%;
            height: 100%;
        }
    `);

    return (
        <>
            {loaded && locations ?
                <div className="mapContainer">
                    <div style={{ marginBottom: '12px' }}>
                        <Text strong style={{ color: 'black' }}>Locations </Text>
                        {Object.keys(locations).map(key => {
                            const _locations = locations[key];
                            return _locations.map(location => {
                                return (
                                    <Tag style={{ cursor: 'pointer' }} color={location.color} key={location.title + '_list'} onClick={() => {
                                        setCenter(location.coords);
                                        setZoom(location.zoom);
                                    }}>
                                        {location.title}
                                    </Tag>
                                );
                            })
                        })}
                    </div>

                    <Map height="100%" width="100%" center={center} zoom={zoom} onBoundsChanged={({ center, zoom }) => {
                        setCenter(center)
                        setZoom(zoom)
                    }} >
                        <ZoomControl />
                        {loaded && locations && Object.keys(locations).map(key => {
                            // console.log(locations);
                            // console.log(key);
                            const _locations = locations[key];
                            // console.log(_locations)
                            return _locations.map(location => {
                                return (
                                    <Marker width={50} color={location.color} anchor={location.coords} />
                                );
                            })
                        })}
                    </Map>
                </div>
                : <></>

            }
        </>

    )
}

export default LocationsMap;