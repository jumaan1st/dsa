import User from "../models/User.js";

export const getUsers = async (req, res) => {
    const users = await User.find();
    res.json(users);
};

export const addUser = async (req, res) => {
    const { name } = req.body;
    const user = await User.create({ name });
    res.status(201).json(user);
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await User.findByIdAndUpdate(id, { name }, { new: true });
    res.json(updated);
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    res.json({ message: "User deleted" });
};
