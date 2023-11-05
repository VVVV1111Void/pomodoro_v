export const format_time = (secconds: number) => {
    // Split input seconds into hours, minutes and seconds
    const rem = Math.abs(secconds); //remove sign to reduce complications with negative operations
    const hours = Math.floor(rem / 3600);
    const minutes = Math.floor((rem - hours * 3600) / 60);
    const seconds = rem - hours * 3600 - minutes * 60;
  
    // Append 0 if digit is < 10, e.g 9 -> 09
    const h = hours < 10 ? `0${hours}` : `${hours}`;
    const m = minutes < 10 ? `0${minutes}` : `${minutes}`;
    const s = seconds < 10 ? `0${seconds}` : `${seconds}`;
  
    return seconds >= 0 ? `${h}:${m}:${s}` : `-${h}:${m}:${s}`;
}


// Object representation of pomodoro sessions
export interface session_set {
    pomodoros: number;
    work_max_minutes: number;
    rest_min_minutes: number;
  }


// Turns the interval into an array for use with the timer component.
export const convert_session_to_array = (session: session_set) => {
    const arr_length = session.pomodoros * 2;
    const arr: number[] = new Array(arr_length);
    for (let index = 0; index < arr_length; index = index + 2) {
      arr[index] = session.work_max_minutes;
      arr[index + 1] = session.rest_min_minutes;
    }
    return arr;
  };