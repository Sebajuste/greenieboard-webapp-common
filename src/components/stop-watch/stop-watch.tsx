import { useEffect, useState } from "react";
import { Timer } from "./timer";

export function StopWatch({ active = false, onStopped }: { active?: boolean, onStopped?: (time: number) => void }) {

  const [time, setTime] = useState(0);

  useEffect(() => {

    let interval: any = null;

    if (active) {
      interval = setInterval(() => {
        setTime((time) => time + 10);
      }, 10);
    } else {
      console.log('end timer: ', time);
      if (time > 0 && onStopped) onStopped(time);
      clearInterval(interval);
    }
    return () => {
      console.log('end timer destructor', time);
      // if (interval && onStopped) onStopped(time);
      clearInterval(interval);
    };

  }, [active]);

  return (
    <Timer time={time} />
  );

}
