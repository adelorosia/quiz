import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUsers } from "../../interface/interfaceQuiz";
import { createUser, getAllUsers } from "../../services";
import { RootState } from "../../store";

interface IUser {
  users: IUsers[];
  status: "idle" | "loading" | "completed" | "failed";
  error: string | null;
}

export const fetchUser = createAsyncThunk("/user/fetchQuiz", async () => {
  const response = await getAllUsers();
  return response.data;
});

export const addNewUser = createAsyncThunk(
  "/blogs/addNewBlog",
  async (initialUser: IUsers) => {
    const response = await createUser(initialUser);
    return response.data;
  }
);

const initialState: IUser = {
  users: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        (state.status = "completed"), (state.users = action.payload);
      })
      .addCase(fetchUser.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error =
            action.error.message || "gibt es eine error in response");
      })
      .addCase(addNewUser.fulfilled, (state, action) => {
        state.users.push(action.payload);
      });
  },
});

export const selectAllUsers = (state: RootState) => state.users.users;

export default userSlice.reducer;
