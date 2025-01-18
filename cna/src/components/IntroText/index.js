import React from "react";
import styles from './styles.module.css';

const CardGrid = () => {
    return (
        <div className={styles.container}>
            <h1>Welcome @ Cloud Native Austria!</h1>

            <p className={styles.centeredParagraph}>
                Cloud Native Austria is a vibrant community and hub for cloud-native enthusiasts, professionals, and
                organizations based in Austria.
                It focuses on promoting and fostering knowledge, collaboration, and innovation in cloud-native
                technologies, methodologies, and best practices.
                As part of the global cloud-native movement, Cloud Native Austria brings together developers,
                architects, DevOps practitioners, and IT decision-makers who are passionate about leveraging tools like
                Kubernetes, Docker, microservices, serverless computing, and modern CI/CD pipelines to build scalable,
                resilient, and efficient applications.
            </p>

            <p className={styles.cfp}>
                Have know-how to share or an idea to present? We have the event!
                <a href="https://sessionize.com/cloud-native-austria-meetups" className={styles.cfpButton}
                   target="_blank">
                    submit your session here
                </a>
            </p>

            <p className={styles.centeredParagraph}>
                The community serves as a platform for sharing expertise through meetups, workshops, webinars, and
                conferences, often featuring industry leaders and experts.
                Whether you're a seasoned cloud-native expert or just starting your journey, Cloud Native Austria
                provides opportunities to network, learn, and stay updated with the latest trends and advancements in
                the cloud-native ecosystem.
                By cultivating an inclusive and innovative environment, the group contributes to the growth of
                cloud-native adoption across Austrian industries, empowering organizations to drive digital
                transformation and stay competitive in the fast-evolving tech landscape.
            </p>
        </div>
    );
};

export default CardGrid;
