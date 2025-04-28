import userToTaskModel from "../model/userToTaskModel.js";

class UserToTaskController {

    async GetOutdatedReport(req, res) {
        try {
            let {task_id} = req.query;

            let report = await userToTaskModel.getListOfStudentsOutdatedDeadline(task_id);
            console.log(report);
            return res.status(200).json({
                success: true,
                data: {
                    report
                }
            })
        } catch (e) {
            console.log(e);
        }
    }


}

export default new UserToTaskController();