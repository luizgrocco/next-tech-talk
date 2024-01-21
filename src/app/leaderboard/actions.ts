"use server";

import { eq } from "drizzle-orm";
import db from "../../../db/db-client";
import { todos } from "../../../db/schema";

export async function fetchHighPriorityTasks() {
  try {
    const tasks = await db
      .select()
      .from(todos)
      .where(eq(todos.priority, "high"));
    return tasks;
  } catch (_) {
    return false;
  }
}
