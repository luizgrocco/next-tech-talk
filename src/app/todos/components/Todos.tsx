"use client";
import { ChangeEvent, useEffect, useState } from "react";
import style from "../todos.module.css";
import { Priority, Todo } from "../../../../db/schema";
import classNames from "classnames";
import {
  addTask,
  deleteDoneTasks,
  deleteTask,
  fetchAllTasks,
  updateTask,
} from "../actions";

export const Todos = () => {
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("low");
  const [tasks, setTasks] = useState<Todo[]>([]);
  const [taskBeingEditedId, setTaskBeingEditedId] = useState<
    number | undefined
  >();
  const [taskBeingEditedTitle, setTaskBeingEditedTitle] = useState("");
  const [currentFilter, setCurrentFilter] = useState<
    "all" | "active" | "completed"
  >("all");

  const activeTasksCount = tasks.filter((task) => task.done).length;

  useEffect(() => {
    const fetchInitialTasks = async () => {
      const initialTasks = await fetchAllTasks();
      if (initialTasks) {
        setTasks(initialTasks);
      }
    };

    fetchInitialTasks();
  }, []);

  const handleTaskDoubleClick = (task: Todo) => () => {
    setTaskBeingEditedId(task.id);

    // if (taskTitleRef.current) taskTitleRef.current.value = task.title;

    // setTimeout(() => {
    //   taskTitleRef.current?.focus();
    // }, 0);
  };

  const handleCheckboxToggle =
    (task: Todo) => async (e: ChangeEvent<HTMLInputElement>) => {
      console.log({ task });
      const checked = e.target.checked;
      const updatedTasks = await updateTask(task.id, {
        done: checked,
      });
      if (updatedTasks) {
        setTasks((previousTasks) =>
          previousTasks.flatMap((previousTask) =>
            previousTask.id === task.id ? updatedTasks : previousTask
          )
        );
      }
    };

  const handleDeleteTask = (task: Todo) => async () => {
    const result = await deleteTask(task.id);
    if (result) {
      setTasks((previousTasks) =>
        previousTasks.filter((updatedTask) => updatedTask.id !== task.id)
      );
    }
  };

  const handleClearCompleted = async () => {
    const result = await deleteDoneTasks();
    if (result) {
      setTasks((previousTasks) => previousTasks.filter((task) => !task.done));
    }
  };

  return (
    <section className={style.todoapp}>
      <header className={style.header}>
        <h1 className={style.title}>todos</h1>
      </header>

      <section className={style.main}>
        <div className={style.inputContainer}>
          <div className={style.priorityContainer}>
            <button className={style.highPriority} />
            <button className={style.mediumPriority} />
            <button className={style.lowPriority} />
          </div>
          <input
            name="title"
            value={newTodoTitle}
            className={style.newTodo}
            placeholder="What needs to be done?"
            autoFocus
            onChange={(e) => {
              setNewTodoTitle(e.target.value);
            }}
            onBlur={async () => {
              if (newTodoTitle !== "") {
                const newTasks = await addTask(newTodoTitle, newTodoPriority);
                if (newTasks) {
                  setTasks((tasks) => [...tasks, ...newTasks]);
                }
              }
            }}
          />
        </div>
        <ul className={style.todoList}>
          {tasks
            .filter((task) =>
              currentFilter === "active"
                ? !task.done
                : currentFilter === "completed"
                  ? task.done
                  : true
            )
            .map((task) => (
              <li
                className={classNames(style.todo, {
                  [style.completed]: task.done,
                })}
                key={task.id}
              >
                <div className={style.view}>
                  <input
                    className={style.toggle}
                    type="checkbox"
                    checked={task.done}
                    onChange={handleCheckboxToggle(task)}
                  />
                  {taskBeingEditedId === task.id ? (
                    <input
                      className={style.edit}
                      value={taskBeingEditedTitle}
                      // onKeyDown={handleEditTaskTitleKeyDown}
                      // onBlur={handleEditTaskTitleBlur}
                    />
                  ) : (
                    <label onDoubleClick={handleTaskDoubleClick(task)}>
                      {task.title}
                    </label>
                  )}
                  <button
                    className={style.destroy}
                    onClick={handleDeleteTask(task)}
                  />
                </div>
              </li>
            ))}
        </ul>
      </section>

      <footer className={style.footer}>
        <span className={style.todoCount}>
          <strong>{activeTasksCount}</strong> item
          {activeTasksCount !== 1 && "s"} left
        </span>
        <ul className={style.filters}>
          <li
            className={classNames(style.filter, {
              [style.selected]: currentFilter === "all",
            })}
            onClick={() => setCurrentFilter("all")}
          >
            All
          </li>
          <li
            className={classNames(style.filter, {
              [style.selected]: currentFilter === "active",
            })}
            onClick={() => setCurrentFilter("active")}
          >
            Active
          </li>
          <li
            className={classNames(style.filter, {
              [style.selected]: currentFilter === "completed",
            })}
            onClick={() => setCurrentFilter("completed")}
          >
            Completed
          </li>
        </ul>
        <button className={style.clearCompleted} onClick={handleClearCompleted}>
          Clear completed
        </button>
      </footer>
    </section>
  );
};
