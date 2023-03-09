//sagas
import {call, put, takeEvery} from "redux-saga/effects";
import {setAppStatusAC} from "../../app/app-reducer";
import {AxiosResponse} from "axios";
import {GetTasksResponse, ResponseType, todolistsAPI} from "../../api/todolists-api";
import {addTaskAC, removeTaskAC, setTasksAC} from "./tasks-reducer";
import {handleServerAppErrorSaga, handleServerNetworkErrorSaga} from "../../utils/error-utils";

export function* fetchTasksWorkerSaga(action: ReturnType<typeof fetchTasksSaga>) {
    yield put(setAppStatusAC('loading'))
    const data: GetTasksResponse = yield call(todolistsAPI.getTasks, action.todolistId)
    const tasks = data.items
    yield put(setTasksAC(tasks, action.todolistId))
    yield put(setAppStatusAC('succeeded'))
}

export function* removeTaskWorkerSaga(action: ReturnType<typeof removeTaskSaga>) {
    const data: ResponseType = yield call(todolistsAPI.deleteTask, action.taskId, action.todolistId)
    yield put(removeTaskAC(action.taskId, action.todolistId))
}

export function* addTaskWorkerSaga(action: ReturnType<typeof addTaskSaga>) {
    yield put(setAppStatusAC('loading'))
    try {
        const res = yield call(todolistsAPI.createTask, action.todolistId, action.title)

        if (res.data.resultCode === 0) {
            const task = res.data.data.item
            yield put(addTaskAC(task))
            yield put(setAppStatusAC('succeeded'))
        } else {
            yield* handleServerAppErrorSaga(res.data);
        }
    } catch (error) {
        yield* handleServerNetworkErrorSaga(error)
    }
}

export const fetchTasksSaga = (todolistId: string) => ({type: "Tasks/FETCH-TASKS", todolistId})
export const removeTaskSaga = (taskId: string, todolistId: string) => ({type: "Tasks/REMOVE-TASKS", taskId, todolistId})
export const addTaskSaga = (title: string, todolistId: string) => ({type: "Tasks/ADD-TASKS", title, todolistId})

export function* tasksWatcherSaga() {
    yield takeEvery("Tasks/FETCH-TASKS", fetchTasksWorkerSaga)
    yield takeEvery("Tasks/REMOVE-TASKS", removeTaskWorkerSaga)
    yield takeEvery("Tasks/ADD-TASKS", addTaskWorkerSaga)
}