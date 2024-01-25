import React from "react";
import style from "../leaderboard.module.css";
import { Todo } from "../../../../db/schema";
import { fetchHighPriorityTasks } from "../actions";

export const dynamic = "force-dynamic";

const HighPriorityTasks = async () => {
  const highPriorityTasks: Todo[] = (await fetchHighPriorityTasks()) || [];

  return (
    <div className={style.container}>
      <div>
        <h1 className={style.title}>High Priority Tasks</h1>
        <h2 className={style.subtitle}>Server Side Rendering</h2>
      </div>
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
