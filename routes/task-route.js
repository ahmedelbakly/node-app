import { Router } from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksWithQueryParams,
} from "../controller/task-controller.js";
import { isAuth } from "../helper/isAuth.js";

const taskRouter = Router();

taskRouter.use(isAuth);

// router for creating a new task
// task/create
taskRouter.post("/create", createTask);
// router for getting all tasks
// task/get-all
taskRouter.get("/get-all", getAllTasks);
// router for getting a task by id
// task/get/:id
taskRouter.get("/get/:id", getTaskById);
// router for updating a task
// task/update/:id
taskRouter.patch("/update/:id", updateTaskById);
// router for deleting a task
// task/delete/:id
taskRouter.delete("/delete/:id", deleteTaskById);
taskRouter.get("/getTasksWithQueryParams", getTasksWithQueryParams);


export default taskRouter;
