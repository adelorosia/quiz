import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { IUsers } from "../interface/interfaceQuiz";
import { getAllUsers } from "../services";

const ResultPage = () => {
  const [user, setUser] = useState({} as IUsers);
  const { _userSpzialId } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getAllUsers();
        const users = response.data;

        const selectUser = users.find(
          (user: IUsers) => user._userSpzialId === _userSpzialId
        );

        if (selectUser) setUser(selectUser);
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [_userSpzialId]);

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <div className="bg-zinc-300 px-8 py-5 rounded-lg shadow-lg shadow-BACKGROUND_DARK w-full lg-w-1/3 font-Viga flex flex-col gap-4 text-lg">
 
            <div className="flex justify-between text-md lg:text-2xl">
              <h2>{user.fullName}</h2>
              <p>{user.email}</p>
            </div>
            <div className="flex justify-between text-green-700">
              <h2>Correct Answers 👍</h2>
              <p>{user.correctAnswers}</p>
            </div>
            <div className="flex justify-between text-red-600">
              <h2>incorrect answers 😡</h2>
              <p>{user.IncorrectAnswers}</p>
            </div>
            <div className="flex justify-between text-blue-700">
              <h2>total score 👨‍🏫</h2>
              <p>{user.totalScore}</p>
            </div>
         
      </div>
    </div>
  );
};

export default ResultPage;
