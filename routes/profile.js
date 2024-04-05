const router = require("express").Router();
const {User} = require("../models");
const {upload} = require("../services/avatar-service");
const path = require("path");
const passport = require("passport");
const {isUUID} = require("validator");
const fs = require("fs");
const {userUpdateFilterFields} = require("../utill/filter");

/**
 * @typedef {object} UserProfile
 * @property {string} id
 * @property {string} email
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} companyName
 * @property {string} jobTitle
 * @property {Date} registeredAt
 * @property {string} subscription
 */
/**
 * GET /api/profiles/:userId
 * @summary Get user profile information by user id
 * @tags Profile
 * @param {string} userId.path - ID of the Room
 * @return {UserProfile} 200 - The Result
 * @return {string} 404 - User not found
 * */
router.get("/:userId", passport.authenticate("jwt"), async (req, res) => {
    const userId = req.params.userId;
    if (!isUUID(userId)) {
        return res.status(400).json({error: "Invalid userId format"});
    }
    try {
        const user = await User.findOne({
            where: {
                id: userId,
                isActive: true,
            },
            attributes: {
                exclude: [
                    "refreshToken",
                    "encryptionHash",
                    "encryptedPassword",
                    "resetPasswordToken",
                    "password",
                    "updatedAt",
                    "createdAt",
                ],
                include: [["createdAt", "registeredAt"]],
            },
        });

        if (!user) {
            res.status(404).json({error: "User not found"});
            return;
        }
        res.json(user);
    } catch (error) {
        console.log(error);
    }
});

/**
 * PATCH /api/profiles/:userId
 * @summary Update user profile information by user id
 * @tags Profile
 * @param {string} userId.path - ID of the Room
 * @return {UserProfile} 200 - The Result
 * @return {string} 404 - User not found
 * */
router.patch("/:userId", passport.authenticate("jwt"), async (req, res) => {
    const userId = req.params.userId;
    if (!isUUID(userId)) {
        return res.status(400).json({error: "Invalid userId format"});
    }
    try {
        const user = await User.findOne({
            where: {
                id: userId,
                isActive: true,
            },
            attributes: {
                exclude: [
                    "refreshToken",
                    "encryptionHash",
                    "encryptedPassword",
                    "resetPasswordToken",
                    "password",
                    "updatedAt",
                    "createdAt",
                ],
                include: [["createdAt", "registeredAt"]],
            },
        });
        if (!user) {
            return res.status(404).json({error: "User not found!"});
        }
        const updateData = userUpdateFilterFields(req.body);
        await user.update(updateData);
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error!"});
    }
});
/**
 * POST /api/profiles/:userId/avatar
 * @summary Set user avatar by user id
 * @tags Profile
 * @param {string} userId.path - ID of the Room
 * @body {file} - Avatar image
 * @return {string} 200 - The Result
 * @return {string} 404 - User not found
 * */
router.post("/:userId/avatar", passport.authenticate("jwt"), async (req, res) => {
    const userId = req.params.userId;
    if (!isUUID(userId)) {
        return res.status(400).json({error: "Invalid userId format"});
    }
    try {
        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({error: "User not found!"});
        }
        upload(userId)(req, res, async err => {
            if (err) {
                console.error(err);
                return res.status(500).json({error: err.message});
            }
            const avatarPath = `/public/avatars/${userId}_avatar${path.extname(
                req.file.originalname
            )}`;
            user.avatar = avatarPath;
            await user.save();
            res.json({message: "Avatar added!"});
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error!"});
    }
});
/**
 * DELETE /api/profiles/:userId/avatar
 * @summary Delete user avatar by user id
 * @tags Profile
 * @param {string} userId.path - ID of the Room
 * @return {string} 200 - The Result
 * @return {string} 404 - User not found
 * */
router.delete("/:userId/avatar", passport.authenticate("jwt"), async (req, res) => {
    const userId = req.params.userId;
    if (!isUUID(userId)) {
        return res.status(400).json({error: "Invalid userId format"});
    }
    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({error: "User not found!"});
        }
        const avatarPath = user.avatar;
        if (!avatarPath) {
            return res.status(404).json({error: "Avatar not found!"});
        }
        const fullPath = path.join(__dirname, `../${avatarPath}`);

        await fs.unlink(fullPath, err => {
            if (err) {
                console.log("Avatar delete error: ", err);
            }
        });
        user.avatar = null;
        await user.save();
        res.json({message: "Avatar deleted!"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Server error!"});
    }
});

module.exports = router;
