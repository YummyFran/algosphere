export function timeAgo(postedTime) {
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