import { Card, Col, Spin, Statistic } from 'antd';
import React, { useEffect, useState } from 'react';



const StatisticsCards = ({ stats }) => {

    const [isLoaded, setIsLoaded] = useState(false);


    useEffect(() => {
        if (stats !== null) {
            setIsLoaded(true);
        }
    }, []);

    const StatCard = ({ title, value, content }) => {

        return (
            // <Popover content={content} placement="bottom">
                <Card bordered={false} style={{ minWidth: '200px' }}>
                    <Statistic
                        title={title}
                        value={value}
                    />
                </Card>
            // </Popover>
        );
    };

    return (
        <> {isLoaded ?
            (
                <>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard title={stats?.subs.title}
                            value={stats?.subs.value}
                            content={stats?.subs.content} />

                    </Col>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard title={stats?.videos.title}
                            value={stats?.videos.value}
                            content={stats?.videos.content} />
                    </Col>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard
                            title={stats?.duration.title}
                            value={stats?.duration.value}
                            content={stats?.duration.content} />
                    </Col>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard
                            title={stats?.views.title}
                            value={stats?.views.value}
                            content={stats?.views.content} />
                    </Col>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard
                            title={stats?.likes.title}
                            value={stats?.likes.value}
                            content={stats?.likes.content} />
                    </Col>
                    <Col xs={18} sm={16} md={10} lg={9} xl={6} xxl={5}>
                        <StatCard
                            title={stats?.comments.title}
                            value={stats?.comments.value}
                            content={stats?.comments.content} />
                    </Col>
                </>
            ) : (
                <Col span={24}>
                    <Spin />
                </Col>
            )
        }
        </>
    );
}

export default StatisticsCards;