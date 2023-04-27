import Head from "next/head"
import { useContext } from "react"
import { TimerContext } from "@/lib/context"

export default function Layout() {

    const { seconds, minutes, hours, inPomoSession, duration } = useContext(TimerContext);

    return (
        <>
        <Head>
            <link rel="icon" href="/images/favicon.ico" />
            <title>{duration ? `${hours ? hours + ':' : ''}${hours && minutes < 10 ? 0 : ''}${minutes}:${seconds < 10 ? 0 : ''}${seconds} - ${inPomoSession ? 'pomodoro' : 'break'}` : 'Boulder - Pomodoro Timer'}</title>
        </Head>
        </>
    )
}