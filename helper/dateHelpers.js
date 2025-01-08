// Get Current Date and Time
export const getCurrentDateTime = () => {
    return new Date().toISOString();
  };
  
  // Format Date (YYYY-MM-DD)
  export const formatDate = (date) => {
    return new Date(date).toISOString().split('T')[0];
  };
  
  // Add Days to a Date
  export const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  };
  