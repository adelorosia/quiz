import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllExtraInfo } from "../reducers/extra/ExtraReducer";

const DownCounter = () => {
  const extraInfo = useSelector(selectAllExtraInfo);
  const time = extraInfo.length > 0 ? extraInfo[0].time : 0;
  console.log("extra",extraInfo)
  console.log("time",time)
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [hours, setHours] = useState(0);
  const [isTimerStart, setIsTimerStart] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (time > 59) {
      setHours(Math.floor(time / 60));
      setMinutes(time % 60);
      setSeconds(0);
    } else {
      setMinutes(time);
    }
  }, [time]);

  useEffect(() => {
    let interval: number;

    if (isTimerStart) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          if (prevSeconds === 0) {
            setMinutes((prevMinutes) => {
              if (prevMinutes === 0) {
                setHours((prevHours) => {
                  if (prevHours === 0) {
                    setIsTimerStart(false);
                    clearInterval(interval);
                    // navigate("/result"); // این خط را حذف کنید
                    return 0;
                  }
                  return prevHours - 1;
                });
                return 59;
              }
              return prevMinutes - 1;
            });
            return 59;
          }
          return prevSeconds - 1;
        });
      }, 1000);
    }

    // تابع setTimeout برای تأخیر فراخوانی navigate را اضافه کنید
    if (!isTimerStart) {
      setTimeout(() => {
        navigate("/result");
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isTimerStart, navigate]);

  return (
    <div
      className={`font-Viga text-sm md:text-xl py-2 text-FOREGROUND  px-4 rounded-lg ${
        hours === 0 && minutes === 0 && seconds < 30
          ? "bg-RED600 animate-bounce"
          : "bg-GREEN500"
      }`}
    >
      {`${hours.toString().padStart(2, "0")} : ${minutes
        .toString()
        .padStart(2, "0")} : ${seconds.toString().padStart(2, "0")}`}
    </div>
  );
};

export default DownCounter;
