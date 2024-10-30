import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Tasks.css";
import { useNavigate } from "react-router-dom";

const Tasks = () => {
  let navigate = useNavigate;
  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "",
    creation_date: "",
    due_date: "",
  });

  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState("");

  const username = localStorage.getItem("username");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (username && token) {
      viewTasks();
    } else {
      setError("You need to be logged in to view tasks.");
    }
  }, []);

  //addTask, viewTask
  //TO DO: deleteTask, editTask
  const viewTasks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTasks(response.data);
      console.log("Fetched tasks:", response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      setError("Could not fetch tasks. Please try again later.");
    }
  };

  //DELETE TASK
  const deleteTask = async (id) => {
    try {
      console.log("Current tasks before deletion:", tasks);
      console.log("Deleting task with ID:", id);
      const response = await axios.delete(
        `http://localhost:8080/api/tasks/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: userId,
          },
        }
      );

      if (response.status === 204) {
        console.log("Deleted Task Successfully!");
        setTasks((prevTasks) =>
          prevTasks.filter((task) => task.task_ID !== id)
        );
      }
    } catch (error) {
      console.error("Error in deleting a task: ", error.response?.data);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({ ...prevTask, [name]: value }));
  };
  //ADD TASK
  const addTask = async (e) => {
    e.preventDefault();
    const currentDate = new Date().toISOString().split("T")[0];
    const taskWithDate = { ...task, creation_date: currentDate };

    setError("");
    try {
      await axios.post(
        `http://localhost:8080/api/tasks/user/${userId}/task`,
        taskWithDate,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Task Added Successfully!");
      setTask({ title: "", description: "", priority: "", due_date: "" });
      viewTasks();
    } catch (error) {
      console.error("Error adding task", error.response || error);
      setError(
        error.response?.data?.message || "Adding Task failed. Please try again."
      );
    }
  };

  const sortedTasks = tasks.sort((a, b) => {
    const priorityOrder = { high: 1, medium: 2, low: 3 };
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    }
    return new Date(a.due_date) - new Date(b.due_date);
  });

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case "high":
        return { color: "red" };
      case "medium":
        return { color: "#0056B3" };
      case "low":
        return { color: "green" };
      default:
        return {};
    }
  };

  const priorityOptions = [
    { value: "high", label: "High", color: "red" },
    { value: "medium", label: "Medium", color: "#0056B3" },
    { value: "low", label: "Low", color: "green" },
  ];

  // Archive Task Function
  // idk if this works
  const archiveTask = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/archive/${taskId}/user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTasks((prevTasks) =>
        prevTasks.filter((task) => task.task_ID !== taskId)
      );
    } catch (error) {
      console.error("Error archiving task:", error);
    }
  };

  return (
    <div className="content tasks-content">
      <div className="create-task-form">
        <h3>Create New Task</h3>
        <form onSubmit={addTask}>
          <div className="form-group">
            <input
              className="taskTitle"
              type="text"
              name="title"
              placeholder="Title"
              value={task.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              className="taskDesc"
              type="text"
              name="description"
              placeholder="Short description here..."
              value={task.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group row-group">
            <select
              className="taskPriority"
              name="priority"
              value={task.priority}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Choose Priority
              </option>
              {priorityOptions.map((option) => (
                <option
                  key={option.value}
                  value={option.value}
                  style={{ color: option.color }}
                >
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="due_date" className="dueDateLabel">
              Due Date:
            </label>
            <input
              className="taskDue"
              type="date"
              name="due_date"
              value={task.due_date}
              onChange={handleChange}
              required
            />
          </div>
          <button className="addTask" type="submit">
            {" "}
            Add Task{" "}
          </button>
        </form>
      </div>

      <div className="taskList">
        <h3>Task List</h3>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              <th>Task Description</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Complete</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {sortedTasks.map((task) => (
              <tr key={task.task_ID}>
                <td>
                  <strong>{task.title}</strong>
                  <br />
                  <span className="task-desc">{task.description}</span>
                </td>
                <td style={getPriorityStyle(task.priority)}>
                  {task.priority.charAt(0).toUpperCase() +
                    task.priority.slice(1)}
                </td>
                <td>{task.due_date}</td>
                <td className="completeStatus">
                  <input
                    type="checkbox"
                    onChange={() => archiveTask(task.task_ID)}
                  />
                </td>
                <td>
                  <button onClick={() => handleEdit(task.task_ID)}>Edit</button>
                </td>
                <td>
                  <button onClick={() => deleteTask(task.task_ID)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Tasks;
