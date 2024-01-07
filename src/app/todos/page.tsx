// import { Todo } from "../../../db/schema";
import { fetchAllTasks } from "./actions";
import { Todos } from "./components/Todos";
import style from "./todos.module.css";

export default async function TodosPage() {
  // const initialTasks: Todo[] = [];
  const initialTasks = (await fetchAllTasks()) || [];

  return (
    <div className={style.container}>
      <Todos initialTasks={initialTasks} />
    </div>
  );
}
