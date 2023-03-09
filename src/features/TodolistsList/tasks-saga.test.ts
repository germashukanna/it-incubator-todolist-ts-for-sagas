import {addTaskWorkerSaga, fetchTasksWorkerSaga} from "./tasks-sagas";
import {setAppErrorAC, setAppStatusAC} from "../../app/app-reducer";
import {call, put} from "redux-saga/effects";
import {GetTasksResponse, TaskPriorities, TaskStatuses, todolistsAPI} from "../../api/todolists-api";
import {setTasksAC} from "./tasks-reducer";


beforeEach(() => {

})

test('fetchTasksWorkerSaga success flow', () => {
    const gen = fetchTasksWorkerSaga({type: '', todolistId: 'todolistId'})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
    expect(gen.next().value).toEqual(call(todolistsAPI.getTasks, 'todolistId'));
    const fakeApiResponse: GetTasksResponse = {
        error: '',
        totalCount: 1,
        items: [{
            id: "1", title: "bread", status: TaskStatuses.New, todoListId: "todolistId2", description: '',
            startDate: '', deadline: '', addedDate: '', order: 0, priority: TaskPriorities.Low
        }]
    }
    expect(gen.next(fakeApiResponse).value).toEqual(put(setTasksAC(fakeApiResponse.items, 'todolistId')));
    let next = gen.next();
    expect(next.value).toEqual(put(setAppStatusAC('succeeded')));
    expect(next.done).toBeTruthy();
})

test('addTaskWorkerSaga error flow', () => {
    const gen = addTaskWorkerSaga({type: 'Tasks/ADD-TASKS', todolistId: 'todolistId', title: 'task title'})
    expect(gen.next().value).toEqual(put(setAppStatusAC('loading')));
    expect(gen.next().value).toEqual(call(todolistsAPI.createTask, 'todolistId', 'task title'));
    expect(gen.throw({message: 'some error'}).value).toEqual(put(setAppErrorAC( 'some error')));
    expect(gen.next().value).toEqual(put(setAppStatusAC( 'failed')));


})



