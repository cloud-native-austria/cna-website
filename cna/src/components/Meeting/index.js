import styles from './styles.module.css';
import { Link } from 'react-router-dom';

export default function Meeting({location, date, isNext}) {
  const path = `${location}/${date}`;
  const formatedDate = new Date(
    Number(date.substring(0, 4)),
    Number(date.substring(4, 6))-1,
    Number(date.substring(6, 8)),
  ).toDateString();
  const buttonBackgroundStyle = (isNext ? "margin-left--none" : "margin-left--lg") 
    + " button"
    + (isNext ? " button--primary" : " button--secondary");
  return (
      <div className={styles.meetinglink}>
        <Link class={buttonBackgroundStyle} to={path}>
             {formatedDate}
        </Link>
      </div>
  );
}
