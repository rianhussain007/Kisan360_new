// Logger utility
export const logError = (message: string, error?: any) => {
  console.error(message, error);
};

export const logInfo = (message: string, data?: any) => {
  console.log(message, data);
};

export const logWarn = (message: string, data?: any) => {
  console.warn(message, data);
};
