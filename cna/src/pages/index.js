import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Locations from '@site/src/components/Locations';
import Carousel from '@site/src/components/Carousel';
import Map from '@site/src/components/Map';
import Welcome from '@site/src/components/Welcome';

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Cloud Native Austria">
      <main>
          <Welcome />
          <Carousel />
          <Map />
      </main>
    </Layout>
  );
}
