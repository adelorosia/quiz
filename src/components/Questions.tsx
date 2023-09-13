import { useDispatch, useSelector } from "react-redux";
import {
  selectAllQuestions,
  setSelectedAnswers,
} from "../reducers/quiz/QuizReducer";
import AlertDelete from "./AlertDelete";
import UsersInfo from "./UsersInfo";
import { RootState } from "../store";

const Questions = () => {
  const dispatch = useDispatch();
  const questions = useSelector(selectAllQuestions);
  const userAnswers = useSelector(
    (state: RootState) => state.questions.selectedAnswers
  );



  const calculateResults = () => {
    // محاسبه نتایج
    const results = questions.map((question) => {
      const userAnswer = userAnswers.find((answer) => answer.id === question.id);
  
      if (!userAnswer) {
        return {
          id: question.id,
          question: question.question,
          userAnswer: "No answer provided",
          isCorrect: false,
        };
      }
  
      if (question.type === "trueFalse" || question.type === "singlecorrect_answers") {
        // اگر نوع سوال trueFalse یا singlecorrect_answers باشد
        const isCorrect = userAnswer.userAnswer[0] === question.correct_answers;
        return {
          id: question.id,
          question: question.question,
          userAnswer: userAnswer.userAnswer[0],
          isCorrect,
        };
      } else if (question.type === "multiplecorrect_answers") {
        // اگر نوع سوال multiplecorrect_answers باشد
        const correctAnswers = question.correct_answers.split(",");
        const userSelectedAnswers = [...new Set(userAnswer.userAnswer)].sort(); // حذف تکرارها
        const isCorrect = correctAnswers.every((correctAnswer) =>
          userSelectedAnswers.includes(correctAnswer)
        );
        return {
          id: question.id,
          question: question.question,
          userAnswer: userSelectedAnswers.join(", "),
          isCorrect,
        };
      }
    });
  
    // نمایش نتایج در کنسول به صورت جدول
    console.table(results);
  };
  
  
  
  
  const handleCalculateResults = () => {
    calculateResults();
  };

  const handleAnswerChange = (questionId: number, userAnswer: string) => {
    // بررسی اگر جواب برای این سوال قبلاً ثبت شده باشد
    const existingAnswerIndex = userAnswers.findIndex(
      (answer) => answer.id === questionId
    );
    if (existingAnswerIndex !== -1) {
      const updatedAnswers = [...userAnswers];
      updatedAnswers[existingAnswerIndex] = {
        ...updatedAnswers[existingAnswerIndex], // کپی کردن اطلاعات موجود
        userAnswer: [
          ...updatedAnswers[existingAnswerIndex].userAnswer,
          userAnswer,
        ], // اضافه کردن جواب جدید
      };
      dispatch(setSelectedAnswers(updatedAnswers));
    } else {
      // اگر جواب برای این سوال وجود نداشته باشد، آن را به لیست اضافه کنید
      dispatch(
        setSelectedAnswers([
          ...userAnswers,
          { id: questionId, userAnswer: [userAnswer] },
        ])
      );
    }
  };

  console.log(userAnswers);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex bg-BLUE700/90 py-4 px-12 justify-between shadow-lg shadow-BACKGROUND_DARK font-Viga md:text-2xl fixed w-full right-0 rounded-b-full">
        <UsersInfo />
      </div>
      <div className="wrapper my-24 flex flex-col gap-6 select-none">
        {questions.map((question, index) => (
          <div
            className="  bg-FOREGROUND px-8 py-6 rounded-lg shadow-lg shadow-BACKGROUND_DARK "
            key={index}
          >
            <div className="flex justify-between mb-3 lg:items-center lg:pt-0">
              <h3 className="text-lg pt-4 font-Viga lg:text-2xl">
                {index + 1 + "-"} {question.question}
              </h3>
              <h5 className="text-xs text-GRAY600">{question.score}points</h5>
            </div>
            <div className="question ">
              {question.choices.split(",").map((choice, index) => (
                <div
                  className="flex items-center gap-2 mb-2 text-xl"
                  key={index}
                >
                  <input
                    className="w-5 h-5"
                    type={question.type === "trueFalse" ? "radio" : "checkbox"}
                    name={`question-${question.id}`}
                    id={`question-${choice}`}
                    value={choice}
                    onChange={() => handleAnswerChange(question.id, choice)}
                  />
                  <p>{choice}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="flex justify-between items-center">
          <button className="bg-GREEN600 text-FOREGROUND hover:text-GREEN600 hover:bg-FOREGROUND  px-8 py-2 rounded-lg font-Viga duration-300 shadow-lg shadow-BACKGROUND_DARK" onClick={handleCalculateResults}>
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
