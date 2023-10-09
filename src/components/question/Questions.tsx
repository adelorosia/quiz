import { useDispatch, useSelector } from "react-redux";
import { fetchQuiz, selectAllQuestions } from "../../reducers/quiz/QuizReducer";
import AlertDelete from "../AlertDelete";
import UsersInfo from "../UsersInfo";
import { useEffect, useState } from "react";
import QuestionCard from "./QuestionCard";
import { AppDispatch, RootState } from "../../store";
import { addNewUser } from "../../reducers/users/userReducer";
import { useNavigate } from "react-router-dom";
import { nanoid } from "@reduxjs/toolkit";
import Spinner from "../Spinner";

const QuestionStatus = {
  Idle: "idle",
  Loading: "loading",
  Completed: "completed",
  Failed: "failed",
};

const Questions = () => {
  const questionStatus = useSelector(
    (state: RootState) => state.questions.status
  );
  const error = useSelector((state: RootState) => state.questions.error);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const email = useSelector((state: RootState) => state.questions.email);
  const fullName = useSelector((state: RootState) => state.questions.fullName);
  const questions = useSelector(selectAllQuestions);
  const [userAnswers, setUserAnswers] = useState<
    { id: string; userAnswer: string[] }[]
  >([]);

  const getQuestionType = (answer: string) => {
    return answer === "trueFalse" ? "radio" : "checkbox";
  };

  const calculateResults = async () => {
    const results = questions.map((question) => {
      const userAnswer = userAnswers.find(
        (answer) => answer.id === question._id
      ) || {
        id: question._id,
        userAnswer: [],
      };

      if (!userAnswer) {
        return {
          id: question._id,
          question: question.question,
          userAnswer: "No answer provided",
          isCorrect: false,
          score: question.score,
          choices: question.choices,
        };
      }

      if (
        question.type === "trueFalse" ||
        question.type === "singlecorrect_answers"
      ) {
        const isCorrect =
          userAnswer.userAnswer[0] === question.correct_answers &&
          userAnswer.userAnswer.length === 1;
        return {
          id: question._id,
          question: question.question,
          userAnswer: userAnswer.userAnswer[0],
          isCorrect,
          score: isCorrect ? question.score : 0,
        };
      } else if (question.type === "multiplecorrect_answers") {
        const correctAnswers = question.correct_answers.split(",");
        const userSelectedAnswers = [...new Set(userAnswer.userAnswer)].sort();
        const isCorrect =
          correctAnswers.length === userSelectedAnswers.length &&
          correctAnswers.every((correctAnswer) =>
            userSelectedAnswers.includes(correctAnswer)
          );

        return {
          id: question._id,
          question: question.question,
          userAnswer: userSelectedAnswers.join(", "),
          isCorrect,
          score: isCorrect ? question.score : 0,
          choices: question.choices,
        };
      }
      return null;
    });

    console.table(results);

    const correctAnswers = results.filter((result) => result!.isCorrect);
    const incorrectAnswers = results.filter((result) => !result!.isCorrect);

    const total = results.reduce((acc, result) => acc + result!.score, 0);
    const spezialId = nanoid();
    try {
      await new Promise((resolve) => setTimeout(resolve, 0));
      await dispatch(
        addNewUser({
          _id: "",
          _userSpzialId: spezialId,
          fullName: fullName,
          email: email,
          correctAnswers: correctAnswers.length,
          IncorrectAnswers: incorrectAnswers.length,
          totalScore: total,
        })
      );
    } catch (error) {
      console.error("Failed to save the blog", error);
    }
    navigate(`/result/${spezialId}`);
  };

  const handleAnswerChange = (
    questionId: string,
    userAnswer: string,
    checked: boolean,
    type: string
  ) => {
    const selectedQuestionAnswers = userAnswers.find(
      (answer) => answer.id === questionId
    ) || {
      id: questionId,
      userAnswer: [],
    };

    const updatedAnswers = checked
      ? type === "radio"
        ? [userAnswer]
        : [...selectedQuestionAnswers.userAnswer, userAnswer]
      : selectedQuestionAnswers.userAnswer.filter(
          (answer) => answer !== userAnswer
        );

    setUserAnswers((prevUserAnswers) => {
      const existingAnswerIndex = prevUserAnswers.findIndex(
        (answer) => answer.id === questionId
      );
      if (existingAnswerIndex !== -1) {
        prevUserAnswers[existingAnswerIndex] = {
          ...prevUserAnswers[existingAnswerIndex],
          userAnswer: updatedAnswers,
        };
      } else {
        prevUserAnswers.push({ id: questionId, userAnswer: updatedAnswers });
      }

      return [...prevUserAnswers];
    });
  };

  const handleCalculateResults = () => {
    calculateResults();
  };
  useEffect(() => {
    if (questionStatus === "idle") {
      dispatch(fetchQuiz());
    }
  }, [questionStatus, dispatch]);
  const renderQuestion = () => {
    switch (questionStatus) {
      case QuestionStatus.Loading:
        return <Spinner />;
      case QuestionStatus.Completed:
        return questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            handleAnswerChange={handleAnswerChange}
            getQuestionType={getQuestionType}
          />
        ));
      case QuestionStatus.Failed:
        return <div>{error}</div>;
      default:
        return null;
    }
  };
  return (
    <div className="flex flex-col gap-8">
      <div className="flex bg-BLUE700/90 py-4 px-12 justify-between shadow-lg shadow-BACKGROUND_DARK font-Viga md:text-2xl fixed w-full right-0 rounded-b-full">
        <UsersInfo />
      </div>
      <div className="wrapper my-24 flex flex-col gap-6 select-none">
        {renderQuestion()}
        <div className="flex justify-between items-center">
          <button
            className="bg-GREEN600 text-FOREGROUND hover:text-GREEN600 hover:bg-FOREGROUND  px-8 py-2 rounded-lg font-Viga duration-300 shadow-lg shadow-BACKGROUND_DARK"
            onClick={handleCalculateResults}
          >
            Submit
          </button>
          <div>
            <AlertDelete />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Questions;
