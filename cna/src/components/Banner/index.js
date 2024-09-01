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

export default function Banner() {
  return (
    <div className={styles.base}>
      <img className={styles.bannerImage} src={useBaseUrl('/img/banner.svg')} />
      <img className={styles.cnaLogo} src={useBaseUrl('/img/logo.svg')} />
      <h1 className={styles.bannerText}><p>Hallo! Servas!</p><p>Griaß di!</p></h1>
    </div>
  );
}
