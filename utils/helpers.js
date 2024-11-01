const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Role = require("../models/Role");
const { FETCH_USER, CREATE_USER, EDIT_USER, DELETE_USER } = require('../validations/permissions')

exports.createDefaultUsers = async () => {
    try {
        const adminUser = await User.findOne({ isAdmin: true });

        if (!adminUser) {
            let adminRole = await Role.findOne({ name: "admin" });
            if (!adminRole) {
                adminRole = new Role({
                    name: "admin",
                    permissions: [],
                });
                await adminRole.save();
                console.log("Admin role created successfully.");
            }

            const newAdmin = new User({
                name: "adminUser",
                email: 'admin@gmail.com',
                password: await bcrypt.hash("securePassword", 10),
                isAdmin: true,
                role: adminRole._id,
            });

            await newAdmin.save();
            console.log("Default admin user created successfully.");
        }

        const basicUser = await User.findOne({ isAdmin: false });
        if (!basicUser) {
            let userRole = await Role.findOne({ name: "superUser" });
            if (!userRole) {
                userRole = new Role({
                    name: "superUser",
                    permissions: [
                        FETCH_USER,
                        CREATE_USER,
                        EDIT_USER,
                    ],
                });
                await userRole.save();
                console.log("User role created successfully.");
            }

            const newUser = new User({
                name: "Test user1",
                email: 'testuser1@gmail.com',
                password: await bcrypt.hash("user1password", 10),
                isAdmin: true,
                role: userRole._id,
            });

            await newUser.save();
            console.log("Default basic user created successfully.");
        }
    } catch (error) {
        console.error("Error creating default admin user:", error);
    }
}