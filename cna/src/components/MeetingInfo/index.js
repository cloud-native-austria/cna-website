import styles from './styles.module.css';
import {Meetups} from "@site/meetups.js";

export default function MeetingInfo({frontMatter}) {
    // contentTitle is mdx file title -> eg. '20241125'
    return (
        <div className={styles.meetinglink}>
            <h1>{frontMatter.id}</h1>
            <p>{frontMatter.timeStart}</p>
            <p>{frontMatter.timeEnd}</p>
        </div>
    );
}
