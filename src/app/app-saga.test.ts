import {initializeAppWorkerSaga} from "./app-sagas";
import {call, put} from "redux-saga/effects";
import {authAPI, MeResponseType} from "../api/todolists-api";
import {setIsLoggedInAC} from "../features/Login/auth-reducer";
import {setAppInitializedAC} from "./app-reducer";

let MeResponse: MeResponseType;

beforeEach(() => {
    MeResponse = {
        resultCode: 0,
        data: {id: 12, email: '', login: ''},
        messages: []
    }
})

test('initializeAppWorkerSaga login success', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me));
    expect(gen.next(MeResponse).value).toEqual(put(setIsLoggedInAC(true)));
    expect(gen.next().value).toEqual(put(setAppInitializedAC(true)));
})

test('initializeAppWorkerSaga login unsuccess', () => {
    const gen = initializeAppWorkerSaga()
    expect(gen.next().value).toEqual(call(authAPI.me));
    MeResponse.resultCode = 1;
    expect(gen.next(MeResponse).value).toEqual(put(setAppInitializedAC(true)));
})


