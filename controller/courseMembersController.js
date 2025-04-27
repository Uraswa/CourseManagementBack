import courseMembers from "../model/courseMembers.js";

class CourseMembersController {
    async getCourseMembers(req, res) {
        try {
            const { user } = req;
            const { course_id } = req.query;

            // Проверка прав (только для админов)
            if (!user.is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Недостаточно прав для просмотра участников курса"
                });
            }

            const members = await courseMembers.getCourseMembers(course_id);

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
            const { course_id } = req.params;
            const { updatedState } = req.body;

            // Проверка прав (только для админов)
            if (!user.is_admin) {
                return res.status(403).json({
                    success: false,
                    error: "Недостаточно прав для редактирования участников курса"
                });
            }

            // Валидация входных данных
            if (!updatedState || typeof updatedState !== 'object') {
                return res.status(400).json({
                    success: false,
                    error: "Неверный формат данных для обновления",
                    error_field: "updatedState"
                });
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