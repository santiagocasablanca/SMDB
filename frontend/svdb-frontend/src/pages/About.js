import { CrownOutlined, GithubOutlined, LinkedinOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Card, Col, Divider, Row, Space, Spin, Typography } from 'antd';
import insertCss from 'insert-css';
import React, { useEffect, useState } from 'react';
import { AppLogo } from '../components';
import variables from '../sass/antd.module.scss';



const { Title, Text, Paragraph, Link } = Typography;

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
  .aboutContainer p {
    color: white;
  }

  
  .subTitle {
    color: black !important; 
    margin-bottom: 0px !important; 
    text-wrap: wrap !important;
  }

  .projectContainer {
    overflow: auto;
  }

  @media (max-width: 600px) {
    .subTitle {
      color: black !important; 
      margin-bottom: 0px !important; 
      text-wrap: wrap !important;
      font-size: 20px !important;
    }

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
      {/* <Card style={{ width: '90%', backgroundColor: 'white' }} bodyStyle={{ padding: '2px' }}> */}
      <Space><AppLogo /> <Title level={2} className="subTitle" ellipsis={{
        tooltip: 'Sidemen Video Database',
      }}>Sidemen Video Database</Title></Space>
      {/* </Card> */}
    </Row>
  );

  const aboutMeTitle = (
    <Row justify="center">
      {/* <Card style={{ width: '90%', backgroundColor: 'white' }} bodyStyle={{ padding: '2px' }}> */}
      <Space>
        <Title level={2} className="subTitle" ellipsis={{
          tooltip: 'About me',
        }}>ABOUT ME</Title></Space>
      {/* </Card> */}
    </Row>
  );

  return (<>
    <HeaderPanel title="About"></HeaderPanel>
    {isLoaded ?
      (
        <div className="aboutContainer">
          <Row gutter={[8, 10]}>
            <Col md={24} lg={24} xl={12}>
              <Card title={aboutMeTitle} headStyle={{ padding: '10px', background: 'white' }} bodyStyle={{ maxHeight: 550, overflow: 'auto' }}>
                <Divider orientation="left">Background</Divider>

                <p>Faculty of Engineering of University of Porto 2013</p>
                <p>MSc Degree in Computing Engineering</p>

                <p>10+ years of experience in full-stack development, working on a diverse range of web applications, including <Text code>Asset Management Solution</Text>, <Text code>HR and Attendance Management Solution</Text>,
                <Text code>Utilities Custom Care and Billing Solution</Text>, and various consulting projects.</p>
                <Space>
                  <Link href="mailto:tiagomartinslomba@gmail.com"><MailOutlined /> Contact me</Link>
                  <Divider />

                  <Link href="https://www.linkedin.com/in/tiago-martins-lomba/"><LinkedinOutlined /> Linkedin</Link>
                  {/* <Divider />
                  <Link href="https://github.com/santiagocasablanca/SMDB"><GithubOutlined /> Visit the Project Github</Link> */}
                </Space>

                <Divider orientation="left">Last experience [2018-2023]</Divider>

                <Paragraph
                  ellipsis={
                    {
                      rows: 4,
                      expandable: true,
                      symbol: 'more',
                    }
                  }>
                  Yo! is a modular multi-vendor and multi-tenant product mainly focused on employee and attendance management.
                  It started as an internal project with me as the architect and backend developer, alongside a senior frontend developer.
                  We adopted a microservice-based modular architecture using a MEAN stack, which proved to be valuable due to its fast development and successful deployment.
                  Coincidentally, during that time, Vodafone Portugal was in search of a product with similar features for their product catalog, leading to the birth of Vodafone Teamlog.
                  Currently, Yo! is being sold by Wondercom, while Teamlog not only remains on Vodafone's product catalog but has also become the SaaS product with the highest number of licenses sold at Vodafone Portugal
                  in the year 2021, and it continues to grow.
                </Paragraph>

                <p>
                  Over the last 2 years, I was the product owner, responsible for defining the product's features and high-level architecture,
                  while also managing the development team consisting of an analyst, a designer, a tester, and developers.
                </p>


                <Divider orientation="left">Tech Stack experience</Divider>
                <p>
                  <Text code>Java</Text>; <Text code>Spring Data</Text>; <Text code>Hibernate</Text>; <Text code>JEE, EJB, JMS, JSF</Text>; <Text code>ELK - ElasticSearch and Kibana</Text>;
                  <Text code>Jenkins</Text>; <Text code>Maven</Text>; <Text code>Thorntail</Text>;

                  <Text code>Nodejs</Text>; <Text code>Angular</Text>; <Text code>Ionic</Text>; <Text code>Sequelizejs</Text>; <Text code>Docker</Text>; <Text code>SQL</Text>;
                  <Text code>NOSQL</Text>;
                </p>


              </Card>
            </Col>

            <Col md={24} lg={24} xl={12}>
              <Card title={svdbProjectTitle} headStyle={{ padding: '10px', background: 'white' }} bodyStyle={{ maxHeight: 550, overflow: 'auto' }}>

                <Text style={{ float: 'right' }} type="secondary">[July 2023 - still going]</Text>
                <Divider orientation="left">STILL UNDER CONSTRUCTION</Divider>
                <div className="projectContainer">


                  <p>This is a proof of concept for a YouTube IMDb similar web application, focusing on Sidemen and other YouTubers that often collaborate within the scene as Creators. </p>

                  <p>The application utilizes a traditional SQL model to store <Text code>Channel</Text> and <Text code>Video</Text> data fetched from YouTube using the <Text code>YouTube API</Text>.
            It introduces the concept/tables of <Text code>Creator</Text> and <Text code>Channel_Creator</Text> to represent multiple <Text code>Channels</Text> owned by one <Text code>Creator</Text> and <Text code>Channels</Text> owned by multiple <Text code>Creators</Text> simultaneously.</p>

                  <p>The tables <Text code>Channel_Stats</Text> and <Text code>Video_Stats</Text> are used to keep track of the evolution of <Text code>channel</Text> and <Text code>video</Text> statistics over time.</p>

                  <p>The application also introduces the concepts of <Text code>directed_by</Text>, used to represent the main creator(s) responsible for a given <Text code>video</Text>, and <Text code>cast</Text> (creator_id, role) used for storing the creators that appear in each video.</p>


                  <p>In order to optimize the data-fetching process from YouTube, a new container named <Text code>jobs</Text> was introduced. This container is responsible for executing the fetching process and refreshing 
                    a materialized view named <Text code>video_stats_view</Text>. The materialized view represents a precomputed and stored version of video statistics, ensuring efficient querying and reduced load on the YouTube API.</p>
                  <p>In addition, a <Text code>Redis Sub/Pub</Text> system was implemented for communication between the <Text code>backend (API)</Text> and the <Text code>jobs</Text> container. 
                  This allows the backend to send messages to jobs for executing tasks remotely. This communication system enhances the application's scalability and flexibility in handling background jobs without direct dependencies, leading to improved overall performance.</p>


                  <p>Moreover, improvements have been made to the fetch algorithm within the <Text code>YoutubeService</Text>. These enhancements aim to optimize the fetching process while adhering to the YouTube API rate limits.
                  The changes made to the YoutubeService play a crucial role in ensuring that the application efficiently acquires and updates data, delivering an improved user experience
                   and timely insights into the evolving statistics of the YouTube content creators.</p>


                  <Divider orientation="left">Technologies Used</Divider>
                  <p><Text code>Node.js</Text>,  <Text code>Express.js</Text>,  <Text code>Docker</Text>,  <Text code>Sequelize</Text>,  <Text code>PostgreSQL</Text>,  <Text code>React</Text>,  <Text code>antd</Text>
                  </p>
                  <Link href="https://github.com/santiagocasablanca/SMDB"><GithubOutlined /> Visit the Project Github</Link>
                  <br></br>
                  <br></br>
                  <Divider orientation="left">Deployment and current DB size</Divider>

                  <Paragraph ellipsis={
                    {
                      rows: 2,
                      expandable: true,
                      symbol: 'more',
                    }
                  }>
                    The deployment process for the project utilizes GitHub Actions for continuous integration and deployment (CI/CD).
                    Triggered by pushes to the main branch, the workflow automates backend and frontend image building and tagging through Docker Hub authentication using GitHub secrets.
                    These Dockerized images are subsequently pushed to Docker Hub, ensuring a streamlined process that swiftly delivers updates.
                  </Paragraph>
                  <Text>Hosted at <Link href="https://contabo.com/">Contabo</Link> (Cloud VPS S => 4 vCPU Cores | 8 GB RAM)</Text>
                  <br></br>
                  <Text>Database Statistics:</Text>
                  <ul>
                    <li>56 Creators</li>
                    <li>92 Channels</li>
                    <li>Over 80000 Videos</li>
                  </ul>
                  <br></br>
                  <Text>Special thanks to <Avatar src="https://avatars.githubusercontent.com/u/8502778?v=4" /> <Link href="https://github.com/danilomagalhaes">Danilo Magalhães</Link> for the help on the configuration of the infrastructure!</Text>
                  {/* <br></br> */}
                  <Divider orientation="left">Project Inspirations</Divider>
                  <ul>
                    <li><a href="https://mattw.io/youtube-metadata/">https://mattw.io/youtube-metadata/</a></li>
                    <li><a href="https://codevoweb.com/wp-content/uploads/2023/01/Build-a-CRUD-API-with-Node.js-and-Sequelize.webp">https://codevoweb.com/wp-content/uploads/2023/01/Build-a-CRUD-API-with-Node.js-and-Sequelize.webp</a></li>
                  </ul>
                </div>
              </Card>
            </Col>
          </Row>
          <br></br>
        </div>
      ) : (
        <Row justify="center" style={{ marginTop: '70px' }}>
          <div style={{ borderRadius: '50%', overflow: 'hidden' }} >
            <Spin spining="true" tip="Loading..." size="large" style={{ background: '#F3F4F6' }}>
              <div className="spinContent" style={{ padding: '100px' }} />
            </Spin>
          </div>
        </Row>
      )
    }
  </>);
};


export default AboutPage;
