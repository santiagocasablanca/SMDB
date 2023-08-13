import { React, useState } from 'react';
import { Table, Tag } from 'antd';
import useFormatter from '../../hooks/useFormatter';
import dayjs from "dayjs";
import variables from '../../sass/antd.module.scss';
import VideographyEditPanel from '../creator/VideographyEditPanel';

const GuestVideosTable = ({ data }) => {

    const { intToStringBigNumber, parseDate, parseDuration, displayVideoDurationFromSeconds, humanizeDurationFromSeconds, displayVideoDurationFromSecondsWithLegend } = useFormatter();

    const columns = [
        {
            key: 'channel_title',
            dataIndex: 'channel_title',
            title: 'Channel',
            width: '10%',
            ellipsis: true,
        },
        {
            key: 'title',
            dataIndex: 'title',
            title: 'Title',
            width: '30%',
            sorter: true
        },
        { key: 'duration_parsed', title: 'Duration', dataIndex: 'duration_parsed', width: '8%', align: 'right', sorter: true, render: (text) => <p>{displayVideoDurationFromSecondsWithLegend(text)}</p> },
        {
            key: 'serie',
            dataIndex: 'serie',
            width: '10%',
            title: "Series",
            render: (series) => (
                ((series != '' & series != null) ?
                    <span>
                        <Tag color={variables.sdmnPink} key={series}> {series} </Tag>
                    </span>
                    : '')
            ),
        },
        { key: 'published_at', title: 'Published At', dataIndex: 'published_at', width: '10%', sorter: true, render: (text) => <p>{dayjs(text).format("DD MMM YYYY")}</p> },
        { key: 'views', title: 'Views', dataIndex: 'views', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
        { key: 'likes', title: 'Likes', dataIndex: 'likes', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
        { key: 'comments', title: 'Comments', dataIndex: 'comments', width: '8%', align: 'right', sorter: true, render: (text) => <p>{intToStringBigNumber(text)}</p> },
        {
            key: 'tags',
            width: '10%',
            title: "Tags",
            dataIndex: 'tags',
            render: (tags) => (
                (
                    Array.isArray(tags) ?
                        <span>
                            {tags.map((tag) => {
                                // let color = tag.length > 5 ? variables.sdmnYellow : 'green';
                                return (
                                    <Tag color={variables.sdmnBlack} key={tag}>
                                        {tag}
                                    </Tag>
                                );
                            })}
                        </span> : ''
                )
            ),
        },
        // {
        //   key: 'locations',
        //   width: '10%',
        //   title: "Locations",
        // },
        // {
        //   key: 'cast',
        //   title: "Cast",
        //   dataIndex: 'cast',
        //   render: (tags) => (
        //     <span>
        //       {tags.map((tag) => {
        //         let color = tag.length > 5 ? 'geekblue' : 'green';
        //         // if (tag === 'loser') {
        //         //   color = 'volcano';
        //         // }
        //         return (
        //           <Tag color={color} key={tag}>
        //             {tag}
        //           </Tag>
        //         );
        //       })}
        //     </span>
        //   ),
        // },
    ];

    const isRowExpanded = (record) => expandedRowKeys.includes(record.video_id);

    const rowClassName = (record, index) => {
        return isRowExpanded(record) ? 'expanded-row' : '';
    };

    const [expandedRowKeys, setExpandedRowKeys] = useState([]);

    const handleExpand = (expanded, record) => {
        if (expanded) {
            setExpandedRowKeys([...expandedRowKeys, record.video_id]);
        } else {
            setExpandedRowKeys(expandedRowKeys.filter((key) => key !== record.video_id));
        }
    };

    return <Table columns={columns} dataSource={data} rowKey="video_id"
        rowClassName={rowClassName}
        expandable={{
            expandedRowRender: (record) => <VideographyEditPanel _video={record}></VideographyEditPanel>,
            rowExpandable: (record) => record.title !== 'Not Expandable',
            expandedRowKeys: expandedRowKeys,
            onExpand: handleExpand
        }} />;
};

export default GuestVideosTable;