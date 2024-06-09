import React, { useEffect, useRef } from 'react';
import {
    dogMeme,
    spiderManMeme,
    topContender
} from "../assets"


const MemeGenerator = ({ myName, comparerName, memeIndex }) => {
  const canvasRef = useRef(null);

  
  const memeArray = [
    {
      image: topContender,
      titlePosition: { x: 200, y: 50 },
      myNamePosition: { x: 300, y: 400 },
      comparerNamePosition: { x: 500, y: 300 },
      titleFontSize: 40,
      myNameFontSize: 30,
      comparerNameFontSize: 30
    },
    {
      image: dogMeme,
      titlePosition: { x: 200, y: 70 },
      myNamePosition: { x: 300, y: 450 },
      comparerNamePosition: { x: 500, y: 350 },
      titleFontSize: 40,
      myNameFontSize: 30,
      comparerNameFontSize: 30
    },
    {
      image: spiderManMeme,
      titlePosition: { x: 200, y: 70 },
      myNamePosition: { x: 300, y: 450 },
      comparerNamePosition: { x: 500, y: 350 },
      titleFontSize: 40,
      myNameFontSize: 30,
      comparerNameFontSize: 30
    }
    
  ];

  const meme = memeArray[memeIndex];

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = meme.image;

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      
      
      ctx.drawImage(img, 0, 0);

      // my credits
      ctx.font = `bold ${meme.titleFontSize}px Arial`;
      ctx.fillStyle = 'white';
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      ctx.textAlign = 'center';
      ctx.fillText('project by @isrark005', meme.titlePosition.x, meme.titlePosition.y);
      ctx.strokeText('project by @isrark005', meme.titlePosition.x, meme.titlePosition.y);

      // myName text
      ctx.font = `bold ${meme.myNameFontSize}px Arial`;
      ctx.fillText(myName, meme.myNamePosition.x, meme.myNamePosition.y);
      ctx.strokeText(myName, meme.myNamePosition.x, meme.myNamePosition.y);

      // comparerName text
      ctx.font = `bold ${meme.comparerNameFontSize}px Arial`;
      ctx.fillText(comparerName, meme.comparerNamePosition.x, meme.comparerNamePosition.y);
      ctx.strokeText(comparerName, meme.comparerNamePosition.x, meme.comparerNamePosition.y);
    };
  }, [myName, comparerName, meme]);

  return <canvas ref={canvasRef} />;
};

export default MemeGenerator;
