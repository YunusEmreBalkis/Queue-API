let BaseModel = null
class BaseService {
  constructor(model) {
    this.BaseModel = model
  }

  create(data) {
    return new this.BaseModel(data).save()
  }

  list(where) {
    return this.BaseModel.find(where || {})
  }

  async searchPage(page, limit, where, search, sort) {
    const queryOptions = {
      ...(where || {}),
    }
    if (search) queryOptions.$text = { $search: search }
    const entries = await this.BaseModel.find(queryOptions)
      .sort(sort || {})
      .skip((page - 1) * limit)
      .limit(limit)
      
    const entryCount = await this.BaseModel.countDocuments(queryOptions)
    return {
      data: entries,
      total: entryCount,
    }
  }

  findById(id) {
    return this.BaseModel.findById(id)
  }

  findOne(where) {
    return this.BaseModel.findOne(where)
  }
  findByQuery(where) {
    return this.BaseModel.find(where)
  }
  update(id, data) {
    return this.BaseModel.findByIdAndUpdate(id, data, { new: true })
  }

  updateOne(where, data) {
    return this.BaseModel.findOneAndUpdate(where, data, { new: true })
  }

  delete(id) {
    return this.BaseModel.findByIdAndDelete(id)
  }

  deleteWhere(where) {
    return this.BaseModel.findOneAndDelete(where)
  }
  deleteOne(where) {
    return this.BaseModel.findOneAndDelete(where)
  }
  async searchDocuments(where,sort,limit){
    const data = await this.BaseModel.find(where).sort(sort).limit(limit)
    return data;
  }
}

module.exports = BaseService