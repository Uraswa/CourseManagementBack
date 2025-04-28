import Model from "../core/Model.js";

class courseMembers extends Model {

    async isUserCourseMember(course_id, member_id) {
        let query = 'SELECT * FROM user_to_course WHERE course_id = $1 AND user_id = $2';
        let result = await this.pool.query(query, [course_id, member_id]);
        return !!result.rows[0];
    }

    async getCourseMembers(course_id) {
        let query = `SELECT u.user_id,
                            u.firstname,
                            u.surname,
                            u.patronymic,
                            cc.name
                     FROM user_to_course c
                              join users u on u.user_id = c.user_id
                              join courses cc on cc.course_id = c.course_id
                     WHERE c.course_id = $1`;
        return await this.pool.query(query, [course_id]);
    }

    async getCourseMembersAndPotential(course_id) {
        let query = `SELECT u.user_id,
                            u.firstname,
                            u.surname,
                            u.patronymic,
                            (CASE WHEN uc.user_id IS NOT NULL THEN TRUE ELSE FALSE END) as is_in_course
                     FROM users u
                              LEFT JOIN user_to_course uc ON uc.user_id = u.user_id and uc.course_id = $1
                    WHERE u.is_admin = false
                     `;
        return await this.pool.query(query, [course_id]);
    }

    async updateCourseMembers(course_id, updatedState) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            for (let user_id in updatedState) {
                if (!updatedState[user_id]) {
                    await client.query('DELETE FROM user_to_course WHERE user_id = $1', [user_id])
                } else {
                    await client.query(`INSERT INTO user_to_course (user_id, course_id) 
                                        VALUES ($1, $2)
                                        ON CONFLICT DO NOTHING 
                                        `, [user_id, course_id])
                }
            }

            await client.query('COMMIT');
            return true;
        } catch (e) {
            console.log(e);
        }
        return false;
    }


}

export default new courseMembers();