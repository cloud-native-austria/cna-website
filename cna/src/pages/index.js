import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Carousel from '@site/src/components/Carousel';
import MapInteractive from '@site/src/components/MapInteractive';
import Banner from '@site/src/components/Banner';
import Sponsors from "@site/src/components/Sponsors";
import IntroText from "../components/IntroText";

export default function Home() {
    const {siteConfig} = useDocusaurusContext();
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria">
                <main>
                    <Banner/>
                    <IntroText />
                    <MapInteractive />
                    <Carousel/>
                    <Sponsors/>
                </main>
        </Layout>
    );
}
