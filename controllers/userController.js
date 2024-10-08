const User = require('../models/User'); 
const updateUser = async (req, res) => {
    const { username, password } = req.body;
    const userId = req.user._id; 

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.username = username || user.username;
        user.password = password || user.password;
        
        await user.save();

        res.status(200).json({
            _id: user._id,
            username: user.username,
            message: 'User updated successfully',
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { updateUser };
