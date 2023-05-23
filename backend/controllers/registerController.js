const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleRegister = async (req, res) => {
    const { user, pwd } = req.body;
    if (!user || !pwd) {
        return res.status(400).json({ 'message': 'Username and password are required.' });
    }

    // check for duplicate usernames in db
    const duplicate = await User.findOne({ username: user }).exec();
    if (duplicate) {
        return res.sendStatus(409);
    }

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10);
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });
        res.status(201).json({ 'success': `New user ${user} created!` });
    } catch (err) {
        res.status(500).json({ 'message': err.message });
    }
}

module.exports = { handleRegister };