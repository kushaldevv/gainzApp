import React, { createContext, useState, useContext, ReactNode, useRef } from 'react';
import * as Types from '@/types';


export const ExercisesContext = createContext<Types.ExercisesContextType>({
    exercises: [],
    setExercises: () => {},
    startDate: new Date(0),
    setStartDate: () => {},
    endDate: new Date(0),
    setEndDate: () => {},
    location: "",
    setLocation: () => {},
    workoutName: "",
    setWorkoutName: () => {},
  });

export const ExercisesProvider: React.FC<{children: ReactNode}> = ({ children }) => {
    const [exercises, setExercises] = useState<Types.Exercise[]>([]);
    const [startDate, setStartDate] = useState(new Date(new Date().getTime() - 60 * 60 * 1000));
    const [endDate, setEndDate] = useState(new Date());
    const [workoutName, setWorkoutName] = useState("");
    const [location, setLocation] = useState("");
  
  return (
    <ExercisesContext.Provider
      value={{
        exercises,
        setExercises,
        startDate,
        setStartDate,
        endDate,
        setEndDate,
        location,
        setLocation,
        workoutName,
        setWorkoutName,
      }}
    >
      {children}
    </ExercisesContext.Provider>
  );
};

export const useExercises = () => {
  const context = useContext(ExercisesContext);
  if (context === undefined) {
    throw new Error('useTimer must be used within a TimerProvider');
  }
  return context;
};