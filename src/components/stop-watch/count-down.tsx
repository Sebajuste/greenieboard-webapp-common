import { useEffect, useState } from "react";

export function CountDown({ active = true, countDown, onProgress, onStopped }: { active: boolean, countDown: number, onProgress?: (time: number) => void, onStopped?: () => void }) {

  const [time, setTime] = useState(0);

  useEffect(() => {

    let intervalID: any = null;

    if (active) {
      console.log('start count down')
      intervalID = setInterval(() => {
        setTime(oldTime => {

          const newValue = oldTime + 10;
          if (onProgress) onProgress(newValue);

          if (newValue >= countDown) {
            clearInterval(intervalID);
            if (onStopped) onStopped();
          }

          return newValue;
        });

      }, 10);

    } else {
      setTime(0);
      clearInterval(intervalID);
    }

    return () => {
      clearInterval(intervalID);
    };

  }, [active])

  return (
    <>{time}  </>
  );

}