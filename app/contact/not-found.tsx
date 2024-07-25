'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import homeStyles from '../Home.module.css';

export default function NotFoundPage() {
  const memes = [
    'https://i.imgflip.com/1bij.jpg',
    'https://i.imgflip.com/4/1otk96.jpg',
    'https://i.imgflip.com/1ur9b0.jpg',
    'https://i.imgflip.com/2zy40e.jpg',
  ];

  const [randomMeme, setRandomMeme] = useState<string>('');

  useEffect(() => {
    // Choose a random meme
    const meme = memes[Math.floor(Math.random() * memes.length)];
    setRandomMeme(meme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Excluding 'memes' from dependencies

  return (
    <div className={homeStyles.container}>
      <div className={homeStyles.header}>
        <h1>Oops! Seite nicht gefunden (404)</h1>
        <p>Es sieht so aus, als ob Sie auf einen nicht vorhandenen Pfad gestoßen sind. Aber keine Sorge, hier ist ein lustiges Meme, um Ihren Tag zu erhellen!</p>
      </div>
      {randomMeme && (
        <div className={homeStyles.memeContainer}>
          <Image 
            src={randomMeme} 
            alt="Funny 404 Meme" 
            layout="responsive"
            width={600}
            height={400}
            className={homeStyles.meme}
          />
        </div>
      )}
      <div className={homeStyles.footer}>
        <p>Gehen Sie zurück zur <a href="/">Startseite</a> und versuchen Sie es erneut.</p>
      </div>
    </div>
  );
}