import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import * as Types from '@/types';


const TimerContext = createContext<Types.TimerContextType | undefined>(undefined);

export const TimerProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  
  return (
    <TimerContext.Provider value={{ time, setTime, isRunning, setIsRunning }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};