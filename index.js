import dotenv from "dotenv"

dotenv.config();
import express from 'express'
import cookieParser from "cookie-parser";
import cors from 'cors'
import Model from "./core/Model.js";
import UserController from "./controller/userController.js";
import authMiddleware from "./middleware/auth-middleware.js";
import CourseController from "./controller/courseController.js";
import CourseMembersController from "./controller/courseMembersController.js";
import TaskController from "./controller/taskController.js";
import notAuthMiddleware from "./middleware/not-auth-middleware.js";

Model.connect();


const app = express()
app.use(express.json())

app.use(cookieParser());
app.use(cors({
    origin: "http://localhost:3000", // или true для любого origin
    credentials: true, // разрешаем куки и авторизационные заголовки
    allowedHeaders: ['Content-Type', 'Authorization']
}));

const router = express.Router()
app.use(router);

router.post("/login", UserController.loginUser.bind(UserController));
router.post("/createUser",  notAuthMiddleware, UserController.createUser.bind(UserController));
router.post("/forgotPassword",  notAuthMiddleware, UserController.forgotPassword.bind(UserController));
router.post("/logout", authMiddleware, UserController.logout.bind(UserController));
router.post("/changePassword",  notAuthMiddleware, UserController.changePassword.bind(UserController));
router.get("/activateAccount",  notAuthMiddleware, UserController.activateAccount.bind(UserController));
router.get("/refreshToken",  notAuthMiddleware, UserController.refreshToken.bind(UserController));

router.get("/getCourseInfo", authMiddleware, CourseController.GetCourseInfo.bind(CourseController));
router.get("/getCourses", authMiddleware, CourseController.GetCourses.bind(CourseController));
router.post("/addCourse", authMiddleware, CourseController.AddCourse.bind(CourseController));
router.post("/deleteCourse", authMiddleware, CourseController.DeleteCourse.bind(CourseController));
router.post("/updateCourse", authMiddleware, CourseController.UpdateCourse.bind(CourseController));

router.get("/getCourseMembers", authMiddleware, CourseMembersController.getCourseMembers.bind(CourseMembersController));
router.post("/updateCourseMembers", authMiddleware, CourseMembersController.updateCourseMembers.bind(CourseMembersController));

router.post("/addTask", authMiddleware, TaskController.AddTask.bind(TaskController));
router.post("/updateTask", authMiddleware, TaskController.UpdateTask.bind(TaskController));
router.post("/deleteTask", authMiddleware, TaskController.DeleteTask.bind(TaskController));
router.get("/getTasks", authMiddleware, TaskController.GetTasks.bind(TaskController));
router.post("/changeTaskStatus", authMiddleware, TaskController.ChangeTaskStatus.bind(TaskController));

router.get('/health', (req, res) => res.status(200).send('OK'));


app.listen(8000, () => {

})
