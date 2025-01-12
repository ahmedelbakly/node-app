import { checkUserCan, checkUserRole } from "../helper/authHelpers.js";
import {
  createDocument,
  deleteDocumentById,
  getDocumentById,
  getDocuments,
  updateDocumentById,
} from "../helper/crud-helper-functions.js";
import { errorResponse, successResponse } from "../helper/responseHelpers.js";
import Role from "../model/role-model.js";
import Task from "../model/task-model.js";
import User from "../model/user-model.js";
import httpStatus from "http-status";

// create new task
const createTask = async (req, res) => {
  // name, description, status, userId
  const { id, role } = req.user;

  const adminId = role === "admin" ? id : (await User.findById(id))?.adminId;

  const {
    name,
    priority = "low",
    status = "to do",
    dueDate,
    userId,
  } = req.body;
  // fill all the field
  if (!name || !dueDate) {
    return errorResponse(
      res,
      "Please enter all fields",
      httpStatus.BAD_REQUEST
    );
  }
  if (req.body.dueDate) {
    const dueDate = new Date(req.body.dueDate);
    const today = new Date();
    if (dueDate < today) {
      return errorResponse(
        res,
        "Due date cannot be in the past",
        httpStatus.BAD_REQUEST
      );
    }
  }

  try {
    const task = await createDocument(Task, {
      name,
      userId,
      status,
      priority,
      dueDate: new Date(dueDate),
      adminId,
    });
    successResponse(res, "Task created successfully", task);
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// get all tasks
const getAllTasks = async (req, res) => {
  const { id: userId, role } = req.user;
  const user = await User.findById(userId).select("adminId role");
  const userPermissions = await Role.findById(user?.role || null);

  const adminId = role === "admin" ? userId : user?.adminId;

  try {
    if (role === "admin" || userPermissions?.tasks?.add) {
      const tasks = await getDocuments(
        Task,
        { adminId: adminId },
        { sort: { createdAt: -1 } },
        "_id name status priority dueDate ",
        "userId"
      );
      return successResponse(
        res,
        "Tasks retrieved successfully",
        tasks,
        httpStatus.OK
      );
    }

    const tasks = await getDocuments(
      Task,
      { userId: userId },
      { sort: { createdAt: -1 } },
      "_id name  status priority dueDate ",
      "userId"
    );
    return successResponse(
      res,
      "Tasks retrieved successfully",
      tasks,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

const getAllTasksSearch = async (req, res) => {
  const { id: userId, role } = req.user;

  const { status, priority } = req.query;

  const statusInSearch = status ? status : null;
  const priorityInSearch = priority ? priority : null;

  const user = await User.findById(userId).select("adminId role");
  const userPermissions = await Role.findById(user?.role || null);

  const adminId = role === "admin" ? userId : user?.adminId;

  try {
    if (role === "admin" || userPermissions?.tasks?.add) {
      let query = {
        adminId: adminId,
      };

      if (statusInSearch) {
        query.status = statusInSearch;
      }

      if (priorityInSearch) {
        query.priority = priorityInSearch;
      }
      const tasks = await getDocuments(
        Task,
        query,
        { sort: { createdAt: -1 } },
        "_id name status priority dueDate ",
        "userId"
      );
      return successResponse(
        res,
        "Tasks retrieved successfully",
        tasks,
        httpStatus.OK
      );
    }

    const tasks = await getDocuments(
      Task,
      query,
      { sort: { createdAt: -1 } },
      "_id name  status priority dueDate ",
      "userId"
    );
    return successResponse(
      res,
      "Tasks retrieved successfully",
      tasks,
      httpStatus.OK
    );
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// get task by id
const getTaskById = async (req, res) => {
  try {
    const task = await getDocumentById(
      Task,
      req.params.id,
      "_id name description status priority dueDate ",
      "userId"
    );
    if (!task) {
      return errorResponse(res, "Task not found", httpStatus.NOT_FOUND);
    }

    return successResponse(res, "Task retrieved successfully", task);
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR);
  }
};

// update task by id
const updateTaskById = async (req, res) => {
  try {
    // check if task found
    const task = await getDocumentById(
      Task,
      req.params.id,
      "_id name description status priority dueDate "
    );
    if (!task) {
      return errorResponse(res, "Task not found", httpStatus.NOT_FOUND);
    }

    if (req.body.dueDate) {
      const dueDate = new Date(req.body.dueDate);
      const today = new Date();
      if (dueDate < today) {
        return errorResponse(
          res,
          "Due date cannot be in the past",
          httpStatus.BAD_REQUEST
        );
      }
    }

    await updateDocumentById(Task, req.params.id, req.body);
    return successResponse(res, "Task updated successfully", task);
  } catch (error) {
    return errorResponse(res, error.message, httpStatus.INTERNAL_SERVER_ERROR);
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
      errorResponse(res, "Task not found", httpStatus.NOT_FOUND);
    }

    await deleteDocumentById(Task, req.params.id);
    return successResponse(
      res,
      "Task deleted successfully",
      task,
      httpStatus.OK
    );
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
  getAllTasksSearch,
  getTaskById,
  updateTaskById,
  deleteTaskById,
  getTasksWithQueryParams,
};
