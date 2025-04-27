import TaskModel from "../model/taskModel.js";
import courseMembers from "../model/courseMembers.js";
import courseModel from "../model/courseModel.js";

class TaskController {
    async AddTask(req, res) {
        try {
            const { course_id, name, text, deadline } = req.body;
            const { user_id, is_admin } = req.user;

            if (!is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Нет прав для созданиыя задачи"
                });
            }

            let course = await courseModel.getCourseById(course_id);
            if (!course) {
                return res.status(403).json({
                    success: false,
                    error: "Курс не существует"
                });
            }

            // Валидация полей
            if (!name || name.trim().length < 3 || name.trim().length > 256) {
                return res.status(400).json({
                    success: false,
                    error: "Название задачи должно содержать минимум 3 символа и не быть больше 256 символов!",
                    error_field: "name"
                });
            }

            if (!text || text.trim().length < 10 || text.trim().length > 5000) {
                return res.status(400).json({
                    success: false,
                    error: "Описание задачи должно содержать минимум 10 символов и не быть больше 5000 символов",
                    error_field: "text"
                });
            }

            if (!deadline || isNaN(Date.parse(deadline))) {
                return res.status(400).json({
                    success: false,
                    error: "Укажите корректную дату дедлайна",
                    error_field: "deadline"
                });
            }

            const deadlineDate = new Date(deadline);
            if (deadlineDate <= new Date()) {
                return res.status(400).json({
                    success: false,
                    error: "Дедлайн должен быть в будущем",
                    error_field: "deadline"
                });
            }

            const task = await TaskModel.addTask(course_id, name, text, user_id, deadline);

            res.json({
                success: true,
                data:{
                    task_id: task.task_id
                }
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: "Unknown error"
            });
        }
    }

    async UpdateTask(req, res) {
        try {
            const { task_id } = req.params;
            const { name, text, deadline } = req.body;
            const { user_id, is_admin } = req.user;

            if (!is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Нет прав для редактирования этой задачи"
                });
            }

            // Проверка существования задачи
            const existingTask = await TaskModel.getTaskById(task_id);
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: "Задача не найдена"
                });
            }

            // Валидация полей
            if (!name || name.trim().length < 3 || name.trim().length > 256) {
                return res.status(400).json({
                    success: false,
                    error: "Название задачи должно содержать минимум 3 символа и не быть больше 256 символов!",
                    error_field: "name"
                });
            }

            if (!text || text.trim().length < 10 || text.trim().length > 5000) {
                return res.status(400).json({
                    success: false,
                    error: "Описание задачи должно содержать минимум 10 символов и не быть больше 5000 символов",
                    error_field: "text"
                });
            }

            if (deadline && isNaN(Date.parse(deadline))) {
                return res.status(400).json({
                    success: false,
                    error: "Укажите корректную дату дедлайна",
                    error_field: "deadline"
                });
            }

            const deadlineDate = new Date(deadline);
            if (deadlineDate <= new Date()) {
                return res.status(400).json({
                    success: false,
                    error: "Дедлайн должен быть в будущем",
                    error_field: "deadline"
                });
            }

            const updatedTask = await TaskModel.updateTask(
                task_id,
                name || existingTask.name,
                text || existingTask.text,
                deadline || existingTask.deadline
            );

            res.json({
                success: true,
                data:{
                    task: updatedTask
                }
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: "Unknown error"
            });
        }
    }

    async DeleteTask(req, res) {
        try {
            const { task_id } = req.params;
            const { user_id, is_admin } = req.user;


            if (!is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Нет прав для удаления этой задачи"
                });
            }

            const existingTask = await TaskModel.getTaskById(task_id);
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: "Задача не найдена"
                });
            }

            const deletedTask = await TaskModel.deleteTask(task_id);

            res.json({
                success: true,
                data:{
                    task_id: deletedTask.task_id
                }
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: "Unknown error"
            });
        }
    }

    async GetTasks(req, res) {
        try {
            let { status, sorting, course_id } = req.query;
            const { user } = req;

            const filter = {};
            if (status) {
                status = JSON.parse(status);
                filter.status = Array.isArray(status) ? status : [status];
            }

            if (sorting) {
                sorting = JSON.parse(sorting);
            }

            const tasks = await TaskModel.getTasks(course_id, user, filter, sorting);

            res.json({
                success: true,
                data:{
                    tasks
                }
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: "Unknown error"
            });
        }
    }

    async ChangeTaskStatus(req, res) {
        try {
            const { task_id } = req.params;
            const { status } = req.body;
            const { user_id } = req.user;


            const existingTask = await TaskModel.getTaskById(task_id);
            if (!existingTask) {
                return res.status(404).json({
                    success: false,
                    error: "Задача не найдена"
                });
            }

            if (!await courseMembers.isUserCourseMember(existingTask.course_id, user_id)){
                return res.status(404).json({
                    success: false,
                    error: "Вы не являетесь участником курса"
                });
            }


            if (status === undefined || isNaN(parseInt(status))) {
                return res.status(400).json({
                    success: false,
                    error: "Укажите корректный статус",
                    error_field: "status"
                });
            }

            const result = await TaskModel.changeTaskStatus(user_id, task_id, status);

            res.json({
                success: true,
                data:{
                    status: result.status,
                    last_changed_status: result.last_changed_status
                }
            });

        } catch (e) {
            console.error(e);
            res.status(500).json({
                success: false,
                error: "Unknown error"
            });
        }
    }
}

export default new TaskController();