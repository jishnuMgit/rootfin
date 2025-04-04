import bcrypt from 'bcrypt';
import User from '../model/UserModel.js';

export const SignUp = async (req, res) => {
    try {
        const { username, email, password, locCode, power } = req.body;
        console.log(username, email, password, locCode, power);

        if (!password) {
            return res.status(400).json({ message: "Password is required." });
        }

        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Username or email already exists.' });
        }
        const passWord = 'test';

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            username,
            email,
            power,
            password: hashedPassword,
            locCode,
        });

        await newUser.save();

        res.status(201).json({
            message: 'User created successfully, and mandatory training assigned.',
            user: newUser,
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            message: 'An error occurred while creating the user.',
            error: error.message,
        });
    }
};







export const Login = async (req, res) => {
    try {
        const { email, EmpId: password } = req.body;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid email or password.' });
        }

        // Generate JWT token


        res.status(200).json({
            message: 'Login successful',

            user: {
                id: user._id,
                username: user.username,
                power: user.power,
                email: user.email,
                locCode: user.locCode,
            },
        });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({
            message: 'An error occurred during login.',
            error: error.message,
        });
    }
};

