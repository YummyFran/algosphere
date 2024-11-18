import Turtle from '../assets/turtle.svg'
import Walker from '../assets/walker.svg'
import Sprinter from '../assets/sprinter.svg'
import Master from '../assets/master.svg'
import KeepGoing from '../assets/Keep Going.svg'

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