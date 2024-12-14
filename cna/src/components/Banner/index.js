import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

export default function Banner() {
  return (
    <div className={styles.base}>
      <img className={styles.bannerImage} src={useBaseUrl('/img/banner.svg')} />
      <img className={styles.cnaLogo} src={useBaseUrl('/img/logo.svg')} />
      <h1 className={styles.bannerText}>Hallo! Servas! Griaß di!</h1>
    </div>
  );
}
