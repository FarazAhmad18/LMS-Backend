const User = require("../models/user");

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, bio, avatar } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { name, bio, avatar },
      { new: true }
    ).select("-password");
    res.status(200).json({ success: true, message: "Profile updated", user: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
