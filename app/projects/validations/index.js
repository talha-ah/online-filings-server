const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

const id = {
  id: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.projectIdLength,
    "string.empty": errors.projectIdRequired,
    "any.required": errors.projectIdRequired,
  }),
}

const project = {
  name: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.projectNameRequired,
    "any.required": errors.projectNameRequired,
  }),
  dueAt: Joi.date().required().messages({
    "date.base": errors.typeDate,
    "date.empty": errors.projectDueDateRequired,
    "any.required": errors.projectDueDateRequired,
  }),
}

const validations = {
  getAll: (data) => {
    const Validation = Joi.object().keys({
      search: Joi.string().allow("").optional().messages({
        "string.base": errors.typeString,
      }),
      sort: Joi.string().allow("").optional().valid("asc", "desc").messages({
        "string.base": errors.typeString,
        "any.only": errors.sortInvalid,
      }),
      sortType: Joi.string()
        .allow("")
        .optional()
        .valid("startAt", "dueAt")
        .messages({
          "string.base": errors.typeString,
          "any.only": errors.projectSortTypeInvalid,
        }),
    })

    return joiError(Validation.validate(data))
  },
  getOne: (data) => {
    const Validation = Joi.object().keys({
      ...id,
    })

    return joiError(Validation.validate(data))
  },
  createOne: (data) => {
    const Validation = Joi.object().keys({
      ...project,
    })

    return joiError(Validation.validate(data))
  },
  updateOne: (data) => {
    const Validation = Joi.object().keys({
      ...id,
      ...project,
    })

    return joiError(Validation.validate(data))
  },
  addOrMoveTask: (data) => {
    const Validation = Joi.object().keys({
      fromProjectId: Joi.string().allow("").optional().length(24).messages({
        "string.base": errors.typeString,
        "string.length": errors.fromProjectIdLength,
      }),
      toProjectId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.toProjectIdLength,
        "string.empty": errors.toProjectIdRequired,
        "any.required": errors.toProjectIdRequired,
      }),
      taskId: Joi.string().length(24).required().messages({
        "string.base": errors.typeString,
        "string.length": errors.taskIdLength,
        "string.empty": errors.taskIdRequired,
        "any.required": errors.taskIdRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = validations
