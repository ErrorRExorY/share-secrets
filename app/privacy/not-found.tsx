// app/not-found.tsx
'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import homeStyles from '../Home.module.css';

export default function NotFoundPage() {
  const memes = [
    '/images/1.jpg',
    '/images/2.jpg',
    '/images/3.jpg',
    '/images/4.webp',
    '/images/5.png',
    '/images/6.jpg',
    '/images/7.jpeg',
  ];

  const [randomMeme, setRandomMeme] = useState<string>('');

  useEffect(() => {
    // Choose a random meme
    const meme = memes[Math.floor(Math.random() * memes.length)];
    setRandomMeme(meme);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            className={homeStyles.meme} 
            width={500} // Set appropriate width and height
            height={500} // Adjust based on your image size
          />
        </div>
      )}
      <div className={homeStyles.footer}>
        <p>Gehen Sie zurück zur <a href="/">Startseite</a> und versuchen Sie es erneut.</p>
      </div>
    </div>
  );
}