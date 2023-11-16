import create from 'zustand'
import { EditedTask } from '@/types'

type State = {
    editedTask: EditedTask
    updateEditedTask: (payload: EditedTask) => void
    resetEditedTask: () => void
}

const useEditedTaskStore = create<State>((set) => ({
    editedTask: { id: 0, title: "", description: "" },
    updateEditedTask: (payload) => set({
        editedTask: {
            ...payload
        }
    }),
    resetEditedTask: () => set({
        editedTask: { id: 0, title: "", description: "" }
    })
}))

export default useEditedTaskStore