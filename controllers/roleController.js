const Role = require("../models/Role");

exports.addRole = async (req, res) => {
  const { name, permissions } = req.body;

  try {
    const existingRole = await Role.findOne({ name });
    if (existingRole) {
      return res.status(400).json({ message: "Role already exists" });
    }

    const newRole = new Role({ name, permissions });
    await newRole.save();

    res.status(201).json({ message: "Role added successfully", role: newRole });
  } catch (error) {
    res.status(500).json({ message: "Error adding role", error });
  }
};
