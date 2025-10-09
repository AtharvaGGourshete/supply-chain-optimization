import User from '../models/users.js';

export const getUserProfile = async (req, res) => {
    // The user object is attached to the request by the isAuthenticated middleware
    const user = await User.findById(req.user._id);

    if (user) {
        res.status(200).json(user); // Send the full user object
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

export const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        // Update fields if they are present in the request body
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.photoUrl = req.body.photoUrl || user.photoUrl;

        // You can add logic to update the password if needed
        // if (req.body.password) {
        //     user.password = req.body.password;
        // }

        const updatedUser = await user.save();
        
        res.status(200).json(updatedUser);

    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
