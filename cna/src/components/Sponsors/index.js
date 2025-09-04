import React from "react";
import styles from './styles.module.css';

const CardGrid = () => {
    // Sample data for the cards
    const cardData = [
        {
            image: "/img/exoscale.png",
            text: "Exoscale",
            link: "https://www.exoscale.com/",
        }, {
            image: "/img/Dynatrace.png",
            text: "Dynatrace",
            link: "https://www.dynatrace.com/",
        }, {
            image: "/img/Whizus.png",
            text: "WhizUs",
            link: "https://www.whizus.com/",
        },
    ];

    return (
        <div>
            <h1 className={styles.sponsorHeading}>Thanks to our sponsors ❤️</h1>
            <div className={styles.gridContainer}>
                {cardData.map((card, index) => (
                    <div className={styles.gridItem} key={index}>
                        <a href={card.link} target="_blank" rel="noopener noreferrer">
                            <img src={card.image} alt={card.text}/>
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardGrid;
