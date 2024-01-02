"use server";

import { eq } from "drizzle-orm";
import db from "../../../db/db-client";
import { todos, Priority, Todo } from "../../../db/schema";

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
  try {
    await db.delete(todos).where(eq(todos.id, taskId));
    return true;
  } catch (_) {
    return false;
  }
}

export async function deleteDoneTasks() {
  try {
    await db.delete(todos).where(eq(todos.done, true));
    return true;
  } catch (_) {
    return false;
  }
}
