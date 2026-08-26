const User = require("../models/User");

// ==========================================
// GET PROFILE
// GET /api/users/profile/:id
// ==========================================

const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    console.log("🔎 Getting Profile:", id);

    const user = await User.findById(id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user,
    });

  } catch (error) {
    console.log(
      "❌ Get Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE PROFILE
// PUT /api/users/profile/:id
// ==========================================

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;

    console.log(
      "📝 Updating Profile:",
      id
    );

    const {
      phone,
      bio,
      education,
      experience,
      github,
      linkedin,
      skills,
    } = req.body;

    // --------------------------------------
    // VALIDATE SKILLS
    // --------------------------------------

    let cleanSkills = [];

    if (Array.isArray(skills)) {
      cleanSkills = skills
        .map((skill) => String(skill).trim())
        .filter((skill) => skill.length > 0);
    }

    // --------------------------------------
    // UPDATE DATA
    // --------------------------------------

    const updateData = {
      phone: phone || "",
      bio: bio || "",
      education: education || "",
      experience: experience || "",
      github: github || "",
      linkedin: linkedin || "",
      skills: cleanSkills,
    };

    const updatedUser =
      await User.findByIdAndUpdate(
        id,
        {
          $set: updateData,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    // --------------------------------------
    // USER NOT FOUND
    // --------------------------------------

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    console.log(
      "✅ Profile Updated:",
      updatedUser._id
    );

    return res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.log(
      "❌ Update Profile Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==========================================
// EXPORT
// ==========================================

module.exports = {
  getProfile,
  updateProfile,
};