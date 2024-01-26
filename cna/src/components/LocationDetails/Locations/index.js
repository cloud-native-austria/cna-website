import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

function meeting({Svg, location}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.locationSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{location}</Heading>
      </div>
    </div>
  );
}

export default function LocationDetails(location: string) {
  // Get Mettings...
  //
  return (
    <section className={styles.locations}>
      <div className="container">
        // Location Description
        //<markdown>
        // Meetings
        <div className="row">
          {LocationList.map((props, idx) => (
            <Location key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
