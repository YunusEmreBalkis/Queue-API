const User = require("../models/User");
const BaseService = require("./BaseService");
const CustomError = require("../errors");

class UserService extends BaseService {
  constructor() {
    super(User);
  }

  async searchPage(page, limit, where, search, sort, select) {
    const queryOptions = where || {};
    if (search) queryOptions.$text = { $search: search };
    const entries = await this.BaseModel.find(queryOptions)
      .sort(sort || {})
      .skip((page - 1) * limit)
      .limit(limit)
      .select({ ...select, password: 0 });
    const entryCount = await this.BaseModel.countDocuments(where);
    return {
      data: entries,
      total: entryCount,
    };
  }
  async findById(id) {
    return this.BaseModel.findById(id).select("-password");
  }

  async decreaseNumberOfUsersQueue(queueIds) {
    for (const item of queueIds) {
      const customer = await this.findById(item);
      customer.placeOfCurrentQueue = customer.placeOfCurrentQueue - 1;
      await customer.save();
  }
}

  async showUsersWithLowQueuePlace(queue) {
    console.log(queue._id,"burası id olan");
    console.log(queue._id.toString());
    const users = await this.BaseModel.find({
      currentWaitingQueue: queue._id,
      placeOfCurrentQueue: { $gt:0,$lt: 3 },
    }).select("-password");
    return users;
  }
  async showUsersWithTenQueuePlace(queue) {
    const users = await this.BaseModel.find({
      currentWaitingQueue: queue._id.toString(),
      placeOfCurrentQueue: { $gt: 3, $lt: 5  },
    }).select("-password");
    return users;
  }

  async showUsersPlaceofQueue(userId) {
    const user = await this.BaseModel.findOne({ _id: userId })
      .select("name, placeOfCurrentQueue")
    
      return user;
  }
}

module.exports = new UserService();
