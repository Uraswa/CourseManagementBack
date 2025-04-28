import courseMembers from "../model/courseMembers.js";
import courseModel from "../model/courseModel.js";

class CourseMembersController {
    async getCourseMembers(req, res) {
        try {
            const { user } = req;
            const { course_id } = req.query;

            // Проверка прав (только для админов)
            if (!user.is_admin) {
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав для просмотра участников курса"
                });
            }

            const members = await courseMembers.getCourseMembersAndPotential(course_id);

            res.json({
                success: true,
                data: {
                    members: members.rows
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

    async updateCourseMembers(req, res) {
        try {
            const { user } = req;
            const { updatedState, course_id } = req.body;

            // Проверка прав (только для админов)
            if (!user.is_admin) {
                return res.status(200).json({
                    success: false,
                    error: "Недостаточно прав для редактирования участников курса"
                });
            }

            // Валидация входных данных
            if (!updatedState || typeof updatedState !== 'object') {
                return res.status(200).json({
                    success: false,
                    error: "Неверный формат данных для обновления",
                    error_field: "updatedState"
                });
            }

            let course = await courseModel.getCourseById(course_id);
            if (!course) {
                return res.status(200).json({
                    success: false,
                    error: "Курс не найден"
                })
            }

            const result = await courseMembers.updateCourseMembers(course_id, updatedState);

            if (!result) {
                return res.status(500).json({
                    success: false,
                    error: "Не удалось обновить участников курса"
                });
            }

            res.json({
                success: true,
                data: {
                    updated: true
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

export default new CourseMembersController();