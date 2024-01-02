import { Todos } from "./components/Todos";
import style from "./todos.module.css";

export default function TodosPage() {
  return (
    <div className={style.container}>
      <Todos />
    </div>
  );
}
