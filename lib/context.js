import { createContext } from "react";

export const UserContext = createContext({ user: null, username: null, pomoSeconds: 3000, setPomoSeconds: null, breakSeconds: 600, setBreakSeconds: null });
export const TimerContext = createContext({ seconds: null, minutes: null, hours: null, days: null, duration: null, isRunning: null, inProgress: null, inPomoSession: null, setInProgress: null, setDuration: null, start: null, pause: null, resume: null, restart: null, refreshTimer: null })