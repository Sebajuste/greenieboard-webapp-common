import { createContext, ReactNode, useContext, useEffect, useState } from "react";

export const TitleContext = createContext({
  title: '',
  setTitle: (newTitle: string) => { console.warn('invalid title setter') }
});

export default function TitleContextProvider({ children }: { children: ReactNode }) {

  const [title, setTitle] = useState('');

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );

}

export function useTitle(newTitle: string) {
  const { title, setTitle } = useContext(TitleContext);

  useEffect(() => setTitle(newTitle), [newTitle, setTitle]);

  return title;
}