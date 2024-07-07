import { useState, useEffect } from 'react'

import { debounceTime } from 'rxjs/operators'
import { Subject } from 'rxjs'

export function useDebounce<T>(time: number, initialValue: T) {

  const [value, setValue] = useState<any>(initialValue);
  const [values] = useState(() => new Subject());

  useEffect(() => {
    const sub = values.pipe(
      debounceTime(time)
    ).subscribe(setValue);
    return () => sub.unsubscribe();
  }, [time, values]);

  return [value, (v: T) => values.next(v)]
}

