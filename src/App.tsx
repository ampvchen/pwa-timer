import { useEffect, useState } from "react";
import { getTime, saveTime } from "./lib/idb";
import { Button } from "./components/ui/button";
import { PlayIcon, StopIcon } from "@heroicons/react/20/solid";

function separateTime(totalSeconds: number) {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  const seconds = totalSeconds - hours * 3600 - minutes * 60;

  return { hours, minutes, seconds };
}

function App() {
  const [seconds, setSeconds] = useState<number>(0);
  const [tracking, setTracking] = useState<boolean>(false);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const savedTime = await getTime();
        if (savedTime) {
          setSeconds(savedTime);
        }
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
  }, []);

  useEffect(() => {
    if (tracking) {
      const interval = setInterval(() => {
        setSeconds((prevSeconds) => prevSeconds + 1);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [tracking]);

  const time = separateTime(seconds);

  useEffect(() => {
    // if (seconds % 30 === 0 && seconds > 0) {
    if (seconds > 0) {
      saveTime(seconds)
        .then(() => {
          // console.log("Time saved!");
        })
        .catch((error) => {
          console.error("Error saving time:", error);
        });
    }
  }, [seconds, time]);

  const formattedHours = String(time.hours).padStart(2, "0");
  const formattedMinutes = String(time.minutes).padStart(2, "0");
  const formattedSeconds = String(time.seconds).padStart(2, "0");

  return (
    <div className="mx-auto my-10 max-w-md">
      <h1 className="text-3xl font-bold tracking-tight">Timer</h1>
      <div className="flex items-center space-x-8">
        <Button
          size={"sm"}
          variant={"outline"}
          className="w-20"
          onClick={() => setTracking(!tracking)}
        >
          {tracking ? (
            <span className="flex items-center">
              <StopIcon className="mr-2 h-4 w-4 fill-red-500" />
              Stop
            </span>
          ) : (
            <span className="flex items-center">
              <PlayIcon className="mr-2 h-4 w-4 fill-slate-500" />
              Start
            </span>
          )}
        </Button>
        <div className="flex items-center space-x-2">
          <p className="font-bold">Name</p>
          <span>-</span>
          <p className="my-6 font-mono font-medium tracking-wide text-gray-600">
            {time.hours > 0 ? formattedHours + ":" : ""}
            {formattedMinutes}:{formattedSeconds}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
