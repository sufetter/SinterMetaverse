import {AnimatePresence, motion} from "framer-motion";
import type {AppProps} from "next/app";
import {useRouter} from "next/router";

import "../styles/globals.css";

function MyApp({Component, pageProps}: AppProps) {
  const router = useRouter();
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={router.route}
        initial={{
          opacity: 0.9,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          y: "100%",
        }}
        animate={{
          opacity: 1,
          clipPath: "polygon(0 0, 100% 0, 100% 100%, 0% 100%)",
          y: "0%",
        }}
        exit={{clipPath: "polygon(50% 0, 50% 0, 50% 100%, 50% 100%)"}}
        transition={{
          duration: 1,
        }}
      >
        <Component {...pageProps} />
      </motion.div>
    </AnimatePresence>
  );
}

export default MyApp;
