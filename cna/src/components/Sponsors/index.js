import React from "react";
import styles from './styles.module.css';

const CardGrid = () => {
    // Sample data for the cards
    const cardData = [
        {
            image: "/img/exoscale.png",
            text: "Exoscale",
            link: "https://www.exoscale.com/",
        },
    ];

    return (
        <div>
            <h1>Thanks to our sponsors ❤️</h1>
            <div className={styles.gridContainer}>
                {cardData.map((card, index) => (
                    <div className={styles.gridItem} key={index}>
                        <img src={card.image} alt={card.text}/>
                        <a href={card.link} target="_blank" rel="noopener noreferrer">
                            {card.text}
                        </a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CardGrid;
