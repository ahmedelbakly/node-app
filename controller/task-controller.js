import { checkUserCan, checkUserRole } from "../helper/authHelpers.js";
import {
  createDocument,
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  updateDocumentById,
} from "../helper/crud-helper-functions.js";
import Task from "../model/task-model.js";

// create new task
const createTask = async (req, res) => {
  // name, description, status, userId
  const userId = req.user.id;

  const { name, description, priority = "low", status = "to do",dueDate } = req.body;
  // fill all the fields
  if (!name || !description) {
    return res.status(400).json({
      message: "Please fill name and description",
    });
  }
  if (req.body.dueDate) {
    const dueDate = new Date(req.body.dueDate);
    const today = new Date();
    if (dueDate < today) {
      return res.status(400).json({
        message: "Due date cannot be in the past",
      });
    }
  }

  try {
    const task = await createDocument(Task, {
      name,
      description,
      userId,
      status,
      priority,
      dueDate: new Date(dueDate),
    });
    return res.status(201).json({
      message: "Task created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// get all tasks
const getAllTasks = async (req, res) => {
  try {
    const tasks = await getDocuments(
      Task,
      {},
      { sort: { createdAt: -1 } },
      "_id name description status userId"
    );
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// get task by id
const getTaskById = async (req, res) => {
  try {
    const task = await getDocumentById(
      Task,
      req.params.id,
      "_id name description status userId"
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
        });
        }
    const userCan = checkUserCan(req.user, task.userId);
    if (!userCan) {
      return res.status(403).json({
      message: "You don't have permission to access this task",
    });

  }

    return res.status(200).json({
      task,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// update task by id
const updateTaskById = async (req, res) => {
  try {
    // check if task found
    const task = await getDocumentById(
      Task,
      req.params.id,
      "_id name description status userId"
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const userCan = checkUserCan(req.user, task.userId);
    if (!userCan) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    if (req.body.dueDate) {
      const dueDate = new Date(req.body.dueDate);
      const today = new Date();
      if (dueDate < today) {
        return res.status(400).json({
          message: "Due date cannot be in the past",
        });
      }
    }

    await updateDocumentById(Task, req.params.id, req.body);
    return res.status(200).json({
      message: "Task updated successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// delete task by id
const deleteTaskById = async (req, res) => {
  try {
    // check if task found
    const task = await getDocumentById(
      Task,
      req.params.id,
      "_id name description status userId"
    );
    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }
    const userCan = checkUserCan(req.user, task.userId);

    console.log("====================================");
    console.log({ userCan });
    console.log("====================================");
    if (!userCan) {
      return res.status(403).json({
        message: "You do not have permission to perform this action",
      });
    }
    await deleteDocumentById(Task, req.params.id);
    return res.status(200).json({
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
// get tasks with Query params
const getTasksWithQueryParams = async (req, res) => {
  try {
    const query = req.query;
    const userCan = checkUserRole(req.user, "admin");
    const tasks = await getDocuments(
      Task,
      query,
      { sort: { createdAt: -1 } },
      "_id name description status userId"
    );
    return res.status(200).json({
      tasks,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

export {
  createTask,
  getAllTasks,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksWithQueryParams,
};
