import React, { useEffect, useRef } from 'react';
import {
  dogMeme,
  spiderManMeme,
  topContender
} from "../assets";

const MemeGenerator = ({ winnerName, loserName, memeIndex }) => {
  const canvasRef = useRef(null);

  const memeArray = [
    {
      image: topContender,
      titlePosition: { x: 200, y: 50 },
      winnerNamePosition: { x: 300, y: 400 },
      loserNamePosition: { x: 500, y: 300 },
      titleFontSize: 40,
      nameFontSize: 30
    },
    {
      image: dogMeme,
      titlePosition: { x: 200, y: 70 },
      winnerNamePosition: { x: 300, y: 450 },
      loserNamePosition: { x: 500, y: 350 },
      titleFontSize: 40,
      nameFontSize: 30
    },
    {
      image: spiderManMeme,
      titlePosition: { x: 200, y: 70 },
      winnerNamePosition: { x: 300, y: 450 },
      loserNamePosition: { x: 500, y: 350 },
      titleFontSize: 40,
      nameFontSize: 30
    }
  ];

  const meme = memeArray[memeIndex];

  useEffect(() => {
    if (!winnerName || !loserName) return; // Prevent drawing until winner and loser names are determined

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = meme.image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      // Draw title
      ctx.font = `bold ${meme.titleFontSize}px Arial`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.fillText('project by @isrark005', meme.titlePosition.x, meme.titlePosition.y);
      ctx.strokeText('project by @isrark005', meme.titlePosition.x, meme.titlePosition.y);

      // Draw winner name
      ctx.font = `bold ${meme.nameFontSize}px Arial`;
      ctx.fillText(winnerName, meme.winnerNamePosition.x, meme.winnerNamePosition.y);
      ctx.strokeText(winnerName, meme.winnerNamePosition.x, meme.winnerNamePosition.y);

      // Draw loser name
      ctx.fillText(loserName, meme.loserNamePosition.x, meme.loserNamePosition.y);
      ctx.strokeText(loserName, meme.loserNamePosition.x, meme.loserNamePosition.y);
    };
  }, [winnerName, loserName, meme]);

  return <canvas ref={canvasRef} className='w-[316px] h-[370px]' />;
};

export default MemeGenerator;
