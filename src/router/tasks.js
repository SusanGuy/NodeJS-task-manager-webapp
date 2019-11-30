const express = require("express");
const router = new express.Router();
const Task = require("../models/tasks");

router.post("/tasks", async(req, res) => {
    const newTask = new Task(req.body);
    try {
        const task = await newTask.save();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/tasks", async(req, res) => {
    try {
        const task = await Task.find();
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.get("/tasks/:id", async(req, res) => {
    const _id = req.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

router.patch("/tasks/:id", async(req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidOperators = updates.every(item => allowedUpdates.includes(item));

    if (!isValidOperators) {
        return res.status(400).send({
            error: "Invalid Operator"
        });
    }

    const id = req.params.id;
    try {
        const task = await Task.findById(id);
        updates.forEach(update => {
            task[update] = req.body[update];
        });
        await task.save();
        if (!task) {
            return res.status(400).send();
        }
        res.send(task);
    } catch (err) {
        res.status(400).send(err);
    }
});

router.delete("/tasks/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const task = await Task.findByIdAndDelete(id);
        if (!task) {
            return res.status(400).send();
        }
        res.send(task);
    } catch (err) {
        res.status(500).send(err);
    }
});

module.exports = router;