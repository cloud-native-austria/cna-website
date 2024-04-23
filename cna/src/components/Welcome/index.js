import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

export default function Carousel() {
  return (
    <div className="container">
      <div className={styles.base}>
        <div className={styles.headers}>
          <div>
            <Heading as="h3">Hallo! Servas!</Heading>
            <Heading as="h3">Griaß di!</Heading>
          </div>
          <div>
            <Heading as="h2">Welcome to</Heading>
            <Heading as="h1">Cloud Native Austria</Heading>
          </div>
        </div>
        <div className={styles.logo}>
          <img className={styles.logoSvg} src={useBaseUrl('/img/logo.svg')} />
        </div>
      </div>
    </div>
  );
}
