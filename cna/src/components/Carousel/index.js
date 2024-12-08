import styles from './styles.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import useBaseUrl from '@docusaurus/useBaseUrl';
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
                        <h2>{headline}</h2>
                    </a>
                    <p>{date}</p>
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
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 800,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            },
        ],
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
