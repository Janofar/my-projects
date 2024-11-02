require('dotenv').config();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");

exports.register = async (req, res) => {
  const { name, email, password, roleName } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User with this email already exists." });
    }

    const role = await Role.findOne({ name: roleName });
    if (!role) return res.status(400).json({ message: "Role not found" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword, role: role._id });

    await newUser.save().catch(err => {
      console.error("Save error:", err);
      throw err;
    });


    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error registering user", error });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).populate("role");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = jwt.sign(
      {
        id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
      },
      jwtSecretKey
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict',
      maxAge: 3600000
    });
    res.json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error });
  }
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  return res.status(200).render('home');
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select('-password -createdAt -updatedAt')
      .populate({
        path: 'role',
        select: 'name permissions'
      })
      .lean();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving users", error });
  }
};

exports.getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id)
      .select('-password -createdAt -updatedAt')
      .populate({
        path: 'role',
        select: 'name permissions'
      })
      .lean();

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving user", error });
  }
};

exports.dashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (user.isAdmin) {
      return res.status(200).render('adminDashboard', { user });
    }

    return res.status(200).render('userDashboard', { user });

  } catch (error) {
    res.status(500).json({ message: "Error fetching user role", error });
  }
};

exports.updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, roleName } = req.body;

  try {
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (roleName) {
      const role = await Role.findOne({ name: roleName });
      if (!role) {
        return res.status(400).json({ message: "Role not found" });
      }
      user.role = role._id;
    }

    if (name) user.name = name;
    if (email) user.email = email;

    await user.save();

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error });
  }
};


