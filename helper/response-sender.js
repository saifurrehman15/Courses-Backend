const sendResponse = (res, status, responseData) => {
  if (res.headersSent) return; 
  return res.status(status).json(responseData);
};

export default sendResponse;
