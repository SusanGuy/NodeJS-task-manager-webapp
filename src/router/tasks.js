const express = require("express");
const router = new express.Router();
const auth = require("../middleware/auth");
const Task = require("../models/tasks");

router.post("/tasks", auth, async(req, res) => {
    const newTask = new Task({
        ...req.body,
        owner: req.user._id
    });
    try {
        const task = await newTask.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/tasks", auth, async(req, res) => {
    const match = {};
    const sort = {};
    if (req.query.completed) {
        match.completed = req.query.completed === "true";
    }
    if (req.query.sortBy) {
        const parts = req.query.sortBy.split(":");
        sort[parts[0]] = parts[1] === "desc" ? -1 : 1;
    }
    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(req.query.limit),
                    skip: parseInt(req.query.skip),
                    sort
                }
            })
            .execPopulate();
        res.send(req.user.tasks);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOne({
            _id,
            owner: req.user._id
        });
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/tasks/:id", auth, async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperators = updates.every(item => allowedUpdates.includes(item));

    if (!isValidOperators) {
        return res.status(400).send({
            error: "Invalid Operator"
        });
    }

    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(400).send();
        }

        updates.forEach(update => {
            task[update] = req.body[update];
        });
        await task.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findOneAndDelete({ _id, owner: req.user._id });
        if (!task) {
            return res.status(400).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;