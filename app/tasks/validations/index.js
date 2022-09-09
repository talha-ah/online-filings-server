const Joi = require("joi")

const { errors } = require("../../../utils/texts")
const { joiError } = require("../../../utils/helpers")

const id = {
  id: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.taskIdLength,
    "string.empty": errors.taskIdRequired,
    "any.required": errors.taskIdRequired,
  }),
}

const task = {
  name: Joi.string().required().messages({
    "string.base": errors.typeString,
    "string.empty": errors.taskNameRequired,
    "any.required": errors.taskNameRequired,
  }),
  dueAt: Joi.date().required().messages({
    "date.base": errors.typeDate,
    "date.empty": errors.taskDueDateRequired,
    "any.required": errors.taskDueDateRequired,
  }),
  projectId: Joi.string().length(24).required().messages({
    "string.base": errors.typeString,
    "string.length": errors.projectIdLength,
    "string.empty": errors.projectIdRequired,
    "any.required": errors.projectIdRequired,
  }),
}

const validations = {
  getTasks: (data) => {
    const Validation = Joi.object().keys({
      search: Joi.string().allow("").optional().messages({
        "string.base": errors.typeString,
      }),
      status: Joi.string()
        .allow("")
        .optional()
        .valid("pending", "done")
        .messages({
          "string.base": errors.typeString,
          "any.only": errors.taskStatusInvalid,
        }),
      sort: Joi.string().allow("").optional().valid("asc", "desc").messages({
        "string.base": errors.typeString,
        "any.only": errors.sortInvalid,
      }),
      sortType: Joi.string()
        .allow("")
        .optional()
        .valid("startAt", "dueAt", "doneAt")
        .messages({
          "string.base": errors.typeString,
          "any.only": errors.taskSortTypeInvalid,
        }),
      projectId: Joi.string().length(24).optional().allow("").messages({
        "string.base": errors.typeString,
        "string.length": errors.projectIdLength,
      }),
    })

    return joiError(Validation.validate(data))
  },
  getTask: (data) => {
    const Validation = Joi.object().keys({
      ...id,
    })

    return joiError(Validation.validate(data))
  },
  createTask: (data) => {
    const Validation = Joi.object().keys({
      ...task,
    })

    return joiError(Validation.validate(data))
  },
  updateTask: (data) => {
    const Validation = Joi.object().keys({
      ...id,
      ...task,
    })

    return joiError(Validation.validate(data))
  },
  updateStatus: (data) => {
    const Validation = Joi.object().keys({
      ...id,
      status: Joi.string().required().valid("pending", "done").messages({
        "string.base": errors.typeString,
        "any.only": errors.taskStatusInvalid,
        "string.empty": errors.taskStatusRequired,
        "any.required": errors.taskStatusRequired,
      }),
    })

    return joiError(Validation.validate(data))
  },
}

module.exports = validations
