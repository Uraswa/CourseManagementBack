import Model from "../core/Model.js";

class courseModel extends Model{

    async getCourseById(course_id){
        const query = `SELECT *
                   FROM courses
                   WHERE course_id = $1`;
        const result = await this.pool.query(query, [course_id]);
        return result.rows[0];
    }

    async getCourses(user){
        let query = `SELECT 
                    c.course_id,
                    c.name,
                    c.created_date
                   FROM courses c`;

        let params = [];
        if (!user.is_admin) {
            query += ` JOIN user_to_course uc ON uc.course_id = c.course_id and uc.user_id = $${params.length + 1}`;
            params.push(user.user_id);
        }

        const result = await this.pool.query(query, params);
        return result.rows;
    }

    async addCourse(name){
        const query = `INSERT INTO courses (name) VALUES ($1) returning *`;
        return (await this.pool.query(query, [name])).rows[0];
    }

    async deleteCourse(course_id){
        const  query = `DELETE FROM courses WHERE course_id = $1 RETURNING *`;
        return (await this.pool.query(query, [course_id])).rows[0];
    }

    async updateCourse(course_id, name){
        const query = `UPDATE courses SET name = $1 WHERE course_id = $2 RETURNING *`;
        return (await this.pool.query(query, [name, course_id])).rows[0];
    }


}

export default new courseModel();