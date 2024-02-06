
const Queue = require('../models/Queue')
const BaseService = require('./BaseService')
const CustomError = require("../errors");

class QueueService extends BaseService {
    constructor() {
      super(Queue)
    }

    async getNumberofQueue (id){
        return this.BaseModel.findOne({_id:id}).select(
            'waitersCount'
          )
    }
    async setNumberofQueue (id,status){
        const queue =  await this.BaseModel.findOne({_id:id})
        if (status === "remove") {
            queue.waitersCount = queue.waitersCount -1
        }
        else if (status ==="add") {
            queue.waitersCount = queue.waitersCount +1 
        }
        await queue.save()
        return queue.waitersCount
    }

}

module.exports = new QueueService()

