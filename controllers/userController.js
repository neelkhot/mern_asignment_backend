
const mongoose = require("mongoose");
const User = require("../models/User"); 


exports.addUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();

    res.status(201).json({
      message: "User added successfully",
      user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};



exports.getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const totalUsers = await User.countDocuments();

    const users = await User.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addUsersBulk = async (req, res) => {
  try {
    const users = req.body;

    if (!Array.isArray(users)) {
      return res.status(400).json({
        message: "Request body must be an array",
      });
    }

    const result = await User.insertMany(users, {
      ordered: false, 
    });

    res.status(201).json({
      message: "Users added successfully",
      count: result.length,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};


exports.searchUsers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || !q.trim()) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const searchConditions = [
      { firstName: { $regex: q, $options: "i" } },
      { lastName: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { mobile: { $regex: q, $options: "i" } },
    ];

    if (mongoose.Types.ObjectId.isValid(q)) {
      searchConditions.push({ _id: q });
    }

    const users = await User.find({
      $or: searchConditions,
    }).sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error.message);
    res.status(500).json({
      message: "Internal server error",
    });
  }
};



exports.updateUserStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ message: "Status is required" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      message: "Status updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
