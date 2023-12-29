import { Title } from "./components/Title";
import style from "./todos.module.css";

export default function TodosPage() {
  return (
    <div className={style.container}>
      <Title />
    </div>
  );
}
