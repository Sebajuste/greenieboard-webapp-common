import { createContext } from "react";

export function createService<T>(service: T) {

  const ServiceContext = createContext<T>(service)

  return {
    Context: ServiceContext,
    Provider: function ({ children }: { children: any }) {

      return (
        <ServiceContext.Provider value={service}>{children}</ServiceContext.Provider>
      );
    }

  }

}