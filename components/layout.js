import Head from "next/head"
import { useContext } from "react"
import { TimerContext } from "@/lib/context"

export default function Layout() {

    const { seconds, minutes, hours, inPomoSession, isRunning } = useContext(TimerContext);

    return (
        <>
        <Head>
            <link rel="icon" href="/images/favicon.ico" />
            <title>{hours ? `${hours}:`  : null}{hours && minutes < 10 ? 0 : null}{minutes}:{seconds < 10 ? 0 : null}{seconds} - {inPomoSession ? 'pomodoro' : 'break'}</title>
        </Head>
        </>
    )
}