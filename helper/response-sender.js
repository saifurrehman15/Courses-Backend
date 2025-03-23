const sendResponse = (res, status, responseData) => {
  return res.status(status).json(responseData);
};

export default sendResponse;
