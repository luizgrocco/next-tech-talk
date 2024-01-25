import { fetchTask } from "@/app/todos/actions";
import { Todo } from "../../../../../db/schema";
import { fetchHighPriorityTasks } from "../../actions";
import style from "../../leaderboard.module.css";

// Diretiva para especificar o comportamento de rotas não geradas a partir do generateStaticParams
export const dynamicParams = false;

export async function generateStaticParams() {
  const tasks: Todo[] = (await fetchHighPriorityTasks()) || [];

  return tasks.map((task) => ({
    id: String(task.id),
    title: task.title,
  }));
}

export default async function GeneratedTasksPage({
  params,
}: {
  params: { id: string };
}) {
  const task = await fetchTask(Number(params.id));

  return (
    task && (
      <div className={style.generatedTask}>
        <div>Title: {task.title}</div>
        <div>Id: {task.id}</div>
        <div>Priority: {task.priority}</div>
      </div>
    )
  );
}
