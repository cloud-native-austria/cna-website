import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

function Pin({logo, name, page, left, top}) {
  return (
    <a className={styles.pin} style={{left: left, top: top}} href={page}>
      <div className={styles.pinIcon}>
        <img className={styles.pinSVG} src={useBaseUrl(logo)} />
      </div>
      <Heading as="h1">{name}</Heading>
    </a>
  );
}

export default function Map() {
  return (
    <div className={styles.base}>
      <div className="container">
        <div className={styles.mapContainer}>
          <img src={useBaseUrl('/img/map.svg')} />
          <Pin logo='/img/logo.svg' name='Vienna' page='graz' left='85.5%' top='38%' />
          <Pin logo='/img/graz.svg' name='Graz' page='graz' left='74%' top='76%' />
          <Pin logo='/img/logo.svg' name='Salzburg' page='graz' left='45%' top='49%' />
          <Pin logo='/img/logo.svg' name='Linz' page='graz' left='64%' top='33%' />
        </div>
      </div>
    </div>
  );
}
