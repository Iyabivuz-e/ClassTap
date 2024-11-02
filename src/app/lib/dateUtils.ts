export const getCurrentKigaliTime = () => {
  return new Date().toLocaleString("en-US", {
    timeZone: "Africa/Kigali",
  });
};
