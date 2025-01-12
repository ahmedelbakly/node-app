import { Router } from "express";

import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksWithQueryParams,
  getAllTasksSearch,
} from "../controller/task-controller.js";
import { isAuth } from "../helper/isAuth.js";

const taskRouter = Router();

// Apply authentication middleware to all routes
// Middleware: isAuth
taskRouter.use(isAuth);

// Route to create a new task
// Endpoint: POST /task/create
// Description: Creates a new task with the provided details
taskRouter.post("/create", createTask);

// Route to get all tasks
// Endpoint: GET /task/get-all
// Description: Retrieves a list of all tasks
taskRouter.get("/get-all", getAllTasks);

// Route to get a task by ID
// Endpoint: GET /task/get/:id
// Description: Retrieves the details of a specific task using its ID
taskRouter.get("/get/:id", getTaskById);

// Route to update a task by ID
// Endpoint: PATCH /task/update/:id
// Description: Updates the details of a specific task using its ID
taskRouter.patch("/update/:id", updateTaskById);

// Route to delete a task by ID
// Endpoint: DELETE /task/delete/:id
// Description: Deletes a specific task using its ID
taskRouter.delete("/delete/:id", deleteTaskById);

// Route to get tasks with query parameters
// Endpoint: GET /task/getTasksWithQueryParams
// Description: Retrieves tasks based on specific query parameters (e.g., filters or search criteria)
taskRouter.get("/getTasksWithQueryParams", getTasksWithQueryParams);

// Route to get all tasks with search
// Endpoint: GET /task/get-all
// Description: Retrieves a list of all tasks
taskRouter.get("/get-all-search", getAllTasksSearch);

export default taskRouter;
