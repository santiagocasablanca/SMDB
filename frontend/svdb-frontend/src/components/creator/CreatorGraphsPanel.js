import { Col, Row, Card, Table, Tag, Button, Typography, Tooltip, Popover, Select, Space } from 'antd';
import { green, presetDarkPalettes } from '@ant-design/colors';
import { yellow } from '@ant-design/colors';
import { React, useEffect, useState } from "react"
import { getVideosFn } from "../../services/videoApi.ts"
import VideographyEditPanel from './VideographyEditPanel'
import dayjs from "dayjs"
import insertCss from 'insert-css'
import variables from '../../sass/antd.module.scss'
import useFormatter from '../../hooks/useFormatter';
import { LikeOutlined, YoutubeOutlined, CalendarOutlined, VideoCameraOutlined, EyeOutlined, UserOutlined, FilterOutlined } from '@ant-design/icons';
import VideographyFilterPanel from './VideographyFilterPanel';

// .ant-input {
//   color: $coolLighterGray !important;
// } 


const { Title } = Typography;

const Videography = ({ title, _filters }) => {

    const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();

    const defaultFilters = {
        title: '',
        channels: _filters.channels,
        published_atRange: [],
        tags: [],
        locations: '',
        series: [],
        search: false, // Set this to false by default
        category: '',
        onlyShorts: Boolean,
        excludeShorts: Boolean,
        date: null,
    };

    const [myFilters, setMyFilters] = useState(_filters || defaultFilters);

    insertCss(`
        @media (max-width: 600px) {
        }
    `);



    useEffect(() => {
        console.log(_filters);
        console.log(myFilters);
        let params = new URLSearchParams()

        // params.append('sort', `${columnSorter.column}%${columnSorter.state}`);

        for (const property in myFilters) {
            console.log(property, myFilters[property], typeof myFilters[property] === 'boolean' || myFilters[property] != '');
            if (typeof myFilters[property] === 'boolean' || (myFilters[property] && myFilters[property] != '' && myFilters[property].length > 0))
                params.append(property, myFilters[property]);
        }
        console.log(params);

        getVideosFn(offset, itemsPerPage, params)
            .then((result) => {
                setRecords(result.results)
                result.results ? setVideos(result.videos) : setVideos([])
            })
    }, [_filters, activePage, columnFilter, columnSorter, itemsPerPage])



    return (
        <>

        </>
    )
}

export default Videography
