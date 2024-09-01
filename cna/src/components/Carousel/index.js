
import styles from './styles.module.css';
import "../../../node_modules/slick-carousel/slick/slick.css";
import "../../../node_modules/slick-carousel/slick/slick-theme.css";
import React from "react";
import Slider from "react-slick";
import useBaseUrl from '@docusaurus/useBaseUrl';
import Heading from '@theme/Heading';

function Slide({logo, headline, text, url}) {
  return (
    <a className={styles.slide} href={url} target="_blank">
      <div className={styles.slideIcon}>
        <img className={styles.slideSVG} src={useBaseUrl(logo)} />
      </div>
      <div className={styles.slideText}>
        <div>
          <Heading as="h1">{headline}</Heading>
          {text}
        </div>
      </div>
    </a>
  );
}

export default function Carousel() {
  var settings = {
    dots: true,
    fade: true,
    infinite: true,
    autoplay: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    waitForAnimate: false
  };
  return (
    <div className={styles.base}>
      <div className="container">
        <Slider {...settings}>
          <Slide
              logo='/img/kcd.webp'
              headline='KCD Austria 2024'
              text='On October 8th - 10th the Kubernetes & Cloud Native community will gather in Vienna, Austria. Join us for a three-day technical event loaded with exciting talks, workshops and networking opportunities. KCD Austria is aimed at developers, platform people, and other IT professionals interested in cloud native technologies. This community event is supported by the CNCF.'
              url='https://kcdaustria.at'
          />
          <Slide
              logo='/img/graz.svg'
              headline='September Meetup Graz'
              text='Come join us at the September meetup of the CNCF Graz community!'
              url='graz' />
        </Slider>
      </div>
    </div>
  );
}
