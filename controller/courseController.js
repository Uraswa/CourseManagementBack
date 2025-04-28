import courseModel from "../model/courseModel.js";

class CourseController {
    async GetCourses(req, res) {
        try {
            const { user } = req;
            const courses = await courseModel.getCourses(user);

            res.json({
                success: true,
                data: {
                    courses
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

    async AddCourse(req, res) {
        try {
            const { user } = req;
            const { name } = req.body;

           
            if (!user.is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Недостаточно прав для создания курса"
                });
            }


            if (!name || name.trim().length < 3 || name.length > 40) {
                return res.status(400).json({
                    success: false,
                    error: "Название курса должно содержать минимум 3 символа и не больше 40 символов!",
                    error_field: "name"
                });
            }

            const course = await courseModel.addCourse(name.trim());

            res.json({
                success: true,
                data: {
                    course_id: course.course_id
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

    async DeleteCourse(req, res) {
        try {
            const { user } = req;
            const { course_id } = req.body;


            if (!user.is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Недостаточно прав для удаления курса"
                });
            }


            const existingCourse = await courseModel.getCourseById(course_id);
            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    error: "Курс не найден"
                });
            }

            const deletedCourse = await courseModel.deleteCourse(course_id);

            res.json({
                success: true,
                data: {
                    course_id: deletedCourse.course_id
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

    async UpdateCourse(req, res) {
        try {
            const { user } = req;
            const { name, course_id } = req.body;


            if (!user.is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Недостаточно прав для обновления курса"
                });
            }


            const existingCourse = await courseModel.getCourseById(course_id);
            if (!existingCourse) {
                return res.status(404).json({
                    success: false,
                    error: "Курс не найден"
                });
            }


            if (!name || name.trim().length < 3 || name.length > 40) {
                return res.status(400).json({
                    success: false,
                    error: "Название курса должно содержать минимум 3 символа и не больше 40 символов!",
                    error_field: "name"
                });
            }

            const updatedCourse = await courseModel.updateCourse(course_id, name.trim());

            res.json({
                success: true,
                data: {
                    course: updatedCourse
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

export default new CourseController();