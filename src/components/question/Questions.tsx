import { useSelector } from "react-redux";
import { selectAllQuestions } from "../../reducers/quiz/QuizReducer";
import AlertDelete from "../AlertDelete";
import UsersInfo from "../UsersInfo";
import { useState } from "react";
import QuestionCard from "./QuestionCard";

const Questions = () => {
  const questions = useSelector(selectAllQuestions);
  const [userAnswers, setUserAnswers] = useState<
    { id: number; userAnswer: string[] }[]
  >([]);

  const getQuestionType = (answer: string) => {
    return answer === "trueFalse" ? "radio" : "checkbox";
  };

  const calculateResults = () => {
    const results = questions
      .map((question) => {
        const userAnswer = userAnswers.find(
          (answer) => answer.id === question.id
        ) || {
          id: question.id,
          userAnswer: [],
        };

        if (!userAnswer) {
          return {
            id: question.id,
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
            id: question.id,
            question: question.question,
            userAnswer: userAnswer.userAnswer[0],
            isCorrect,
          };
        } else if (question.type === "multiplecorrect_answers") {
          const correctAnswers = question.correct_answers.split(",");
          const userSelectedAnswers = [
            ...new Set(userAnswer.userAnswer),
          ].sort();
          const isCorrect =
            correctAnswers.length === userSelectedAnswers.length &&
            correctAnswers.every((correctAnswer) =>
              userSelectedAnswers.includes(correctAnswer)
            );

          return {
            id: question.id,
            question: question.question,
            userAnswer: userSelectedAnswers.join(", "),
            isCorrect,
            score: question.score,
            choices: question.choices,
          };
        }
        return null;
      })
      .filter((result) => result !== null);

    console.table(results);
  };

  const handleCalculateResults = () => {
    calculateResults();
  };

  const handleAnswerChange = (
    questionId: number,
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex bg-BLUE700/90 py-4 px-12 justify-between shadow-lg shadow-BACKGROUND_DARK font-Viga md:text-2xl fixed w-full right-0 rounded-b-full">
        <UsersInfo />
      </div>
      <div className="wrapper my-24 flex flex-col gap-6 select-none">
        {questions.map((question, index) => (
          <QuestionCard
            key={index}
            question={question}
            index={index}
            handleAnswerChange={handleAnswerChange}
            getQuestionType={getQuestionType}
          />
        ))}
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