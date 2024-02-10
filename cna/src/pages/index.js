import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Locations from '@site/src/components/Locations';


export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Cloud Native Austria">
      <main>
        <Locations />
      </main>
    </Layout>
  );
}
