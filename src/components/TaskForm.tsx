import { FormEvent } from "react"
import { TextInput, Button, Center } from "@mantine/core"
import { IconDatabase } from "@tabler/icons-react"
import useEditedTaskStore from "@/store"
import useMutateTask from "@/hooks/useMutateTask"

const TaskForm = () => {
    const { editedTask } = useEditedTaskStore()
    const update = useEditedTaskStore((state) => state.updateEditedTask)
    const { updateTaskMutation, createTaskMutation } = useMutateTask()

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (editedTask.id === 0) {
            createTaskMutation.mutate({
                title: editedTask.title,
                description: editedTask.description
            })
        } else {
            updateTaskMutation.mutate({
                id: editedTask.id,
                title: editedTask.title,
                description: editedTask.description
            })
        }
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                <TextInput
                    mt="md"
                    placeholder="title"
                    value={editedTask.title || ""}
                    onChange={(e) => update({ ...editedTask, title: e.target.value })}
                />
                <TextInput
                    mt='md'
                    placeholder="description"
                    value={editedTask.description || ""}
                    onChange={(e) => update({ ...editedTask, description: e.target.value })}
                />
                <Center mt='lg'>
                    <Button
                        disabled={editedTask.title === "" || editedTask.description === ""}
                        leftSection={<IconDatabase size={14} />}
                        color="cyan"
                        type="submit"
                    >
                        {editedTask.id === 0 ? 'Create' : 'Update'}
                    </Button>
                </Center>
            </form>
        </>
    )
}

export default TaskForm
