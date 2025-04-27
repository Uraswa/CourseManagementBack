import express from 'express'
import cookieParser from "cookie-parser";
import cors from 'cors'
import Model from "./core/Model";
import UserController from "./controller/userController.js";
import authMiddleware from "./middleware/auth-middleware.js";
import CourseController from "./controller/courseController.js";
import CourseMembersController from "./controller/courseMembersController.js";
import TaskController from "./controller/taskController.js";

Model.connect();

const app = express()
app.use(express.json())
app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:9000", // или true для любого origin
    credentials: true, // разрешаем куки и авторизационные заголовки
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.post("/login", UserController.loginUser);
app.post("/createUser", UserController.createUser);
app.post("/forgotPassword", UserController.forgotPassword);
app.post("/logout", authMiddleware, UserController.logout);
app.post("/changePassword", UserController.changePassword);
app.get("/activateAccount", UserController.activateAccount);

app.get("/getCourses", authMiddleware, CourseController.GetCourses);
app.post("/addCourse", authMiddleware, CourseController.AddCourse);
app.post("/deleteCourse", authMiddleware, CourseController.DeleteCourse);
app.post("/updateCourse", authMiddleware, CourseController.UpdateCourse);

app.get("/getCourseMembers", authMiddleware, CourseMembersController.getCourseMembers);
app.post("/updateCourseMembers", authMiddleware, CourseMembersController.updateCourseMembers);

app.post("/addTask", authMiddleware, TaskController.AddTask);
app.post("/updateTask", authMiddleware, TaskController.UpdateTask);
app.post("/deleteTask", authMiddleware, TaskController.DeleteTask);
app.get("/getTasks", authMiddleware, TaskController.GetTasks);
app.post("/changeTaskStatus", authMiddleware, TaskController.ChangeTaskStatus);


app.listen(8000, () => {

})
