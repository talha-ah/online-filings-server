const hpp = require("hpp")
const cors = require("cors")
const morgan = require("morgan")
const helmet = require("helmet")
const xss = require("xss-clean")
const express = require("express")
const mongoSanitize = require("express-mongo-sanitize")

module.exports = (app) => {
  if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"))
  } else {
    app.use(morgan("combined"))
  }

  app.options("*", cors())
  app.use(cors())
  app.use(mongoSanitize())
  app.use(helmet())
  app.use(xss())
  app.use(hpp())
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))
  return app
}
