import NextNProgress from "nextjs-progressbar";
import "../styles/globals.css";
import "tailwindcss/tailwind.css";
import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { ThemeProvider } from "next-themes";
import Head from "next/head"; 

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-3GZLEL6D5Z"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-3GZLEL6D5Z');
            `,
          }}
        />
      </Head>

      <ThemeProvider enableSystem={false} attribute="class">
        <ChakraProvider>
          <Layout>
            <NextNProgress
              color={"#FF7A19"}
              startPosition={0.3}
              stopDelayMs={200}
              height={3}
              showOnShallow={true}
              options={{ showSpinner: false }}
            />
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </ThemeProvider>
    </>
  );
}

export default MyApp;
