import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Locations from '@site/src/components/Locations';
import Carousel from '@site/src/components/Carousel';
import Map from '@site/src/components/Map';
import MapInteractive from '@site/src/components/MapInteractive';
import Banner from '@site/src/components/Banner';
import MDXContent from '@theme/MDXContent';

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria">
                <main>
                    <Banner/>
                    <MapInteractive />
                    <Carousel/>
                </main>
        </Layout>
    );
}
