<<<<<<< Updated upstream
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import '../styles/globals.css'
import '@mantine/core/styles.css';
import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { MantineProvider, createTheme } from '@mantine/core';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import axios from 'axios';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
    }
  }
});

const theme = createTheme({
  /** Put your mantine theme override here */
  fontFamily: 'Verdana, sans-serif',
});

export default function App({ Component, pageProps }: AppProps) {

  /** 
    * フロントとサーバーの間でcookieを共有するための設定
    */
  axios.defaults.withCredentials = true;

  /**
   * コンポーネントがマウントされた時に実行される処理
   * CSRFトークンを取得して、axiosのデフォルトヘッダーに設定する
   */
  useEffect(() => {
    const getCsrfToken = async () => {
      const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/auth/csrf`);
      axios.defaults.headers.common['csrf-token'] = data.csrfToken;
    }

    getCsrfToken();
  }
    , []);

  return (
    // Provide the client to your App
    <QueryClientProvider client={queryClient}>
      <MantineProvider theme={theme} defaultColorScheme='dark'>
        <Component {...pageProps} />
      </MantineProvider>

      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
=======
import '@/styles/globals.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}
>>>>>>> Stashed changes
