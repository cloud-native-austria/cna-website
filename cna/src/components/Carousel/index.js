import React from "react";
import Slider from "react-slick";
import useBaseUrl from '@docusaurus/useBaseUrl';
import meetups from '@site/data/mdxFrontMatter.json';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import styles from './styles.module.css';

function formatDate(iso) {
    if (!iso) return '';
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(undefined, {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
    });
}

function Card({logo, headline, date, location, timeStart, timeEnd, url, chapter}) {
    return (
        <a className={styles.card} href={url} target="_blank" rel="noopener noreferrer">
            <div className={styles.cardHeader}>
                <img className={styles.cardLogo} src={useBaseUrl(logo)} alt={`${chapter} logo`}/>
                <span className={styles.cardChapter}>{chapter}</span>
            </div>
            <h3 className={styles.cardTitle}>{headline}</h3>
            <div className={styles.cardMeta}>
                <div className={styles.cardDate}>
                    <span className={styles.icon} aria-hidden="true">📅</span>
                    <span>{formatDate(date)}</span>
                </div>
                {(timeStart || timeEnd) && (
                    <div className={styles.cardTime}>
                        <span className={styles.icon} aria-hidden="true">🕒</span>
                        <span>{timeStart}{timeEnd ? ` – ${timeEnd}` : ''}</span>
                    </div>
                )}
                {location && (
                    <div className={styles.cardLocation}>
                        <span className={styles.icon} aria-hidden="true">📍</span>
                        <span>{location}</span>
                    </div>
                )}
            </div>
        </a>
    );
}

export default function Carousel() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const upcoming = meetups
        .filter((m) => {
            const d = new Date(m.frontMatter.date);
            return !Number.isNaN(d.getTime()) && d >= today;
        })
        .sort((a, b) => new Date(a.frontMatter.date) - new Date(b.frontMatter.date));

    if (upcoming.length === 0) return null;

    const count = upcoming.length;
    const cap = (n) => Math.min(n, count);

    const settings = {
        dots: count > 1,
        arrows: count > 1,
        infinite: count > 5,
        autoplay: count > 1,
        autoplaySpeed: 6000,
        speed: 600,
        slidesToShow: cap(4),
        slidesToScroll: 1,
        responsive: [
            {breakpoint: 1600, settings: {slidesToShow: cap(4), slidesToScroll: 1, infinite: count > 5}},
            {breakpoint: 1280, settings: {slidesToShow: cap(3), slidesToScroll: 1, infinite: count > 3}},
            {breakpoint: 960, settings: {slidesToShow: cap(2), slidesToScroll: 1, infinite: count > 2}},
            {breakpoint: 640, settings: {slidesToShow: 1, slidesToScroll: 1, infinite: count > 1}},
        ],
    };

    return (
        <section className={styles.base}>
            <div className="container">
                <h2 className={styles.heading}>Upcoming Meetups</h2>
                <div className={styles.sliderWrap}>
                    <Slider {...settings}>
                        {upcoming.map((meetup) => (
                            <div key={`${meetup.chapter}-${meetup.frontMatter.id}`} className={styles.slide}>
                                <Card
                                    logo={`/img/${meetup.chapter}.png`}
                                    headline={meetup.frontMatter.title}
                                    date={meetup.frontMatter.date}
                                    timeStart={meetup.frontMatter.timeStart}
                                    timeEnd={meetup.frontMatter.timeEnd}
                                    location={meetup.frontMatter.location}
                                    chapter={meetup.chapter}
                                    url={`${meetup.chapter}/${meetup.frontMatter.id}`}
                                />
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </section>
    );
}
