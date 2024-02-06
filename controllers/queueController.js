const QueueService = require("../services/QueueService");
const UserService = require("../services/UserService");
const PlaceService = require("../services/PlaceService");
const { assetCheck } = require("../utils");
const CustomError = require("../errors");
class QueueController {
  async createQueue(req, res, next) {
    try {
      const placeId = req.body.place;
      const place = await PlaceService.findById(placeId);
      assetCheck(place);
      const user = await UserService.findById(req.user.userId);
      if (!user.placeForWork === placeId) {
        throw new CustomError.UnauthorizedError(
          "You are not allowed to create other queue"
        );
      }
      req.body.name = place.name;
      const data = await QueueService.create({
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

  async getAllQueues(req, res, next) {
    try {
      const data = await QueueService.list();
      return res.status(200).json({
        success: true,
        message: "OK.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }
  async getSingleQueue(req, res, next) {
    try {
      const data = await QueueService.findById(req.params.id);
      return res.status(200).json({
        success: true,
        message: "OK.",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async showWaitersCount(req, res, next) {
    try {
      const data = await QueueService.getNumberofQueue(req.params.id);
      return res.status(200).json({
        success: true,
        message: "OK",
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  async deleteQueue(req, res, next) {
    try {
      const { placeId, queueId } = req.params;
      const place = await PlaceService.findById(placeId);
      assetCheck(place);
      if (!req.user.placeForWork === placeId) {
        throw new CustomError.UnauthorizedError(
          "You are not allowed to delete other queue"
        );
      }
      const data = await QueueService.deleteOne({
        _id: queueId,
        user: req.user._id,
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

  async addUserToQueue(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      const worker = await UserService.findById(req.user.userId);
      const queue = await QueueService.findOne({
        place: worker.placeForWork.toString(),
      });
      const place = await PlaceService.findById(worker.placeForWork);
      if (place.bannedUsers.map(userId => userId.toString()).includes(user._id.toString())) {
        throw new CustomError.BadRequestError(
            `You cannot enter this place. If you think this is a mistake, please contact the management of the place.`
        );
    }
    
    
      if (queue.waiters.map(userId => userId.toString()).includes(user._id.toString())) {
        throw new CustomError.BadRequestError(`You are already in the queue`);
      } else {
        queue.waiters.push(user._id);
        queue.waitersCount = queue.waiters.length;
        user.placeOfCurrentQueue = queue.waiters.length;
        user.currentWaitingQueue = queue._id;
      }

      const currentDate = new Date();
      const currentDay = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        currentDate.getDate()
      );
      const analyticObject = place.analyticData.find(
        (entry) => entry.date.toISOString() === currentDay.toISOString()
      );

      if (analyticObject) {
        analyticObject.count += 1;
      } else {
        place.analyticData.push({ date: currentDay, count: 1 });
      }

      await place.save();

      await queue.save();
      await user.save();
      return res.status(200).json({
        success: true,
        message: "OK.",
        data: queue,
        placeOfCurrentQueue: user.placeOfCurrentQueue,
      });
    } catch (error) {
      next(error);
    }
  }

  async removeUserFromQueue(req, res, next) {
    try {
      const { id } = req.params;
      const user = await UserService.findById(id);
      const worker = await UserService.findById(req.user.userId);
      const queue = await QueueService.findOne({
        place: worker.placeForWork.toString(),
      });
      if (user.placeOfCurrentQueue != 1) {
        throw new CustomError.BadRequestError(`His/Her turn did not come yet`);
      }

      if (queue.waiters.includes(user._id)) {
        await queue.waiters.splice(queue.waiters.indexOf(user._id), 1);
      } else {
        throw new CustomError.BadRequestError(`You are not in the queue`);
      }
      queue.waitersCount = queue.waiters.length;
      user.placeOfCurrentQueue = 0;
      await UserService.decreaseNumberOfUsersQueue(queue.waiters);

      await queue.save();
      await user.save();
      const usersReadyAfterFive = await UserService.showUsersWithLowQueuePlace(
        queue
      );
      const usersReadyAfterTen = await UserService.showUsersWithTenQueuePlace(
        queue
      );
      return res.status(200).json({
        success: true,
        message: "OK.",
        data: queue,
        usersReadyAfterFive,
        usersReadyAfterTen,
      });
    } catch (error) {
      next(error);
    }
  }

  async makeQueueEmpty(req, res, next) {
    try {
      const placeId = req.params.id;
      const place = await PlaceService.findById(placeId);
      assetCheck(place);
      if (!req.user.placeForWork === placeId) {
        throw new CustomError.UnauthorizedError(
          "You are not allowed to make empty other queue"
        );
      }
      const queue = await QueueService.findOne(placeId);
      queue.waiters = [];
      await queue.save();

      return res.status(200).json({
        success: true,
        message: "OK.",
        data: queue,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new QueueController();
