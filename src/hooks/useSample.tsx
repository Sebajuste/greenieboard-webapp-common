import { useState, useEffect } from 'react'

import { sampleTime } from 'rxjs/operators'
import { Subject } from 'rxjs'

export function useSample<T>(time: number, initialValue: T) {

  const [value, setValue] = useState<any>(initialValue);
  const [values] = useState(() => new Subject());

  useEffect(() => {
    const sub = values.pipe(
      sampleTime(time)
    ).subscribe(setValue);
    return () => sub.unsubscribe();
  }, [time, values]);

  return [value, (v: T) => values.next(v)]
}

