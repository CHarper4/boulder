import "../styles/globals.css";

import Navbar from '@/components/navbar';
import { UserContext } from "@/lib/context";
import { useUserData } from "@/lib/hooks";


export default function App({ Component, pageProps }) {

  const userData = useUserData();

  return (
    <UserContext.Provider value={userData}>
      <Navbar />
      <Component {...pageProps} />
    </UserContext.Provider>
  )
}
