import Model from "../core/Model.js";

class userToTaskModel extends Model {

    async getListOfStudentsOutdatedDeadline(task_id){
        let query = `SELECT u.user_id,
                            u.firstname,
                            u.surname,
                            u.patronymic,
                            (CASE WHEN ut.status IS NULL THEN 0 ELSE ut.status END)  as status,
                            (CASE
                                 WHEN ut.last_changed_status IS NULL THEN NULL
                                 ELSE ut.last_changed_status END) AT TIME ZONE 'UTC' as last_status_changed
                     FROM tasks t
                              JOIN user_to_course uc on uc.course_id = t.course_id
                              JOIN users u ON u.user_id = uc.user_id
                              LEFT JOIN user_to_task ut on ut.user_id = uc.user_id and ut.task_id = $1
                     WHERE t.task_id = $1
                       and t.deadline < now()
                       and (ut.last_changed_status IS NULL
                         or ut.last_changed_status > t.deadline)`;
        let result = await this.pool.query(query, [task_id]);
        return result.rows;
    }
}


export default new userToTaskModel();