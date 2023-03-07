import { createContext } from "react";

export const UserContext = createContext({ user: null, username: null, pomoSeconds: 3000, setPomoSeconds: null, breakSeconds: 600, setBreakSeconds: null });
export const TimerContext = createContext({ seconds: null, minutes: null, hours: null, days: null, isRunning: null, inPomoSession: null, start: null, pause: null, resume: null, restart: null,})