import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Description from './description.md';
import styles from './index.module.css';
import {usePluginData} from '@docusaurus/useGlobalData';



export default function Chapter() {
    const {siteConfig} = useDocusaurusContext();
    const {locations} = usePluginData('location-overview-plugin');
    return (
        <Layout
            title={`${siteConfig.title}`}
            description="Cloud Native Austria"
        >
            <main className={styles.chapter}>
                <div>
                    <Description />
                </div>
            </main>
        </Layout>
    );
  }