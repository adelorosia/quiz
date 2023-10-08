import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { IUsers } from "../../interface/interfaceQuiz";
import { createUser, getAllUsers, getUserSpezialId } from "../../services";
import { RootState } from "../../store";

interface IUser {
  users: IUsers[];
  status: "idle" | "loading" | "completed" | "failed";
  error: string | null;
}

export const fetchUser = createAsyncThunk("/user/fetchUser", async () => {
  const response = await getAllUsers();
  return response.data;
});

export const fetchUserSpezialId = createAsyncThunk(
  "/blogs/fetchUserSpezialId",
  async (_userSpzialId: string) => {
    const response = await getUserSpezialId(_userSpzialId);
    return response.data;
  }
);

export const addNewUser = createAsyncThunk(
  "/user/addNewUser",
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
      })
      .addCase(fetchUserSpezialId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchUserSpezialId.fulfilled, (state, action) => {
        state.status = "completed";
        // این قسمت را تغییر دهید
        const updatedUser = action.payload;
        const userIndex = state.users.findIndex(
          (user) => user._userSpzialId === updatedUser._userSpzialId
        );
        if (userIndex !== -1) {
          state.users[userIndex] = updatedUser;
        }
      })
      .addCase(fetchUserSpezialId.rejected, (state, action) => {
        (state.status = "failed"),
          (state.error =
            action.error.message || "gibt es eine error in response");
      });
  },
});

export const selectAllUsers = (state: RootState) => state.users.users;
export const selectUserBySpezialId = (
  state: RootState,
  _userSpzialId: string
) => state.users.users.find((user) => user._userSpzialId === _userSpzialId);

export default userSlice.reducer;
