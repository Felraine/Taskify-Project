import React, { useEffect, useState } from "react";
import { Grid } from '@mui/material';

import axios from "axios";
import { Box, Typography, LinearProgress, Checkbox } from "@mui/material";

const Home = () => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [totalTasks, setTotalTasks] = useState(0);
  const [tasks, setTasks] = useState([]);
  const [pendingCount, setPendingCount] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [taskStatuses, setTaskStatuses] = useState([]);

  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchTasksData();
    fetchTaskStatuses();
  }, []);

  const fetchTasksData = async () => {
    try {
      const archivedResponse = await axios.get(
        `http://localhost:8080/api/archive/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setCompletedTasks(archivedResponse.data.length);

      const tasksResponse = await axios.get(
        `http://localhost:8080/api/tasks/user/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTasks(tasksResponse.data);
      setTotalTasks(archivedResponse.data.length + tasksResponse.data.length);
    } catch (error) {
      console.error("Error fetching tasks data:", error);
    }
  };

  const fetchTaskStatuses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/tasks/status/statuses/count/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const statuses = response.data;
      setTaskStatuses(statuses);

      setPendingCount(statuses.filter((task) => task.status === "Pending").length);
      setOverdueCount(statuses.filter((task) => task.status === "Overdue").length);
      setCompletedCount(statuses.filter((task) => task.status === "Completed").length);
    } catch (error) {
      console.error("Error fetching task statuses:", error);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "#ff0000"; // Red for high priority
      case "medium":
        return "#007bff"; // Blue for medium priority
      case "low":
        return "#28a745"; // Green for low priority
      default:
        return "#ccc"; // Gray for unknown priority
    }
  };

  // Update task counts and progress dynamically
  const archiveTask = async (taskId) => {
    try {
      await axios.put(
        `http://localhost:8080/api/archive/${taskId}/user/${userId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Refetch the tasks and statuses after updating the backend
      fetchTasksData();
      fetchTaskStatuses();
    } catch (error) {
      console.error("Error archiving task:", error);
    }
  };
  

  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        padding: 3,
        backgroundColor: "#fffa9d",
        minHeight: "calc(100vh - 160px)",
        maxHeight: "calc(100vh - 160px)",
        borderTopLeftRadius: 0,
        borderTopRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}
    >
      {/* Progress Tracker */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#fff",
          borderRadius: 2,
          padding: 3,
          width: "50%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginBottom: 2, fontFamily: "monospace" }}
        >
          Progress Tracker
        </Typography>

        <Grid container spacing={2} justifyContent="center" alignItems="stretch">
          <Grid item xs={3} sx={{ 
            backgroundColor: 'grey', 
            color: 'white', 
            padding: 2, 
            borderRadius: 2, 
            textAlign: 'center', 
            height: '150px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 1
          }}>
            <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>Pending</Typography>
            <Typography variant="h4">{pendingCount}</Typography>
          </Grid>
          <Grid item xs={3} sx={{ 
            backgroundColor: 'red', 
            color: 'white', 
            padding: 2, 
            borderRadius: 2, 
            textAlign: 'center', 
            height: '150px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 1
          }}>
            <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>Overdue</Typography>
            <Typography variant="h4">{overdueCount}</Typography>
          </Grid>
          <Grid item xs={3} sx={{ 
            backgroundColor: 'green', 
            color: 'white', 
            padding: 2, 
            borderRadius: 2, 
            textAlign: 'center', 
            height: '150px', 
            display: 'flex', 
            flexDirection: 'column',
            justifyContent: 'center',
            margin: 1
          }}>
            <Typography variant="h6" sx={{ fontSize: '0.875rem' }}>Completed</Typography>
            <Typography variant="h4">{completedTasks}</Typography>
          </Grid>
      </Grid>






        
        {progress === 100 ? (
          <Typography
            sx={{ color: "green", fontWeight: "bold", fontSize: "1.2em" }}
          >
            🎉 Congratulations! You've completed all tasks!
          </Typography>
        ) : (
          <Typography
            sx={{ color: "orange", fontWeight: "bold", fontSize: "1.2em" }}
          >
            🔄 Keep going! You’re {progress.toFixed(1)}% done. Almost there!
          </Typography>
        )}
        {/*<LinearProgress
          variant="determinate"
          value={progress}
          sx={{
            height: 15,
            borderRadius: 1,
            backgroundColor: "#e0e0e0",
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#ffa500",
            },
          }}
        />*/}
      </Box>

      {/* To-Do List */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          backgroundColor: "#ffe79f",
          borderRadius: 2,
          padding: 3,
          width: "50%",
          boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography
          variant="h5"
          sx={{ textAlign: "center", marginBottom: 2, fontFamily: "monospace" }}
        >
          To Do List
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            maxHeight: "calc(100vh - 240px)",
            overflowY: "auto",
          }}
        >
	      <Box sx={{ marginBottom: 2 }}>
            <Typography
              sx={{
                fontSize: "1rem",
                fontWeight: "bold",
                textAlign: "center",
                marginBottom: 1,
                fontFamily: "monospace",
              }}
            >
              {progress.toFixed(1)}% Completed
            </Typography>
            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 15,
                borderRadius: 1,
                backgroundColor: "#e0e0e0",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#008000",
                },
              }}
            />
          </Box>
          {tasks.map((task) => (
            <Box
              key={task.task_ID}
              sx={{
                display: "flex",
                alignItems: "flex-start",
                gap: 2,
                backgroundColor: "#fff",
                borderRadius: 2,
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
                border: "1px solid #ccc",
                padding: 2,
              }}
            >
              {/* Priority Indicator */}
              <Box
                sx={{
                  width: 12,
                  height: 12,
                  borderRadius: "50%",
                  backgroundColor: getPriorityColor(task.priority),
                  flexShrink: 0,
                }}
              ></Box>

              {/* Task Details */}
              <Box sx={{ 
		              display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  fontFamily: "monospace",
                  marginRight: "10px",

 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: "1.1rem",
                    fontWeight: "bold",
		                marginBottom: 1,
                    fontFamily: "monospace",
                  }}
                >
		        {/* Checkbox */}
              <Checkbox
                  defaultChecked={false}
                  onChange={() => archiveTask(task.task_ID)}
                  sx={{
                   padding: 0,
                  justifyContent: "flex-start",
                  marginRight: "10px",
                  }}
              />
                  {task.title}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "1rem",
                    color: "#555",
			              marginBottom: 1,
                    fontFamily: "monospace",
                  }}
                >
                  {task.description}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "#888",
                    fontStyle: "italic",
                  }}
                >
                  Due: {task.due_date}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
