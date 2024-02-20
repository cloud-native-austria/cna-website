import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';
import { Link } from 'react-router-dom';

function Location({logo, location, meetings}) {
  let nextMeetingString = 'TBD';
  let nextMeetingPath = location;
  if (meetings.length > 0) {
    let nextMeeting = Infinity;
    const currentDate = new Date();
    for(let i = 0; i < meetings.length; i++) {
      const actualMeetingDate = new Date(
          Number(meetings[i].substring(0, 4)),
          Number(meetings[i].substring(4, 6))-1,
          Number(meetings[i].substring(6, 8)),
          23,59,59
      );
      if(currentDate <= actualMeetingDate && actualMeetingDate < nextMeeting) {
        nextMeeting = actualMeetingDate;
        nextMeetingPath = meetings[i];
        nextMeetingString = actualMeetingDate.toDateString();
      }
    };
  }
  if (nextMeetingPath !== location) {
    nextMeetingPath = location + "/" + nextMeetingPath;
  } 
  return (
    <div className={clsx('col col--12')}>
      <div className={styles.location}>
        <Link to={location}>
          <div className={styles.locationHeader}>
            <img className={styles.locationSvg} src={useBaseUrl(logo)} />
            <div className="text--center padding-horiz--md">
              <Heading as="h1">{location}</Heading>
            </div>
          </div>
        </Link>
        <div className="text--center padding-horiz--md">
          Next Meetup:<br />
          <Link className="margin-bottom--lg padding--md button button--primary" to={nextMeetingPath}>{nextMeetingString}</Link>
        </div>
      </div>
    </div>
  );
}

export default function Locations() {
  const {locations} = usePluginData('location-overview-plugin');
  return (
    <section className={styles.locations}>
      <div className="container">
        <div className="row">
          {locations.map((props, idx) => (
              <Location key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
