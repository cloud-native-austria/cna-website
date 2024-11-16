import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Description from './description.md';
import Meeting from '@site/src/components/Meeting';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';

export default function Chapter() {
    const {siteConfig} = useDocusaurusContext();
    const location = useLocation();
    const {locations} = usePluginData('location-overview-plugin');
    const currentPathSplit = location.pathname.split("/");
    const currentPath = currentPathSplit[currentPathSplit.length-1];
    const currentLocation = locations.filter(x => x.location.toLowerCase() === currentPath.toLowerCase());
    let nextMeeting = Infinity;
    const currentDate = new Date();
    let nextMeetingString = "";

      return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria"
        >
          <main>
            <div className="container">
              <section className="row">
                <div className="col col--9">
                    <Description />
                </div>
              </section>
            </div>
          </main>
        </Layout>
      );
  }
