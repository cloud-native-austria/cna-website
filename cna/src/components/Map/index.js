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
          <img className={styles.mapImage} src={useBaseUrl('/img/map.svg')} />
          <Pin logo='/img/vienna.png' name='Vienna' page='vienna' left='86.2%' top='34%' />
          <Pin logo='/img/graz.svg' name='Graz' page='graz' left='76.4%' top='74%' />
          <Pin logo='/img/cncg.svg' name='Linz' page='linz' left='62.5%' top='32.5%' />
          <Pin logo='/img/cncg.svg' name='Innsbruck' page='innsbruck' left='20%' top='67%' />
        </div>
      </div>
    </div>
  );
}
