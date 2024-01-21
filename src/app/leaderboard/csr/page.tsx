"use client";

import React, { useEffect, useState } from "react";
import style from "../leaderboard.module.css";
import { Todo } from "../../../../db/schema";
import { fetchHighPriorityTasks } from "../actions";

const HighPriorityTasks = () => {
  const [highPriorityTasks, setHighPriorityTasks] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      // try {
      const initialTasks = await fetchHighPriorityTasks();

      if (initialTasks) {
        setHighPriorityTasks(initialTasks);
      }
      // } catch {
      // If you purposefully omit try catch, the error will bubble to the default error.tsx page and display a nice error screen
      // }
    };

    fetchTasks();
  }, []);

  return (
    <div className={style.container}>
      <h1 className={style.title}>High Priority Tasks</h1>
      <div className={style.listContainer}>
        <ul className={style.taskList}>
          {highPriorityTasks.map((task) => (
            <li key={task.id} className={`${style.task} ${style.highPriority}`}>
              {task.title}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HighPriorityTasks;
