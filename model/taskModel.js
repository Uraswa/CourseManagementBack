import Model from "../core/Model.js";

class TaskModel extends Model {
    async getTaskById(task_id) {
        const query = `SELECT *
                       FROM tasks
                       WHERE task_id = $1`;
        const result = await this.pool.query(query, [task_id]);
        return result.rows[0];
    }

    async changeTaskStatus(user_id, task_id, status) {
        const query = `INSERT INTO user_to_task (user_id, task_id, status)
                       VALUES ($1, $2, $3)
                       ON CONFLICT (user_id, task_id) 
                       DO UPDATE SET status = $3, 
                                    last_changed_status = $4
                       RETURNING *`;
        const result = await this.pool.query(query, [user_id, task_id, status, new Date().toISOString()]);
        return result.rows[0];
    }

    async getTasks(course_id, user, filter, sorting) {
        let query = `SELECT 
                    t.task_id,
                    t.name,
                    t.text,
                    t.deadline AT TIME ZONE 'UTC' as deadline,
                    t.created_by,
                    t.created_date AT TIME ZONE 'UTC' as created_date,
                    CASE WHEN ut.status IS NULL THEN 0 ELSE ut.status END,
                    ut.last_changed_status
                   FROM tasks t`;

        let params = [];
        query += ` LEFT JOIN user_to_task ut ON ut.task_id = t.task_id AND ut.user_id = $${params.length + 1}`;
        params.push(user.user_id);

        query += ` WHERE t.course_id = $${params.length + 1} `
        params.push(course_id.toString());

        if (filter.status) {
            query += ` AND ut.status IN ($${params.length + 1})`;
            params.push(filter.status.join(", "))
        }

        if (sorting) {

            if (sorting.deadline === "asc") {
                query += " ORDER BY deadline ASC"
            } else if (sorting.deadline === "desc"){
                query += " ORDER BY deadline DESC"
            }

        }

        const result = await this.pool.query(query, params);
        return result.rows;
    }

    async addTask(course_id, name, text, created_by, deadline) {
        const query = `INSERT INTO tasks (course_id, name, text, created_by, deadline) 
                       VALUES ($5, $1, $2, $3, $4) 
                       RETURNING *`;
        return (await this.pool.query(query, [name, text, created_by, deadline, course_id])).rows[0];
    }

    async deleteTask(task_id) {
        const query = `DELETE FROM tasks WHERE task_id = $1 RETURNING *`;
        return (await this.pool.query(query, [task_id])).rows[0];
    }

    async updateTask(task_id, name, text, deadline) {
        const query = `UPDATE tasks 
                       SET name = $1, 
                           text = $2,
                           deadline = $4
                       WHERE task_id = $3 
                       RETURNING *`;
        return (await this.pool.query(query, [name, text, task_id, deadline])).rows[0];
    }
}

export default new TaskModel();