const { CustomError } = require("./customError")

// Parse error
module.exports.parseError = (err) => {
  let name = err.name || ""
  let status = err.status || 500
  let message = err.message || ""

  return { message, status, name }
}

// Parse joi error
module.exports.joiError = ({ error, value }) => {
  if (error) {
    const { details } = error
    const message = details.map((i) => i.message.replace(/"/g, "")).join(",")

    throw new CustomError(message, 405)
  }
  return value
}
