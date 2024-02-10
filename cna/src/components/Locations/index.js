import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import {usePluginData} from '@docusaurus/useGlobalData';

function Location({logo, location, start, meetings}) {
  let nextMeetingString = 'TBD'; 
  if (meetings.length > 0) {
    let nextMeeting = Infinity;
    const currentDate = new Date();
    console.log(meetings);
    for(let i = 0; i < meetings.length; i++) {
      const actualMeetingDate = new Date(
          Number(meetings[i].substring(0, 4)),
          Number(meetings[i].substring(4, 6)),
          Number(meetings[i].substring(6, 8))
      );
      if(currentDate < actualMeetingDate && actualMeetingDate < nextMeeting) {
        nextMeeting = actualMeetingDate;
        nextMeetingString = actualMeetingDate.toDateString();
      }
    };
  }
  return (
    <div className={clsx('col col--4')}>
      <a href={location}>
        <div className="text--center">
          <img className={styles.locationSvg} src={useBaseUrl(logo)} />
        </div>
        <div className="text--center padding-horiz--md">
          <Heading as="h2">{location}</Heading>
          <p>Next Meetup:</p>
          {nextMeetingString}
        </div>
      </a>
    </div>
  );
}

export default function Locations() {
  const {locations} = usePluginData('location-overview-plugin');
  return (
    <section className={styles.locations}>
      <div className="container">
        <div className={styles.locationtable}>
          <table> 
            <tr>
              {locations.map((props, idx) => (
                <td>
                  <Location key={idx} {...props} />
                </td>
              ))}
            </tr>
          </table>
        </div>
      </div>
    </section>
  );
}
