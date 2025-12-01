"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const task_service_1 = require("../services/task.service");
const types_1 = require("../types");
const taskService = new task_service_1.TaskService();
class TaskController {
    async create(req, res) {
        try {
            const task = await taskService.create(req.body);
            res.status(201).json({ success: true, data: task });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async findAll(req, res) {
        try {
            const page = Number(req.query.page) || 1;
            const limit = Number(req.query.limit) || 10;
            const siteId = req.query.siteId;
            const assignedTo = req.query.assignedTo;
            const status = req.query.status;
            const priority = req.query.priority;
            const organizationId = req.user?.role === types_1.UserRole.SUPER_ADMIN
                ? req.query.organizationId
                : req.user?.organizationId;
            const result = await taskService.findAll({
                page,
                limit,
                siteId,
                assignedTo,
                status,
                priority,
                organizationId
            });
            res.json({ success: true, ...result });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    async findById(req, res) {
        try {
            const task = await taskService.findById(req.params.id);
            res.json({ success: true, data: task });
        }
        catch (error) {
            res.status(404).json({ success: false, error: error.message });
        }
    }
    async update(req, res) {
        try {
            const task = await taskService.update(req.params.id, req.body);
            res.json({ success: true, data: task });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async delete(req, res) {
        try {
            await taskService.delete(req.params.id);
            res.json({ success: true, message: 'Task deleted' });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    async updateStatus(req, res) {
        try {
            const { status } = req.body;
            const task = await taskService.updateStatus(req.params.id, status);
            res.json({ success: true, data: task });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map