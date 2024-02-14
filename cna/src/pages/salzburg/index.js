import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Description from './description.md';
import styles from './index.module.css';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import { Link } from 'react-router-dom';

function Meeting({location, date}) {
    const path = `/${location}/${date}`;
    return (
        <Link to={path}>
          <div className="text--center">
            {date}
          </div>
        </Link>
    );
}

export default function Chapter() {
    const {siteConfig} = useDocusaurusContext();
    const location = useLocation();
    console.log(location);
    const {locations} = usePluginData('location-overview-plugin');
    const currentPathSplit = location.pathname.split("/");
    console.log(currentPathSplit);
    const currentPath = currentPathSplit[currentPathSplit.length-1];
    console.log(currentPath);
    console.log(locations);
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria"
        >
            <section className={styles.chapter}>
                <div>
                    <Description />
                </div>
                <div>
                    {locations.filter(x => x.location.toLowerCase() === currentPath.toLowerCase())
                      .flatMap(loc => loc.meetings.map((meeting) => (
                        <Meeting location={currentPath} date={meeting} />
                      )))
                    }
                </div>
            </section>
        </Layout>
    );
  }