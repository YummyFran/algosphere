import Turtle from '../assets/turtle.svg'
import Walker from '../assets/walker.svg'
import Sprinter from '../assets/sprinter.svg'
import Master from '../assets/master.svg'
import KeepGoing from '../assets/Keep Going.jpg'
import React from 'react'
import axios from 'axios'
import html5 from '../assets/html5.svg'
import nodejs from '../assets/nodejs.svg'

export function timeAgo(postedTime) {
    if(!postedTime) return

    const now = new Date();
    const postedDate = postedTime.toDate();
    
    const seconds = Math.floor((now - postedDate) / 1000);
    
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (seconds < 60) {
      return seconds < 5 ? 'a moment ago' : `a few seconds ago`;
    } else if (minutes < 60) {
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (hours < 24) {
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if(days < 7) {
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
        return postedDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        })
    }
}

export function formatNumber(num) {
    if (num >= 1_000_000_000) {
        return (Math.floor(num / 100_000_000) / 10) + 'B';
    } else if (num >= 1_000_000) {
        const formatted = Math.floor(num / 100_000) / 10;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'M' : formatted + 'M'; 
    } else if (num >= 1_000) {
        const formatted = Math.floor(num / 100) / 10;
        return formatted % 1 === 0 ? formatted.toFixed(0) + 'K' : formatted + 'K'; 
    } else {
        return num.toString();
    }
}

export function getFileType(url) {
  const fileExtension = url.split('?')[0].split('.').pop();
  
  switch (fileExtension.toLowerCase()) {
    case 'mp4':
      return 'Video';
    case 'jpg':
    case 'jpeg':
      return 'Image';
    case 'png':
      return 'Image';
    case 'gif':
      return 'Image';
    case 'webp':
      return 'Image';
    case 'mp3':
      return 'Audio';
    case 'pdf':
      return 'Document';
    default:
      return 'Unknown file type';
  }
}

const colors = [
  "#FF6B6B", "#FF8C42", "#FFC75F", "#F9ED69", "#8FD3F4",
  "#4D96FF", "#845EC2", "#D65DB1", "#F3A683", "#81B214",
  "#00C9A7", "#6A0572", "#2C698D", "#FFCCF9", "#40514E", "#1B262C"
]

export function getRandomGradientPair() {
  const color1 = colors[Math.floor(Math.random() * colors.length)];
  let color2;
  do {
    color2 = colors[Math.floor(Math.random() * colors.length)];
  } while (color1 === color2); // Ensure different colors

  return `linear-gradient(135deg, ${color1}, ${color2})`;
}

export const skillColor = {
  "Typing": "#FFB74D",
  "Algorithms": "#42A5F5",
  "Data Structures": "#64B5F6",
  "CSS": "#FF7043",
  "Design Principles": "#AB47BC",
  "General Programming": "#4DB6AC",
  "Problem Solving": "#7E57C2",
  "SQL": "#8D6E63",
  "Database Management": "#6D4C41",
  "React": "#61DAFB",
  "JavaScript": "#FDD835",
  "Frontend Development": "#4FC3F7",
  "Python": "#FFD54F",
  "Scripting": "#81C784",
  "Debugging": "#EF5350",
  "HTML": "#FF8A65",
  "Accessibility": "#66BB6A",
  "SEO": "#DCE775",
  "Advanced CSS": "#FF5252",
  "Animations": "#FFCA28"
}

export const validateUsername = username => {
  if (username.length < 3) {
      return [false, "Username must contain atleast 3 characters"];
  }
  
  if (username.length > 15) {
      return [false, "Username must not exceed 15 characters"];
  }
  const validUsernamePattern = /^[A-Za-z0-9_]+$/;

  if (!validUsernamePattern.test(username)) {
      return [false, "Invalid username"];
  }

  if (/^[0-9]/.test(username)) {
      return [false, "Username must not start with a number"];
  }

  return [true, ""];
}

export const generateResultData = (wpm, accuracy, totalCharsTyped, correctCharsCount, mistypedCharsCount) => {
  const format = {
      slow: {
          illustration: Turtle,
          title: "You're a Turtle",
          description: `Well... You type with the speed of ${wpm} WPM. Your accuracy was ${accuracy}%. It could be better! Practice regularly to pick up the pace and surprise yourself with progress.`,
          wpm_range: [0, 20],
          accuracy_range: [0, 100]
      },
      moderate: {
          illustration: Walker,
          title: "Casual Walker",
          description: `You type at ${wpm} WPM, comfortably walking along. Your accuracy of ${accuracy}% shows potential! Just keep at it and you'll be sprinting in no time.`,
          wpm_range: [21, 40],
          accuracy_range: [90, 100]
      },
      fast: {
          illustration: Sprinter,
          title: "Sprinter",
          description: `At ${wpm} WPM, you're sprinting ahead! With an accuracy of ${accuracy}%, you're nearly unstoppable. Push for the next milestone to reach elite speed!`,
          wpm_range: [41, 60],
          accuracy_range: [95, 100]
      },
      master: {
          illustration: Master,
          title: "Typing Master",
          description: `Incredible! You type at a blazing ${wpm} WPM with ${accuracy}% accuracy. You're a keyboard ninja. Keep up the amazing work!`,
          wpm_range: [61, 100],
          accuracy_range: [98, 100]
      }
  }

  for (let category in format) {
      const { wpm_range, accuracy_range, title, description, illustration } = format[category]
      if (wpm >= wpm_range[0] && wpm <= wpm_range[1] && accuracy >= accuracy_range[0] && accuracy <= accuracy_range[1]) {
          return {title, description, totalCharsTyped, correctCharsCount, mistypedCharsCount, wpm, accuracy, illustration}
      }
  }

  return {
      title: "Keep Going!",
      description: `Your speed was ${wpm} WPM with an accuracy of ${accuracy}%. You're on the right track! Keep practicing to improve further.`,
      totalCharsTyped,
      correctCharsCount,
      mistypedCharsCount,
      wpm,
      accuracy,
      illustration: KeepGoing
  }
}

export const formatSeconds = seconds => {
  const minutes = Math.floor(seconds / 60)
  const sec = seconds % 60
  
  return `${minutes}:${sec.toString().padStart(2, '0')}`
}

export const generateRandomNumber = (start, end) => {
  return Math.floor(Math.random() * (end - start + 1)) + start
}

export const getRankDetails = (rank) => {
  switch (rank) {
    case 8:
      return {name: "Initiate", color: "#8C9394"}
    case 7:
      return {name: "Apprentice", color: "#5E9EA8"}
    case 6:
      return {name: "Journeyman", color: "#4BA84B"}
    case 5:
      return {name: "Adept", color: "#B89A3F"}
    case 4:
      return {name: "Expert", color: "#E5763B"}
    case 3:
      return {name: "Master", color: "#7C417C"}
    case 2:
      return {name: "Grandmaster", color: "#493F91"}
    case 1:
      return {name: "Legend", color: "#A23030"}
    default:
      return {name: "Unknown", color: "#2c2c2c"}
  }
}


export function formatCodeStringToJSX(input, theme = 'light') {
  if (!input) return;

  const parts = input.split(/(```[\s\S]+?```|`[^`]+`|\n?### [^\n]+(\n|$))/g).filter(Boolean)

  return parts.map((part, index) => {
    if(typeof part !== 'string') return null;

    if (part.startsWith('```') && part.endsWith('```')) {
      const content = part.slice(3, -3).trim();
      return (
        <pre key={index} className={`multi-code primary-${theme}-bg`}>
          {content}
        </pre>
      );
    }

    if (part.startsWith('`') && part.endsWith('`')) {
      const content = part.slice(1, -1);
      return (
        <span className="code" key={index}>
          {content}
        </span>
      );
    }

    if (part.trim().startsWith('### ')) {
      const content = part.trim().replace(/^### /, '');
      return (
        <h3 key={index} className={`title primary-${theme}-color`}>
          {content}
        </h3>
      );
    }

    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

export const assert = `const assert = {
  results: [],
  strictEqual: (actual, expected, message = "") => {
      if (actual !== expected) {
        assert.results.push({
          message,
          status: "failed",
          response: "Expected " + actual + " to equal " + expected
        })

        return
      }

      assert.results.push({
        message,
        status: "passed",
        response: "Test Passed"
      })
  }
}`

export const generateIframeCode = (userCode) => {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <style>
    html, body {
      overflow: hidden;
      height: 100%;
    }
    body {
      width: 400px;
      height: 300px;
      transform-origin: top left;
    }
  </style>
</head>
<body>
    ${userCode}
  <script>
    function resize() {
      const iframeWidth = window.innerWidth;
      const iframeHeight = window.innerHeight;

      const scaleX = iframeWidth / 400;
      const scaleY = iframeHeight / 300;

      document.body.style.transform = \`scale(\${scaleX}, \${scaleY})\`;
    }
    window.addEventListener('resize', resize);
    resize(); // Initial call
  </script>
</body>
</html>
`
}

export const generateWebIframCode = (code) => {
  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <style>
      ${code.css || ''}
    </style>
  </head>
  <body>
      ${code.html || ''}
    <script>
      try {
        ${code.js || ''}
      } catch (error) {
        parent.postMessage({
          type: 'iframe-error',
          message: error.message,
          source: 'User JavaScript',
          lineno: error.lineNumber || null,
          colno: error.columnNumber || null,
          err: error
        }, '*');
      }
    </script>
  </body>
  </html>
  `
}

export function compareImages(img1, img2) {
  return new Promise((resolve, reject) => {
    // Create two images
    const image1 = new Image();
    const image2 = new Image();

    image1.src = img1;
    image2.src = img2;

    let imagesLoaded = 0;
    
    // Wait for both images to load
    const onLoad = () => {
      imagesLoaded++;
      if (imagesLoaded < 2) return;

      // Create two canvases
      const canvas1 = document.createElement('canvas');
      const canvas2 = document.createElement('canvas');
      const ctx1 = canvas1.getContext('2d');
      const ctx2 = canvas2.getContext('2d');

      // Set canvas dimensions
      canvas1.width = 400;
      canvas1.height = 300;
      canvas2.width = 400;
      canvas2.height = 300;

      // Draw the images onto canvases
      ctx1.drawImage(image1, 0, 0, 400, 300);
      ctx2.drawImage(image2, 0, 0, 400, 300);

      // Get pixel data
      const data1 = ctx1.getImageData(0, 0, 400, 300).data;
      const data2 = ctx2.getImageData(0, 0, 400, 300).data;

      let diffPixels = 0;

      // Compare each pixel
      for (let i = 0; i < data1.length; i += 4) {
        const rDiff = Math.abs(data1[i] - data2[i]);
        const gDiff = Math.abs(data1[i + 1] - data2[i + 1]);
        const bDiff = Math.abs(data1[i + 2] - data2[i + 2]);
        
        if (rDiff > 10 || gDiff > 10 || bDiff > 10) {
          diffPixels++;
        }
      }

      const totalPixels = data1.length / 4;
      const accuracy = ((totalPixels - diffPixels) / totalPixels);

      resolve(accuracy); 
    };

    // Handle errors
    image1.onerror = image2.onerror = () => reject('Error loading images.');

    image1.onload = onLoad;
    image2.onload = onLoad;
  });
}

const API = axios.create({
  baseURL: "https://emkc.org/api/v2/piston"
})

export const executeCode = async (language, code) => {
  const response = await API.post("/execute", {
    "language": language,
    "version": '18.15.0',
    "files": [
      {
        "content": code
      }
    ]
  })

  return response.data
}

export const languagesOptions = [
  {
    name: "Web",
    tech: "HTML/CSS/JS",
    icon: html5
  },
  // {
  //   name: "JavaScript",
  //   tech: "Node.js",
  //   icon: nodejs
  // },
]

export const iconMap = {
  "Web": html5,
  "JavaScript": nodejs
}