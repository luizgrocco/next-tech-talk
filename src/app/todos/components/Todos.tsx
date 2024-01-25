"use client";
import React, {
  FC,
  ChangeEvent,
  FocusEventHandler,
  KeyboardEventHandler,
  // useEffect,
  useState,
} from "react";
import style from "../todos.module.css";
import { Priority, Todo } from "../../../../db/schema";
import classNames from "classnames";
import {
  addTask,
  deleteDoneTasks,
  deleteTask,
  // fetchAllTasks,
  updateTask,
} from "../actions";
import { revalidatePath } from "next/cache";

type TodosProps = {
  initialTasks: Todo[];
};

type Filter = "all" | "active" | "completed";

export const Todos: FC<TodosProps> = ({ initialTasks }) => {
  const [tasks, setTasks] = useState<Todo[]>(initialTasks);
  const [newTodoTitle, setNewTodoTitle] = useState("");
  const [newTodoPriority, setNewTodoPriority] = useState<Priority>("low");
  const [taskBeingEditedId, setTaskBeingEditedId] = useState<number | null>(
    null
  );
  const [taskBeingEditedTitle, setTaskBeingEditedTitle] = useState("");
  const [currentFilter, setCurrentFilter] = useState<Filter>("all");
  const [clearCompletedLoading, setClearCompletedLoading] = useState(false);

  const activeTasksCount = tasks.filter((task) => !task.done).length;

  // useEffect(() => {
  //   const fetchInitialTasks = async () => {
  //     try {
  //       const initialTasks = await fetchAllTasks();
  //       if (initialTasks) {
  //         setTasks(initialTasks);
  //       }
  //     } catch {
  //       // Retries?
  //       // Set error state?
  //       // Error Boundary with Suspense?
  //     }
  //   };

  //   fetchInitialTasks();
  // }, []);

  const handleNewTodoBlur: FocusEventHandler<HTMLInputElement> = async () => {
    if (newTodoTitle !== "") {
      try {
        const newTasks = await addTask(newTodoTitle, newTodoPriority);
        if (newTasks) {
          setTasks((tasks) => [...tasks, ...newTasks]);
        }
      } catch {
        // Well, server actions can fail, better luck next time...
      } finally {
        setNewTodoTitle("");
      }
    }
  };

  const handleNewTodoKeyDown: KeyboardEventHandler<HTMLInputElement> = async (
    e
  ) => {
    if (
      (e.code === "Enter" || e.code === "NumpadEnter") &&
      newTodoTitle !== ""
    ) {
      e.currentTarget.blur();
    }
  };

  const handleTaskDoubleClick = (task: Todo) => () => {
    setTaskBeingEditedId(task.id);
    setTaskBeingEditedTitle(task.title);

    setTimeout(() => {
      const el = document.getElementById(task.id.toString());
      if (el) el.innerHTML = task.title;
      el?.focus();
    }, 0);
  };

  // Using .then() with server actions feel like a good pattern to me, quick example:
  const handleCheckboxToggle =
    (task: Todo) => async (e: ChangeEvent<HTMLInputElement>) =>
      updateTask(task.id, {
        done: !task.done,
      })
        .then((updatedTasks) => {
          if (updatedTasks) {
            setTasks((previousTasks) =>
              previousTasks.flatMap((previousTask) =>
                previousTask.id === task.id ? updatedTasks : previousTask
              )
            );
          }
        })
        .catch((error) => {
          // This could've errored. A good programmer should implement the same behaviour they would when a REST API endpoint fails such as retry policy with exponential backoff, display error message on screen, etc...)
          // Exercise left to the reader. (I am a bad programmer)
        })
        .finally(() => {
          // It feels to me that with serverAction().then().catch().finally pattern,
          // a lot of code that invokes server actions can be inlined like this snippet.
          // What do you think?
          //
          // Do some cleanup
        });

  // .then() feels good because I don't need an empty catch block when I intended to ignore errors that are not critical like in the case bellow.
  // With try catch syntax an empty catch block would be needed that would worsen readability, like so:
  // try {
  //   const result = await deleteTask(task.id);
  //   if (result) {
  //     setTasks((previousTasks) =>
  //       previousTasks.filter((updatedTask) => updatedTask.id !== task.id)
  //     );
  //   }
  // } catch {} <--- why?

  // Better:
  const handleDeleteTask = (task: Todo) => async () =>
    deleteTask(task.id).then((success) => {
      if (success) {
        setTasks((previousTasks) =>
          previousTasks.filter((updatedTask) => updatedTask.id !== task.id)
        );
      }
    });

  // Look how easy Optimistic updates become with server actions:
  const handleClearCompleted = async () => {
    const tasksBeforeDeletion = tasks;
    setTasks((previousTasks) => previousTasks.filter((task) => !task.done));
    setClearCompletedLoading((previous) => !previous);

    try {
      const success = await deleteDoneTasks();

      if (!success) {
        console.log("I Failed! Rolling back changes.");
        setTasks(tasksBeforeDeletion);
      }
    } catch {
      setTasks(tasksBeforeDeletion);
    } finally {
      setClearCompletedLoading(false);
    }
  };

  const handleEditTaskTitleBlur = (task: Todo) => async () => {
    updateTask(task.id, {
      title: taskBeingEditedTitle,
    })
      .then((updatedTasks) => {
        if (updatedTasks) {
          setTasks((previousTasks) =>
            previousTasks.flatMap((previousTask) =>
              previousTask.id === task.id ? updatedTasks : previousTask
            )
          );
        }
      })
      .finally(() => {
        setTaskBeingEditedId(null);
        setTaskBeingEditedTitle("");
      });
  };

  const handleEditTaskTitleKeyDown: KeyboardEventHandler<HTMLInputElement> = (
    e
  ) => {
    console.log({ code: e.code });
    if (e.code === "Enter" || e.code === "NumpadEnter") e.currentTarget.blur();
  };

  return (
    <section className={style.todoapp}>
      <header className={style.header}>
        <h1 className={style.title}>todos</h1>
      </header>

      <div className={style.mainContainer}>
        <section className={style.main}>
          <div className={style.inputContainer}>
            <div className={style.priorityContainer}>
              <button
                className={`${style.priority} ${style.highPriority} ${
                  newTodoPriority === "high" ? style.selectedPriority : ""
                }`}
                onClick={() => setNewTodoPriority("high")}
              />
              <button
                className={`${style.priority} ${style.mediumPriority} ${
                  newTodoPriority === "medium" ? style.selectedPriority : ""
                }`}
                onClick={() => setNewTodoPriority("medium")}
              />
              <button
                className={`${style.priority} ${style.lowPriority} ${
                  newTodoPriority === "low" ? style.selectedPriority : ""
                }`}
                onClick={() => setNewTodoPriority("low")}
              />
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
              onKeyDown={handleNewTodoKeyDown}
              onBlur={handleNewTodoBlur}
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
                <li className={style.todo} key={task.id}>
                  <input
                    className={classNames(style.toggle, {
                      [style.toggleSelected]: task.done,
                    })}
                    type="checkbox"
                    onChange={handleCheckboxToggle(task)}
                  />
                  <div className={style.view}>
                    {taskBeingEditedId === task.id ? (
                      <input
                        id={task.id.toString()}
                        className={style.todoEdit}
                        value={taskBeingEditedTitle}
                        onChange={(e) =>
                          setTaskBeingEditedTitle(e.target.value)
                        }
                        onKeyDown={handleEditTaskTitleKeyDown}
                        onBlur={handleEditTaskTitleBlur(task)}
                      />
                    ) : (
                      <>
                        <label
                          className={classNames(style.todoLabel, {
                            [style.todoCompleted]: task.done,
                          })}
                          onDoubleClick={handleTaskDoubleClick(task)}
                        >
                          {task.title}
                        </label>
                        <div
                          className={classNames(
                            style.todoPriority,
                            style[`${task.priority}Priority`]
                          )}
                        />
                        <button
                          className={style.destroy}
                          onClick={handleDeleteTask(task)}
                        >
                          ×
                        </button>
                      </>
                    )}
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
                [style.selectedFilter]: currentFilter === "all",
              })}
              onClick={() => setCurrentFilter("all")}
            >
              All
            </li>
            <li
              className={classNames(style.filter, {
                [style.selectedFilter]: currentFilter === "active",
              })}
              onClick={() => setCurrentFilter("active")}
            >
              Active
            </li>
            <li
              className={classNames(style.filter, {
                [style.selectedFilter]: currentFilter === "completed",
              })}
              onClick={() => setCurrentFilter("completed")}
            >
              Completed
            </li>
          </ul>
          <button
            className={style.clearCompleted}
            onClick={handleClearCompleted}
          >
            {clearCompletedLoading ? "Loading..." : "Clear completed"}
          </button>
        </footer>
      </div>
    </section>
  );
};
