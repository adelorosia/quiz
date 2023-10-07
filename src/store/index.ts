import { configureStore } from "@reduxjs/toolkit";
import questionReducer, { fetchQuiz } from "../reducers/quiz/QuizReducer";
import extraInfoReducer, { fetchExtraInfo } from "../reducers/extra/ExtraReducer"
import userReducer, { fetchUser } from "../reducers/users/userReducer"
export const store = configureStore({
  reducer: {
    questions: questionReducer,
    extraInfo:extraInfoReducer,
    users:userReducer
  },
});
store.dispatch(fetchQuiz())
store.dispatch(fetchExtraInfo())
store.dispatch(fetchUser())

export type dispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
