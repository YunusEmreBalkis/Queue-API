module.exports = {
    validateSchema: function (schema) {
        return async (req, res, next) => {
          try {
            await schema.validateAsync(req.body)
            next()
          } catch (error) {
            next(error)
          }
        }
      }
}