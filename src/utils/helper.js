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