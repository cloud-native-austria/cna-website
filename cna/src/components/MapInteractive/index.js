import React from "react"
import {ComposableMap, Geographies, Geography, Marker} from "react-simple-maps"

const geoUrl =
    "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson"

const markers = [
    {
        markerOffset: -20,
        name: "Graz",
        coordinates: [15.4333, 47.0667],
        link: "/graz",
        icon: "/img/graz.svg"
    },
    {
        markerOffset: 25,
        name: "Innsbruck",
        coordinates: [11.3933, 47.2683],
        link: "/innsbruck",
        icon: "/img/cncg.svg"
    }, {
        markerOffset: -15,
        name: "Wien",
        coordinates: [16.3731, 48.2083],
        link: "/vienna",
        icon: "/img/vienna.png"
    }, {
        markerOffset: -18,
        name: "*Linz",
        coordinates: [14.2833, 48.3000],
        link: "linz",
        icon: "/img/cncg.svg"
    },

];

export default function MapChart() {
    return (
        <ComposableMap
            width={700}
            height={250} // Set the desired height
            projection="geoAzimuthalEqualArea"
            // https://d3js.org/d3-geo/projection#projection_center
            projectionConfig={{
                center: [13.7525, 47.5783],
                scale: 4000
            }}
        >
            <Geographies geography={geoUrl}>
                {({geographies}) =>
                    geographies.map((geo) => {
                        const isTargetCountry = geo.properties.ISO_A3 === "AUT"; // Example: France
                        return (<Geography
                                key={geo.rsmKey}
                                geography={geo}
                                fill={isTargetCountry ? "#F27501" : "#D6D6DA"}
                                stroke="#02233E"/>
                        )
                    })
                }
            </Geographies>
            {markers.map(({name, coordinates, markerOffset, icon, link}) => (
                <Marker key={name} coordinates={coordinates}>
                    <image
                        href={icon}
                        x={-15} // Center the image horizontally
                        y={-15} // Center the image vertically
                        width={30} // Set image width
                        height={30} // Set image height
                    />
                    <a
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{textDecoration: "none", fontSize: "12px", fontWeight: "bold", fill: "#000"}}
                    >
                        <text
                            textAnchor="middle"
                            y={markerOffset}
                            style={{fontFamily: "system-ui", fill: "#5D5A6D"}}
                        >
                            {name}
                        </text>
                    </a>
                </Marker>
            ))}
        </ComposableMap>
    )
}
