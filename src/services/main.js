export const getFormattedDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  // Create the formatted date-time string separated with underscores
  const formattedDateTime = `${year}${month}${day}${hours}${minutes}${seconds}_`;

  // Update the data property
  return formattedDateTime;
};
export const formatDateAndTime = (dateStr) => {
  const date = new Date(dateStr);
  // return new Intl.DateTimeFormat('en-US', {
  // 	dateStyle: 'medium',
  // 	timeStyle: 'short',
  // 	timeZone: 'UTC', // or use your local timeZone like 'Africa/Accra'
  // }).format(date);

  // Format date part: Jun 9, 2025
  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  // Format time part: 3:18 PM
  const timePart = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZone: "UTC",
  });

  return `${datePart} - ${timePart}`;
};
export const formatDate = (dateStr) => {
  const date = new Date(dateStr);

  const datePart = date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });

  return `${datePart}`;
};

export const formatNumber = (num) => {
  // if(num == null || num === undefined) return 0;
  // return parseFloat(num).toFixed(2)
  if (num) {
    return parseFloat(num).toFixed(2);
  } else {
    return 0;
  }
};
