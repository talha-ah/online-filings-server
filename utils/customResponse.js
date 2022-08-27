/**
 * Returns response object
 * @param {string} message Response message
 * @param {*} data Data to be returned
 * @param {boolean} success Status of the request
 */

function CustomResponse(message, data, success) {
  const res = {}

  if (data) {
    res["pagination"] = {
      page: data.page,
      limit: data.limit,
      totalData: data.totalData,
      totalPages: data.totalPages,
    }

    if (data.response) {
      data = data.response
    }
  }

  return {
    message: message,
    data: data || null,
    success: success == null ? true : success,
    ...res,
  }
}

module.exports = {
  CustomResponse,
}
