import { useRouter } from "next/router"
import axios from "axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import type { Task } from "@prisma/client"
import useEditedTaskStore from "@/store"
import { EditedTask } from "@/types"

const useMutateTask = () => {
    const queryClient = useQueryClient()
    const router = useRouter()
    const reset = useEditedTaskStore((state) => state.resetEditedTask)

    /**
     * useMutationを使って、タスクをサーバーに送信する
     */
    const createTaskMutation = useMutation(
        async (task: Omit<EditedTask, 'id'>) => {
            const res = await axios.post<Task>(
                `${process.env.NEXT_PUBLIC_API_URL}/todo`,
                task
            )
            return res.data
        },
        {
            onSuccess: (res) => {
                /**
                 * タスクの送信に成功したら、キャッシュを更新する
                 */
                const proviousTasks = queryClient.getQueryData<Task[]>(['tasks']) ?? []
                if (proviousTasks) {
                    queryClient.setQueryData(['tasks'], [res, ...proviousTasks])
                }
                reset()
            }, onError: (err: any) => {
                reset()
                if (err.response.status === 401 || err.response.status === 403) {
                    router.push('/')
                }
            }
        }
    )

    const updateTaskMutation = useMutation(
        async (task: EditedTask) => {
            const res = await axios.patch<Task>(
                `${process.env.NEXT_PUBLIC_API_URL}/todo/${task.id}`,
                task
            )
            return res.data
        },
        {
            onSuccess: (res, variables) => {
                const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) ?? []
                if (previousTasks) {
                    const newTasks = previousTasks.map((task) => {
                        if (task.id === res.id) {
                            return res
                        }
                        return task
                    })
                    queryClient.setQueryData(['tasks'], newTasks)
                }
                reset()
            },
            onError: (err: any,) => {
                reset()
                if (err.response.status === 401 || err.response.status === 403) {
                    router.push('/')
                }
            },
        }
    )

    const deleteTaskMutation = useMutation(async (id: number) => {
        await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/todo/${id}`)
    }, {
        onSuccess: (_, variables) => {
            const previousTasks = queryClient.getQueryData<Task[]>(['tasks']) ?? []
            if (previousTasks) {
                const newTasks = previousTasks.filter((task) => task.id !== variables)
                queryClient.setQueryData(['tasks'], newTasks)
            }
            reset()
        }, onError: (err: any) => {
            reset()
            if (err.response.status === 401 || err.response.status === 403) {
                router.push('/')
            }
        }
    })

    return { createTaskMutation, updateTaskMutation, deleteTaskMutation }
}

export default useMutateTask
