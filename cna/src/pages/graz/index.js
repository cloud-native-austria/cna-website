import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Description from './description.mdx';
import Meeting from '@site/src/components/Meeting';
import {useLocation} from '@docusaurus/router';
import {usePluginData} from '@docusaurus/useGlobalData';
import MDXContent from '@theme/MDXContent';

export default function Chapter() {
    const {siteConfig} = useDocusaurusContext();
    const location = useLocation();
    const {locations} = usePluginData('location-overview-plugin');
    const currentPathSplit = location.pathname.split("/");
    const currentPath = currentPathSplit[currentPathSplit.length - 1];
    const currentLocation = locations.filter(x => x.location.toLowerCase() === currentPath.toLowerCase());
    let nextMeeting = Infinity;
    const currentDate = new Date();
    let nextMeetingString = "";

    if (currentLocation.length === 0) {
        return (
            <Layout
                title={`${siteConfig.title}`}
                description="Cloud Native Austria"
            >
                <main>
                    <div className="container">
                        <section className="row">
                            <div className="col col--9">
                                <MDXContent>
                                    <Description/>
                                </MDXContent>
                            </div>
                        </section>
                    </div>
                </main>
            </Layout>
        );
    }
    for (let i = 0; i < currentLocation[0].meetings.length; i++) {
        const actualMeetingDate = new Date(
            Number(currentLocation[0].meetings[i].substring(0, 4)),
            Number(currentLocation[0].meetings[i].substring(4, 6)) - 1,
            Number(currentLocation[0].meetings[i].substring(6, 8)),
            23, 59, 59
        );
        if (currentDate <= actualMeetingDate && actualMeetingDate < nextMeeting) {
            nextMeeting = actualMeetingDate;
            nextMeetingString = currentLocation[0].meetings[i];
        }
    }
    ;
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria"
        >
            <main>
                <div className="container">
                    <section className="row">
                        <div className="col col--9">
                            <MDXContent>
                                <Description/>
                            </MDXContent>
                        </div>
                        <div className="col col--3">
                            Meetups:
                            {currentLocation.flatMap(loc => loc.meetings.map((meeting, idx) => (
                                <Meeting key={idx} location={currentPath} date={meeting}
                                         isNext={meeting === nextMeetingString}/>
                            )))
                            }
                        </div>
                    </section>
                </div>
            </main>
        </Layout>
    );
}