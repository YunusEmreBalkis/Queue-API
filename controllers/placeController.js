const PlaceService = require("../services/PlaceService");
const CustomError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const {
  attachCookiesToResponse,
  createtokenUser,
  checkPermissions,
  assetCheck,
} = require("../utils");
const UserService = require("../services/UserService");

class placeController {
  
    async createPlaceRequest(req, res, next) {
        try {
            req.body.status = "pending"
            console.log(req.user.userId);
            req.body.owner = req.user.userId
            const data = await PlaceService.create({
              ...req.body,
            });
            return res.status(200).json({
              success: true,
              message: "OK.",
              data,
            });
          } catch (error) {
            next(error);
          }
  }

  async confirmPlaceRequest(req,res,next){
    try {
        const {id} = req.params

        const place = await PlaceService.findById(id)
        assetCheck(place)
        place.status = "confirmed"
        const user = await UserService.findById(place.owner)
        user.role = "owner"
        user.placeForWork = place._id
        await place.save()
        await user.save()
        return res.status(200).json({data:place,message:"OK",success:true})

    } catch (error) {
        next(error)
    }
  }

  async getAllPlaces(req,res,next){
    try {
        let data;
        if (req.user.role === "admin") {
          data = await PlaceService.showAll()
          console.log(req.user);
        }
        else {
          data = await PlaceService.showActives();
        }
        return res.status(200).json({
            success: true,
            message: "OK.",
            data,
          });

    } catch (error) {
        next(error)
    }
  }
  
  async banUser(req,res,next){
    try {

        const {id} = req.params
        const owner = await UserService.findById(req.user.userId);
        const user = await UserService.findById(id);
        const place = await PlaceService.findById(owner.placeForWork);
        await place.bannedUsers.push(user);
        await place.save()
        return res.status(200).json({
            success: true,
            message: "OK.",
            data:place.bannedUsers
          });

    } catch (error) {
        next(error)
    }
  }
  async updatePlace(req,res,next){
    try {

        const {placeid} = req.params
        const data = await PlaceService.updateOne(
            { _id: id, user: req.user._id },
            req.body
          )
          assetCheck(data)
        return res.status(200).json({
            success: true,
            message: "OK.",
            data,
          });

    } catch (error) {
        next(error)
    }
  }
  async deletePlace(req,res,next){
    try {
      let data ;
        const {id} = req.params
        if (req.user.role === "admin") {
           data = await PlaceService.deleteOne(
            { _id: id },
          )
        }
        else{
          data = await PlaceService.deleteOne(
            { _id: id, user: req.user._id },
          )
        }
        
          assetCheck(data)
        return res.status(200).json({
            success: true,
            message: "OK.",
            data:null,
          });

    } catch (error) {
        next(error)
    }
  }

}

module.exports = new placeController();
