import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';
import {usePluginData} from '@docusaurus/useGlobalData';

const LocationList = [
  {
    location: 'Graz',
    Svg: require('@site/static/img/undraw_docusaurus_mountain.svg').default,
  },
  {
    location: 'Wien',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
  },
  {
    location: 'Salzburg',
    Svg: require('@site/static/img/undraw_docusaurus_tree.svg').default,
  },
  {
    location: 'Linz',
    Svg: require('@site/static/img/undraw_docusaurus_react.svg').default,
  },
];

function Location({Svg, location}) {
  const {testData} = usePluginData('location-overview-plugin');
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.locationSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{location}</Heading>
        <p>{testData}</p>
      </div>
    </div>
  );
}

export default function Locations() {
  return (
    <section className={styles.locations}>
      <div className="container">
        <div className="row">
          {LocationList.map((props, idx) => (
            <Location key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
