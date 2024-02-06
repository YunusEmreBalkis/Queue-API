const Place = require('../models/Place')
const BaseService = require('./BaseService')
const CustomError = require("../errors");

class PlaceService extends BaseService {
    constructor() {
      super(Place)
    }

    async showActives (){
        return this.BaseModel.find({status:"active"}).select(
            '-owner'
          )
    }
    async showAll (){
        return this.BaseModel.find()
    }

}

module.exports = new PlaceService()