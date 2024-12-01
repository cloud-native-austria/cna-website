import styles from './styles.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';
import meetups from '@site/data/mdxFrontMatter.json';

function Slide({logo, headline, date, url}) {
    return (
        <div className={styles.slide}>
            <div className={styles.slideIcon}>
                <img className={styles.slideSVG} src={useBaseUrl(logo)} alt="logo"/>
            </div>
            <div className={styles.slideText}>
                <div>
                    <a href={url} target="_blank">
                        <Heading as="h2">{headline}</Heading>
                    </a>
                    {date}
                </div>
            </div>
        </div>
    );
}

export default function Carousel() {
    const settings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 500,
        slidesToShow: 3,
        centerMode: true,
        centerPadding: '60px',
        slidesToScroll: 1,
        waitForAnimate: false,
        adaptiveHeight: false,
    };

    return (
        <div className={styles.base}>
            <div className="container">
                <Slider {...settings}>
                    {meetups.map((meetup) => (
                        <Slide
                            logo={`/img/${meetup.chapter}.png`}
                            headline={meetup.frontMatter.title}
                            date={meetup.frontMatter.date}
                            url={`${meetup.chapter}/${meetup.frontMatter.id}`}/>
                    ))}
                </Slider>
            </div>
        </div>
    );
}
