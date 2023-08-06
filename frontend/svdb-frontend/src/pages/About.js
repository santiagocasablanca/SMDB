import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Spin, Row, Col, Image, Select, Space, Avatar, Button, Popover, Tag, Typography, Modal, Form, Tooltip, Input, notification, Divider } from 'antd';
import { CrownOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import insertCss from 'insert-css';
import variables from '../sass/antd.module.scss';
import { AppLogo } from '../components';



const { Title, Text, Link } = Typography;

const AboutPage = () => {
  // const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);



  insertCss(` 
  .aboutHeaderPanel {
    margin: 10px 100px auto;
    color: `+ variables.sdmnYellow + `;
  }

  .aboutHeaderPanel h3 {
    color: `+ variables.richBlack + `;
  }
  .aboutHeaderPanel span {
    color: `+ variables.richBlack + `;
    gap: 5px;
  }
 
  .aboutHeaderPanel button span {
    background: `+ variables.richBlack + `;
    color: `+ variables.sdmnYellow + `;
    
  }

  .aboutContainer {
    margin: 0 100px auto;
  }

  @media (max-width: 600px) {
    .aboutContainer {
      margin: 0 20px;
    }
    .aboutHeaderPanel {
      margin: 10px 30px auto;
    }
  }
  `
  );
  const HeaderPanel = ({ title, }) => {
    useEffect(() => {
    }, []);


    return (
      <Row className="aboutHeaderPanel">
        <Col span="22">
          <Title level={3}><Space><CrownOutlined /> {title}</Space></Title>
        </Col>
        <Col span="2">
          {/* TODO */}
          {/* <Popover content={content}>
            <Text italic>information</Text> 
          </Popover>*/}
        </Col>
      </Row>
    );
  };

  const svdbProjectTitle = (
    <Row justify="center">
      <Card style={{ width: '90%', backgroundColor: 'white' }} bodyStyle={{ padding: '2px' }}>
        <Space style={{ marginLeft: '10px' }}><AppLogo /> <Title style={{ color: 'black', marginBottom: '0px', textWrap: 'wrap' }} ellipsis={{
          tooltip: 'Sidemen Video Database',
        }}>Sidemen Video Database</Title></Space>
      </Card>
    </Row>
  );

  const aboutMeTitle = (
    <Row justify="center">
      <Card style={{ width: '90%', backgroundColor: 'white' }} bodyStyle={{ padding: '2px' }}>
        <Space style={{ marginLeft: '10px' }}><Avatar src="https://media.licdn.com/dms/image/D4D35AQHkJ7Xk52eXcw/profile-framedphoto-shrink_400_400/0/1687518557082?e=1691866800&v=beta&t=a4MXziFTspw1KI09kGoLusaFSpXAF1CkN5KaSe1JCRw"></Avatar> <Title style={{ color: 'black', marginBottom: '0px', textWrap: 'wrap' }} ellipsis={{
          tooltip: 'Open for work!',
        }}>Open for work!!</Title></Space>
      </Card>
    </Row>
  );

  return (<>
    <HeaderPanel title="About"></HeaderPanel>
    {isLoaded ?
      (
        <div className="aboutContainer">
          <Row gutter={[8, 10]}>
            <Col md={24} lg={24} xl={12}>
              <Card title={svdbProjectTitle} headStyle={{ padding: '10px' }} >


                <Divider orientation="left">STILL UNDER CONSTRUCTION</Divider>

                <p>This is a proof of concept for a YouTube IMDb similar web application, focusing on Sidemen and other YouTubers that often collaborate within the scene as Creators. </p>

                <p>The application utilizes a traditional SQL model to store <Text code>Channel</Text> and <Text code>Video</Text> data fetched from YouTube using the <Text code>YouTube API</Text>.
            It introduces the concept/tables of <Text code>Creator</Text> and <Text code>Channel_Creator</Text> to represent multiple <Text code>Channels</Text> owned by one <Text code>Creator</Text> and <Text code>Channels</Text> owned by multiple <Text code>Creators</Text> simultaneously.</p>

                <p>The tables <Text code>Channel_Stats</Text> and <Text code>Video_Stats</Text> are used to keep track of the evolution of <Text code>channel</Text> and <Text code>video</Text> statistics over time.</p>

                <p>The application also introduces the concepts of <Text code>directed_by</Text>, used to represent the main creator(s) responsible for a given <Text code>video</Text>, and <Text code>cast</Text> (creator_id, role) used for storing the creators that appear in each video.</p>

                <Divider orientation="left">Technologies Used:</Divider>
                <p><Text code>Node.js</Text>,  <Text code>Express.js</Text>,  <Text code>Docker</Text>,  <Text code>Sequelize</Text>,  <Text code>PostgreSQL</Text>,  <Text code>React</Text>,  <Text code>antd</Text>
                </p>
                <Link href="https://github.com/santiagocasablanca/SMDB"><GithubOutlined /> Visit the Project Github</Link>
                <br></br>
                <br></br>
                <Divider orientation="left">Project Inspirations:</Divider>
                <ul>
                  <li><a href="https://mattw.io/youtube-metadata/">https://mattw.io/youtube-metadata/</a></li>
                  <li><a href="https://codevoweb.com/wp-content/uploads/2023/01/Build-a-CRUD-API-with-Node.js-and-Sequelize.webp">https://codevoweb.com/wp-content/uploads/2023/01/Build-a-CRUD-API-with-Node.js-and-Sequelize.webp</a></li>
                </ul>
              </Card>
            </Col>
            <Col md={24} lg={24} xl={12}>
              <Card title={aboutMeTitle} headStyle={{ padding: '10px' }} >


                <Divider orientation="left">Background</Divider>

                <p>Faculty of Engineering of University of Porto 2013</p>
                <p>MSc Degree in Computing Engineering</p>

                <p>10+ years of experience in full-stack development, working on a diverse range of web applications, including <Text code>Asset Management Solution</Text>, <Text code>HR and Attendance Management Solution</Text>,
                <Text code>Utilities Custom Care and Billing Solution</Text>, and various consulting projects.</p>
                <Space>
                  <Link href="mailto:tiagomartinslomba@gmail.com"><MailOutlined /> Contact me</Link>
                  <Divider />

                  <Link href="https://www.linkedin.com/in/tiago-martins-lomba/"><LinkedinOutlined /> Linkedin</Link>
                  <Divider />
                  <Link href="https://github.com/santiagocasablanca/SMDB"><GithubOutlined /> Visit the Project Github</Link>
                </Space>

                <Divider orientation="left">Last experience [2018-2023]</Divider>

                <p>
                  Yo! is a modular multi-vendor and multi-tenant product mainly focused on employee and attendance management.
                  It started as an internal project with me as the architect and backend developer, alongside a senior frontend developer.
                  We adopted a microservice-based modular architecture using a MEAN stack, which proved to be valuable due to its fast development and successful deployment.
                  Coincidentally, during that time, Vodafone Portugal was in search of a product with similar features for their product catalog, leading to the birth of Vodafone Teamlog.
                  Currently, Yo! is being sold by Wondercom, while Teamlog not only remains Vodafone's product catalog but has also become the SaaS product with the highest number of licenses sold at Vodafone Portugal
                  in the year 2021, and it continues to grow.
                </p>

                <p>
                  Over the last 2 years, I was the product owner, responsible for defining the product's features and high-level architecture,
                  while also managing the development team consisting of an analyst, a designer, a tester, and developers.
                </p>


                <Divider orientation="left">Tech Stack experience:</Divider>
                <p>
                  <Text code>Java</Text>; <Text code>Spring Data</Text>; <Text code>Hibernate</Text>; <Text code>JEE, EJB, JMS, JSF</Text>; <Text code>ELK - ElasticSearch and Kibana</Text>;
                  <Text code>Jenkins</Text>; <Text code>Maven</Text>; <Text code>Thorntail</Text>;

                  <Text code>Nodejs</Text>; <Text code>Angular</Text>; <Text code>Ionic</Text>; <Text code>Sequelizejs</Text>; <Text code>Docker</Text>; <Text code>SQL</Text>;
                  <Text code>NOSQL</Text>;
                </p>


              </Card>
            </Col>
          </Row>
          <br></br>
        </div>
      ) : (<Spin />)
    }
  </>);
};


export default AboutPage;
