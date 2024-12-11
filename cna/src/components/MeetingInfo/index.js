import styles from './styles.module.css';

export default function MeetingInfo({frontMatter}) {
    // contentTitle is mdx file title -> eg. '20241125'
    return (
        <div className={styles.meetinglink}>
            <h1>{frontMatter.title}</h1>

            <ul>
                <li>🗓️ {frontMatter.date}</li>
                <li>🕠 {frontMatter.timeStart} - {frontMatter.timeEnd}</li>
                <li>📍 {frontMatter.location}; {frontMatter.locationAddress}</li>
                <li>🗺️ <a href={frontMatter.locationGmapsUrl} target="_blank">Google Maps</a> | <a href={frontMatter.locationOpenStreetUrl} target="_blank">Open Streetmap</a></li>
                <li>🤝 please RSVP:</li>
                <ul>
                    <li><a href={frontMatter.urlBevy} target="_blank">CNCF</a></li>
                    <li><a href={frontMatter.urlMeetup} target="_blank">Meetup</a></li>
                </ul>
            </ul>

            <p>The local community of {frontMatter.community} welcomes you to this meetup 🚀</p>
        </div>
    );
}
