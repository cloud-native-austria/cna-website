import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

export default function Banner() {
  return (
    <div className={styles.base}>
      <img className={styles.bannerImage} src={useBaseUrl('/img/banner.svg')} />
      <img className={styles.bannerImageMobile} src={useBaseUrl('/img/banner-mobile.svg')} />
      <img className={styles.cnaLogo} src={useBaseUrl('/img/logo.svg')} />
      <h1 className={styles.bannerText}><p>Hallo! Servas! Griaß di!</p></h1>
    </div>
  );
}
