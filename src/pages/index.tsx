import type { NextPage } from 'next'
import { useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import * as yap from 'yup'
import { ShieldCheckIcon } from '@heroicons/react/solid'
import { ExclamationCircleIcon } from '@heroicons/react/outline'
import { IconDatabase } from '@tabler/icons-react'
import { Anchor, TextInput, Button, Group, PasswordInput, Alert } from '@mantine/core'
import { useForm, yupResolver } from '@mantine/form'
import Layout from '@/components/layout'
import { AuthForm } from '@/types'

/**
 * yupを使用してバリデーション用のスキーマを作成
 */
const schema = yap.object().shape({
  email: yap.string().email('Invalid email').required('No email provided'),
  password: yap.string().min(5, 'Password should be min 5 chars').required('No password provided'),
})

const Home: NextPage = () => {
  const router = useRouter()
  const [isResister, setIsResister] = useState(false)
  const [error, setError] = useState('')

  /**
   * manitneのuseFormを使用してフォームの状態を管理
   */
  const form = useForm<AuthForm>({
    validate: yupResolver(schema),
    initialValues: {
      email: '',
      password: '',
    },
  })

  const handleSubmit = async () => {
    try {
      if (isResister) {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
          /**
           * dtoとしてnest.jsに渡す
           */
          email: form.values.email,
          password: form.values.password,
        })
      }
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        email: form.values.email,
        password: form.values.password,
      })
      /**
       * ログイン、新規登録後にformをリセットしてダッシュボードに遷移
       */
      form.reset()
      router.push('/dashboard')
    } catch (error: any) {
      /**
       * エラーが発生した場合の処理
       */
      setError(error.response.data.message)
    }
  }

  return (
    <Layout>
      <ShieldCheckIcon className='h-16 w-16 text-blue-500' />
      {error && (
        <Alert
          my="md"
          variant="filled"
          icon={<ExclamationCircleIcon />}
          title="Authorization Error"
          color='red'
          radius="md"
        >
          {error}
        </Alert>
      )}

      <form onSubmit={form.onSubmit(handleSubmit)}>
        <TextInput
          mt='md'
          id="email"
          label="Email*"
          placeholder='example@gmail.com'
          {...form.getInputProps('email')}
        />
        <PasswordInput
          mt="md"
          id="password"
          label="Password*"
          description="must be min 5 chars"
          {...form.getInputProps('password')}
        />

        <Group
          mt="xl"
          justify='apart'
        >
          <Anchor
            component='button'
            type='button'
            size='xs'
            className='text-gray-500'
            onClick={() => {
              setIsResister(!isResister)
              setError('')
            }}
          >
            {isResister
              ? 'Have an account ? Login'
              : "Don't have an account ? Register"}
          </Anchor>
          <Button
            leftSection={<IconDatabase size={14} />}
            color='cyan'
            type='submit'
          >
            {isResister ? 'Register' : 'Login'}
          </Button>

        </Group>
      </form>
    </Layout>
  )
}

export default Home
