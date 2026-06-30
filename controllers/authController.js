const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authService = require("../services/authService");

async function login(req, res) {

    try {

        const { email, password } = req.body;

        const user = await authService.getUserByEmail(email);

        if (!user) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.PasswordHash
        );

        if (!validPassword) {
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign(

            {
                userId: user.UserId,
                role: user.RoleName
            },

            process.env.JWT_SECRET,

            {
                expiresIn: process.env.JWT_EXPIRES_IN
            }

        );

        res.json({

            message: "Login successful",

            token,

            user: {

                id: user.UserId,

                fullName: user.FullName,

                email: user.Email,

                role: user.RoleName

            }

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

}

module.exports = {

    login

};