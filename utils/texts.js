module.exports.errors = {
  error: "There was an error!",

  idRequired: "Id is required",
  idLength: "Id length must be 24 characters",

  typeDate: "Type must be a date",
  typeArray: "Type must be an array",
  typeString: "Value must be a string",
  typeNumber: "Value must be a number",
  typeBoolean: "Value must be a boolean",

  notFound: "Resource not found",
  sortInvalid: "Sort is invalid (asc, desc)",

  taskNotFound: "Task not found",
  taskIdRequired: "Task id is required",
  taskNameRequired: "Task name is required",
  taskStatusRequired: "Task status is required",
  taskDueDateRequired: "Task due date is required",
  taskIdLength: "Task id length must be 24 characters",
  taskStatusInvalid: "Task status is invalid (to-do, done)",

  taskSortTypeInvalid: "Task sort type is invalid (startAt, dueAt, doneAt)",

  projectNotFound: "Project not found",
  projectIdRequired: "Project id is required",
  projectNameRequired: "Project name is required",
  projectDueDateRequired: "Project due date is required",
  projectIdLength: "Project id length must be 24 characters",

  projectSortTypeInvalid: "Project sort type is invalid (startAt, dueAt )",

  fromProjectNotFound: "From project not found",
  toProjectIdRequired: "To project id is required",
  fromProjectIdRequired: "From project id is required",
  fromProjectTaskNotFound: "From project does not have this task",
  toProjectIdLength: "To project id length must be 24 characters",
  fromProjectIdLength: "From project id length must be 24 characters",
}

module.exports.texts = {
  tasks: "Tasks",
  projects: "Projects",
  aggregations: "Aggregations",

  success: "Success",
}
