import axios from "axios";
import { IUsers } from "../interface/interfaceQuiz";

const SERVER_URL = "http://localhost:3001";

export const getAllQuestions = () => {
  const url = `${SERVER_URL}/api/questions/display`;
  return axios.get(url);
};

export const getAllExtraInfo = () => {
  const url = `${SERVER_URL}/api/info/display`;
  return axios.get(url);
};

export const getAllUsers = () => {
  const url = `${SERVER_URL}/api/users/display`;
  return axios.get(url);
};

export const getUser = (_id:string) => {
  const url = `${SERVER_URL}/api/users/display/${_id}`;
  return axios.get(url);
};

export const createUser = (user: IUsers) => {
  const url = `${SERVER_URL}/api/users/create`;
  return axios.post(url, user);
};
