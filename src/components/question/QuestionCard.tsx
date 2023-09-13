import { IQuestions } from "../../interface/interfaceQuiz";

interface IQuestionCardProps {
  question: IQuestions;
  index: number;
  handleAnswerChange: (
    questionId: number,
    userAnswer: string,
    checked: boolean,
    type: string
  ) => void;
  getQuestionType: (answer: string) => string;
}

const QuestionCard = ({
  question,
  index,
  handleAnswerChange,
  getQuestionType,
}: IQuestionCardProps) => {
  return (
    <div className="  bg-FOREGROUND px-8 py-6 rounded-lg shadow-lg shadow-BACKGROUND_DARK ">
      <div className="flex justify-between mb-3 lg:items-center lg:pt-0">
        <h3 className="text-lg pt-4 font-Viga lg:text-2xl">
          {index + 1 + "-"} {question.question}
        </h3>
        <h5 className="text-xs text-GRAY600">{question.score} points</h5>
      </div>
      <div className="question ">
        {question.choices.split(",").map((choice, choiceIndex) => (
          <div
            className="flex items-center gap-2 mb-2 text-xl"
            key={choiceIndex}
          >
            <input
              className="w-5 h-5"
              type={getQuestionType(question.type)}
              name={`question-${question.id}`}
              id={`question-${choice}`}
              value={choice}
              onChange={(e) =>
                handleAnswerChange(
                  question.id,
                  e.target.value,
                  e.target.checked,
                  getQuestionType(question.type)
                )
              }
            />
            <p>{choice}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuestionCard;
