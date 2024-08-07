export function formatSessionDate(isoString: string) {
    const sessionDate = new Date(isoString);
    const now = new Date();
    const isToday = now.toDateString() === sessionDate.toDateString();
    const isYesterday =
      new Date(now.setDate(now.getDate() - 1)).toDateString() ===
      sessionDate.toDateString();
  
    const timeString = sessionDate.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  
    if (isToday) {
      return `Today at ${timeString}`;
    } else if (isYesterday) {
      return `Yesterday at ${timeString}`;
    } else {
      return (
        sessionDate.toLocaleDateString([], {
          year: "numeric",
          month: "long",
          day: "numeric",
        }) + ` at ${timeString}`
      );
    }
  }
  export const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  export const daysFull = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];


  export function formatSessionTime(seconds: number, short?: boolean) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    let result = "";
    if (hours > 0) result += `${hours}hr `;
    if (minutes > 0) result += `${minutes}m `;

    if(!short)
      result += `${remainingSeconds}s`;
  
    return result.trim();
  }
  
  export const getPastSevenDays = () => {
    const result = [];
    const today = new Date();
  
    for (let i = 1; i <= 7; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dayIndex = date.getDay();
      result.push(days[dayIndex]);
    }
  
    return result;
  };

  export function formatSimpleDate(isoString: string): string {
    const likeDate = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - likeDate.getTime()) / 1000);
  
    if (diffInSeconds < 60) {
      return `${diffInSeconds}s`;
    }
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m`;
    }
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `${diffInHours}h`;
    }
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return `${diffInDays}d`;
    }
    const diffInWeeks = Math.floor(diffInDays / 7);
    return `${diffInWeeks}w`;
  }