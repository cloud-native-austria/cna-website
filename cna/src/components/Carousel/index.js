import styles from './styles.module.css';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

function Slide({logo, headline, text, url}) {
    return (
        <div className={styles.slide}>
            <div className={styles.slideIcon}>
                <img className={styles.slideSVG} src={useBaseUrl(logo)}/>
            </div>
            <div className={styles.slideText}>
                <div>
                    <a href={url} target="_blank">
                        <Heading as="h2">{headline}</Heading>
                    </a>
                    {text}
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
                    <Slide
                        logo='/img/graz.svg'
                        headline='November Meetup Graz'
                        text='Come join us at the November meetup of the CNCF Graz community!'
                        url='graz/20241120'/>
                    <Slide
                        logo='/img/graz.svg'
                        headline='Dezember Meetup Graz'
                        text='DEZEMBER!'
                        url='graz/20241120'/>
                    <Slide
                        logo='/img/graz.svg'
                        headline='Jänner Meetup Graz'
                        text='JÄNNER'
                        url='graz/20241120'/>
                    <Slide
                        logo='/img/graz.svg'
                        headline='Februar Meetup Graz'
                        text='Februar!'
                        url='graz/20241120'/>
                    <Slide
                        logo='/img/graz.svg'
                        headline='November Meetup Graz'
                        text='Come join us at the November meetup of the CNCF Graz community!'
                        url='graz/20241120'/>
                    <Slide
                        logo='/img/graz.svg'
                        headline='November Meetup Graz'
                        text='Come join us at the November meetup of the CNCF Graz community!'
                        url='graz/20241120'/>
                </Slider>
            </div>
        </div>
    );
}
