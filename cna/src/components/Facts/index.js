import styles from './styles.module.css';
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

function Fact({logo, fact, description}) {
  return (
    <div className={styles.fact}>
      <div className={styles.factLogo}>
        <img className={styles.factSvg} src={useBaseUrl(logo)} />
      </div>
      <div className="text--center padding-horiz--md">
        <Heading as="h1">{fact}</Heading>
        <Heading as="h3">{description}</Heading>
      </div>
    </div>
  );
}

export default function Facts() {
  return (
    <div className="container">
      <div className={styles.base}>
        <Heading as="h2">Cloud Native Austria is growing fast</Heading>
        <div className={styles.facts}>
          <Fact logo='/img/logo.svg' fact='4' description='Chapter' />
          <Fact logo='/img/logo.svg' fact='1000+' description='Members'/>
          <Fact logo='/img/logo.svg' fact='100+' description='Meetups'/>
          <Fact logo='/img/logo.svg' fact='50+' description='avg. rsvps'/>
        </div>
      </div>
    </div>
  );
}
