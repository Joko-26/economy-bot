// get a random integer betweem two passed
export function getRandomInt(min: number, max: number): number {
  const low = Math.ceil(min);
  const high = Math.floor(max);
  return Math.floor(Math.random() * (high - low + 1)) + low;
}

// split the time into a humanreadable string
export function timeSplitter(timeString: string) {
    const split_timeString = timeString.split(" ")
    const time = split_timeString[1].split(":")
    const date = split_timeString[0].split(".")
    const stringTime = `${date[0]}.${date[1]}.${date[2]} ${time[0]}:${time[1]}` 
    return stringTime
}

// formats the current time into a human readble format 
export function getFormattedDate(): string {
  const now = new Date();

  const day = now.getDate().toString().padStart(2, '0');
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const year = now.getFullYear().toString().slice(-2);
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');

  return `${day}.${month}.${year} ${hours}:${minutes}`;
}

// get the passed timestring as a Date object
export function getTimeasDate(timeString:string) {
    const match = timeString.match(/^(\d{2})\.(\d{2})\.(\d{2}) (\d{2}):(\d{2})$/);
    if (!match) return null;
    const [_, day, month, year, hour, minute] = match;
    const fullYear = parseInt(year) + 2000;

    return new Date(fullYear, parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute));
}

// gets the time until a passed date in the correct time format
export function getTimeUntil(targetStr: string): string {
    const targetDate = getTimeasDate(targetStr);
    if (!targetDate) return "invalid time format";
    
    const now = new Date();
    const diffMs = targetDate.getTime() - now.getTime();

    if (diffMs <= 0) return "past"; 

    const totalMinutes = Math.floor(diffMs / 60000);
    const days = Math.floor(totalMinutes / (24 * 60));
    const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
    const minutes = totalMinutes % 60;

    return `${days}d ${hours}h ${minutes}m`
}

export function isBeforeYesterday(storedDateStr: string): boolean {
    const storedDate = getTimeasDate(storedDateStr)
    if (!storedDate) {
        return true
    }

    const now = new Date();

    const yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1);

    console.log(`${storedDate}-${yesterday}`)
    console.log(storedDate < yesterday)

    return storedDate < yesterday
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array]; // Create a copy to avoid mutating the original array
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}