"use server";

import { eq } from "drizzle-orm";
import db from "../../../db/db-client";
import { todos, Priority, Todo } from "../../../db/schema";
import { sleep } from "@/utils";

export async function fetchAllTasks() {
  try {
    const tasks = await db.select().from(todos);
    return tasks;
  } catch (_) {
    return false;
  }
}

export async function addTask(title: string, priority: Priority) {
  try {
    const result = await db
      .insert(todos)
      .values({ title, priority })
      // Drizzle's "returning" method gives you the inserted or updated values back (DB Support dependent: Postgres, SQLite)
      .returning();
    return result;
  } catch (_) {
    return false;
  }
}

export async function updateTask(
  taskId: number,
  attrs: Partial<Pick<Todo, "done" | "title">>
) {
  try {
    const updatedTasks = await db
      .update(todos)
      .set(attrs)
      .where(eq(todos.id, taskId))
      .returning();
    return updatedTasks;
  } catch (_) {
    return false;
  }
}

export async function deleteTask(taskId: number) {
  // My Api here is to return (true | T or false) when actions on the server succeed or fail (db operations mostly).
  // A better api would be to return some structured response such as:
  // interface Response<T> {ok: true | false, error: string, value: T}
  try {
    await db.delete(todos).where(eq(todos.id, taskId));
    return true;
  } catch (_) {
    return false;
  }
}

export async function deleteDoneTasks() {
  await sleep(1000);

  try {
    if (Math.random() < 0.5) throw new Error("failed deleting done tasks!");
    await db.delete(todos).where(eq(todos.done, true));
    return true;
  } catch (_) {
    return false;
  }
}

// Probably a good idea:
// Wrap all server actions with a cache layer, eg. Apollo client, React Query, CreateRemoteData (Navarro™)
