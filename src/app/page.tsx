"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { CiPause1, CiPlay1 } from "react-icons/ci";
import { GrPowerReset } from "react-icons/gr";
import { FaArrowLeftLong, FaArrowRightLong, FaArrowDownLong, FaArrowUpLong } from "react-icons/fa6";

type Position = {
  x: number;
  y: number;
};

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [snake, setSnake] = useState<Position[]>([{ x: 10, y: 10 }]);
  const [food, setFood] = useState<Position>({ x: 15, y: 15 });
  const [direction, setDirection] = useState<"UP" | "DOWN" | "LEFT" | "RIGHT">("RIGHT");
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const gameAreaRef = useRef<HTMLDivElement | null>(null);

  const gridSize = 40;
  const tileSize = 10;

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying) {
      interval = setInterval(moveSnake, 200);
    }

    return () => {
      clearInterval(interval);
    };
  }, [isPlaying, snake, direction]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowUp":
          if (direction !== "DOWN") setDirection("UP");
          break;
        case "ArrowDown":
          if (direction !== "UP") setDirection("DOWN");
          break;
        case "ArrowLeft":
          if (direction !== "RIGHT") setDirection("LEFT");
          break;
        case "ArrowRight":
          if (direction !== "LEFT") setDirection("RIGHT");
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [direction]);

  const moveSnake = () => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    switch (direction) {
      case "UP":
        head.y -= 1;
        break;
      case "DOWN":
        head.y += 1;
        break;
      case "LEFT":
        head.x -= 1;
        break;
      case "RIGHT":
        head.x += 1;
        break;
    }

    if (checkCollision(head)) {
      handleGameOver();
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      setFood({
        x: Math.floor(Math.random() * gridSize),
        y: Math.floor(Math.random() * gridSize),
      });
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const checkCollision = (head: Position) => {
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      return true;
    }

    for (let i = 1; i < snake.length; i++) {
      if (snake[i].x === head.x && snake[i].y === head.y) {
        return true;
      }
    }

    return false;
  };

  const handleGameOver = () => {
    setIsPlaying(false);
    if (score > highScore) {
      setHighScore(score);
    }
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
  };

  const handlePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setScore(0);
    setSnake([{ x: 10, y: 10 }]);
    setDirection("RIGHT");
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-slate-100">
      <div className="container min-w-[400px] max-w-[400px] h-[32rem] bg-slate flex flex-col items-center justify-between">
        <div className="header w-full h-14 bg-slate-700 text-white font-bold flex items-center justify-evenly rounded-t-md">
          <div className="score">Score: {score}</div>
          <div className="buttons flex items-center">
            <div className="pause-play">
              <Button variant="ghost" onClick={handlePlayPause}>
                {isPlaying ? <CiPause1 className="size-5" /> : <CiPlay1 className="size-5" />}
              </Button>
            </div>
            <div className="reset">
              <Button variant="ghost" onClick={handleReset}>
                <GrPowerReset className="size-5" />
              </Button>
            </div>
          </div>
          <div className="high-score">High Score: {highScore}</div>
        </div>
        <div
          className="content w-full h-full relative bg-black"
          ref={gameAreaRef}
          style={{ width: gridSize * tileSize, height: gridSize * tileSize }}
        >
          {snake.map((segment, index) => (
            <div
              key={index}
              className="snake-segment bg-blue-700 rounded-full absolute"
              style={{
                width: tileSize,
                height: tileSize,
                transform: `translate(${segment.x * tileSize}px, ${segment.y * tileSize}px)`,
              }}
            ></div>
          ))}
          <div
            className="food bg-red-700 rounded-full absolute"
            style={{
              width: tileSize,
              height: tileSize,
              transform: `translate(${food.x * tileSize}px, ${food.y * tileSize}px)`,
            }}
          ></div>
        </div>
        <div className="small-screen-btn w-full h-14 bg-slate-700 flex items-center">
          <div className="left h-full w-[25%]">
            <Button
              className="h-full w-full rounded-none bg-transparent text-white border-r-2 border-r-zinc-800 hover:bg-slate-500"
              onClick={() => direction !== "RIGHT" && setDirection("LEFT")}
            >
              <FaArrowLeftLong className="size-5" />
            </Button>
          </div>
          <div className="right h-full w-[25%]">
            <Button
              className="h-full w-full rounded-none bg-transparent text-white border-r-2 border-r-zinc-800 hover:bg-slate-500"
              onClick={() => direction !== "LEFT" && setDirection("RIGHT")}
            >
              <FaArrowRightLong className="size-5" />
            </Button>
          </div>
          <div className="top h-full w-[25%]">
            <Button
              className="h-full w-full rounded-none bg-transparent text-white border-r-2 border-r-zinc-800 hover:bg-slate-500"
              onClick={() => direction !== "DOWN" && setDirection("UP")}
            >
              <FaArrowUpLong className="size-5" />
            </Button>
          </div>
          <div className="bottom h-full w-[25%]">
            <Button
              className="h-full w-full rounded-none bg-transparent text-white border-r-zinc-800 hover:bg-slate-500"
              onClick={() => direction !== "UP" && setDirection("DOWN")}
            >
              <FaArrowDownLong className="size-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}











