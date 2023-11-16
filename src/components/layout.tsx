import {FC, ReactNode} from 'react'
import Head from 'next/head'
import { type } from 'os'

type Props = {
    children?: ReactNode
    title?: string
}

const Layout: FC<Props> = ({title = 'next.js', children}) => {
  return (
    <div className='flex min-h-screen flax-col items-center justify-center'>
      <Head>
        <title>{title}</title>
      </Head>
      <main className='flex w-screen flex-1 flex-col items-center justify-center'>
        {children}
      </main>
      
    </div>
  )
}

export default Layout
