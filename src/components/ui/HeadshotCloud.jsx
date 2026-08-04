import pfp from '../../assets/pfp-nobg.webp';
import './HeadshotCloud.css';

// Headshot for the cloud hero. The terminal chrome and hard border of
// HeadshotSlot read as a bright panel pasted over the sky; here the cut-out
// portrait sits directly on the clouds and dissolves into them at the bottom,
// with just enough shadow to lift it off the background.
export default function HeadshotCloud({ className = '' }) {
  // No caption: it landed in the portrait's fade and collided with the info
  // rows below, and the status it carried is already on the badge in the copy.
  return (
    <figure className={`hs-cloud ${className}`}>
      <div className="hs-cloud__frame">
        <img src={pfp} alt="Abdulla Alasmawi" className="hs-cloud__img" />
      </div>
    </figure>
  );
}
