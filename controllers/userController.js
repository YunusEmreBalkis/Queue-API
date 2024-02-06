const UserService = require("../services/UserService.js");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createtokenUser,
  checkPermissions,
  assetCheck
} = require("../utils");

class userController {
   async getAllUsers (req, res) {
    const users = await UserService.searchPage();
    res.status(StatusCodes.OK).json({ users });
  };
  
  async getSingleUser (req, res)   {
    const user = await UserService.findById(req.params.id)
  
    assetCheck(user,req.params.id,"user")
    checkPermissions(req.user, user._id);
    res.status(StatusCodes.OK).json({ user });
  };
  
  async showCurrentUser (req, res)   {
    res.status(StatusCodes.OK).json({ user: req.user });
  };
  
   async updateUser (req, res)   {
    const { name, email } = req.body;
    if (!email || !name) {
      throw new CustomError.BadRequestError(
        "Please provide a valid email and name"
      );
    }
  
    const user = await UserService.findOne({ _id: req.user.userId });
    assetCheck(user,req.user.userId ,"user")
    user.email = email;
    user.name = name;
  
    await user.save();
    const tokenUser = createtokenUser(user);
    attachCookiesToResponse({ res, user: tokenUser });
    res.status(StatusCodes.OK).json({ user: tokenUser });
  };
  
  async updateUserPassword (req, res)   {
    const { newPassword, oldPassword } = req.body;
    if (!newPassword || !oldPassword) {
      throw new CustomError.BadRequestError("Please provide both values");
    }
  
    const user = await UserService.findOne({ _id: req.user.userId });
    assetCheck(user,req.user.userId ,"user")
    const isPasswordCorrect = await user.comparePassword(oldPassword);
  
    if (!isPasswordCorrect) {
      throw new CustomError.UnauthenticatedError("Invalid Credentials");
    }
  
    user.password = newPassword;
    await user.save();
  
    res.status(StatusCodes.OK).json({ msg: "Success! Password Updated" });
  };
  
 async changeUserRole (req, res)   {
    const user = await UserService.findOne({ _id: req.params.id});
    assetCheck(user,req.params.id,"user")
    const { role } = req.body;
  
    user.role = role;
    await user.save();
    res
      .status(StatusCodes.OK)
      .json({ msg: `User role succesfully changed with ${user.role}` });
  };

  async showPlaceOfCurrentQueue(req,res,next) {
    try {
      const user = await UserService.showUsersPlaceofQueue(req.user.userId)
      if (user.placeOfCurrentQueue === 0) {
        throw new CustomError.BadRequestError("You are not in the any queue")
      }
      return res.status(200).json({
        success: true,
        message: "OK.",
        user,
        });
    } catch (error) {
        next(error)
    }
}
}



module.exports = new userController()
