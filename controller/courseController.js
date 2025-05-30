import courseModel from "../model/courseModel.js";
import courseMembers from "../model/courseMembers.js";

class CourseController {
    
    async GetCourseInfo(req, res) {
        try {
            const { user } = req;
            const {course_id} = req.query

            const course = await courseModel.getCourseById(course_id)
            
            if (!course) {
                return res.status(200).json({
                    success: false,
                    error: "Курс не найден"
                });
            }


            if (!user.is_admin && !await courseMembers.isUserCourseMember(course_id, user.user_id)){
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав"
                });
            }

            res.json({
                success: true,
                data: {
                    course
                }
            });

        } catch (e) {
            console.error(e);
            res.status(200).json({
                success: false,
                error: "Unknown error"
            });
        }
    }
    
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
            res.status(200).json({
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
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав для создания курса"
                });
            }


            if (!name || name.trim().length < 3 || name.length > 40) {
                return res.status(200).json({
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
            res.status(200).json({
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
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав для удаления курса"
                });
            }


            const existingCourse = await courseModel.getCourseById(course_id);
            if (!existingCourse) {
                return res.status(200).json({
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
            res.status(200).json({
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
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав для обновления курса"
                });
            }


            const existingCourse = await courseModel.getCourseById(course_id);
            if (!existingCourse) {
                return res.status(200).json({
                    success: false,
                    error: "Курс не найден"
                });
            }


            if (!name || name.trim().length < 3 || name.length > 40) {
                return res.status(200).json({
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
            res.status(200).json({
                success: false,
                error: "Unknown error"
            });
        }
    }
}

export default new CourseController();