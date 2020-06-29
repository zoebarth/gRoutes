import React from 'react';
import styles from './Attraction.module.css';

/**
 * Attraction contains the image of the attraction.
 * imageUrl contains source of image.
 */
function Attraction({imageUrl}) {
  return (
    <img className={styles['attraction']} src={imageUrl}/>
  );
}

export default Attraction;
