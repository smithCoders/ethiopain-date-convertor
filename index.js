// Function to parse user input date format (YYYY, MMM, DDD)
function parseDate(yearString, monthNumber, dayString) {
  const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                     'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
  const monthString = monthNames[monthNumber - 1] || 'INVALID_MONTH'; // Handle invalid month numbers

  const month = monthNames.indexOf(monthString.toUpperCase());
  // Convert year string to a number
  const year = parseInt(yearString, 10);

  // Check for invalid input (non-numeric year, invalid month name, missing day)
  if (isNaN(year) || month === -1 || dayString === undefined || isNaN(parseInt(dayString, 10))) {
    throw new Error('Invalid date format. Please provide year (YYYY), month (MMM), and day (DDD).');
  }

  // Create a JavaScript Date object from the parsed values
  return new Date(year, month, parseInt(dayString, 10));
}


// Function to convert Gregorian date to Ethiopian date
function gregorianToEthiopian(gregorianDate) {
  // Check if the input is a valid JavaScript Date object
  if (!(gregorianDate instanceof Date)) {
    throw new TypeError('Input must be a valid JavaScript Date object');
  }

  // Reference date representing Ethiopian year 1 (Gregorian September 15th, 1582)
  const ETHIOPIAN_EPOCH = new Date(1582, 9, 15);

  // Standard month length in the Ethiopian calendar
  const ETHIOPIAN_MONTH_LENGTH = 30;

  // Extract year, month, and day components from the Gregorian date
  const gregorianYear = gregorianDate.getFullYear();
  const gregorianMonth = gregorianDate.getMonth();
  const gregorianDay = gregorianDate.getDate();

  // Calculate the number of days elapsed since the Ethiopian epoch
  const daysSinceEpoch = Math.floor((gregorianDate - ETHIOPIAN_EPOCH) / (1000 * 60 * 60 * 24));

  const ethiopianYear = gregorianYear - 8; // Adjusting for the difference between GC and Ethiopian

  // Calculate the Ethiopian month, handling Pagume (the short 5th or 6th month)
  let ethiopianMonth;
  if (gregorianMonth >= 9 || (gregorianMonth === 8 && gregorianDay > 10)) {
    ethiopianMonth = gregorianMonth - 8; // Months after September in Gregorian map directly
  } else {
    ethiopianMonth = gregorianMonth + 4; // Months before September are shifted 4 positions
    if ((ethiopianYear + 2) % 4 === 0 && gregorianMonth === 8 && gregorianDay > 10) {
      ethiopianMonth = 13; // Pagume in a leap year
    }
  }

  // Adjust ethiopian month to start from 1
  ethiopianMonth += 1;

  // Adjust month names
  const ethiopianMonthNames = ['መስከረም', 'ጥቅምት', 'ኅዳር', 'ታኅሣሥ', 'ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'ጳጉሜ'];

  // Calculate the Ethiopian day, accounting for days exceeding the standard month length
  const ethiopianDay = (daysSinceEpoch % ETHIOPIAN_MONTH_LENGTH) + 1;

  // Return the converted Ethiopian date as an object with year, month (1-based), day, and month name
  return {
    year: ethiopianYear,
    month: ethiopianMonth,
    day: ethiopianDay,
    monthName: ethiopianMonthNames[ethiopianMonth - 1],
  };
}


// Function to convert Ethiopian date to Gregorian date
function ethiopianToGregorian(ethiopianDate) {
  // Reference date representing Ethiopian year 1 (Gregorian September 15th, 1582)
  const ETHIOPIAN_EPOCH = new Date(1582, 9, 15);

  // Extract year, month (0-based for calculations), and day from the Ethiopian date
  const ethiopianYear = ethiopianDate.year;
  const ethiopianMonth = ethiopianDate.month - 1; // Months are 0-based for calculations
  const ethiopianDay = ethiopianDate.day;

  // Calculate the number of days elapsed since the Ethiopian epoch, considering leap years
  const daysSinceEpoch = (ethiopianYear + 7) * 365 +
                          Math.floor((ethiopianYear + 3) / 4) + // Corrected leap year day calculation
                          (ethiopianMonth > 4 || (ethiopianMonth === 4 && ethiopianDay > 5) ? (ethiopianMonth - 3) * 30 + 5 : ethiopianMonth * 30) +
                          (ethiopianDay - 1);

  // Create a JavaScript Date object representing the Gregorian date based on days since epoch
  const gregorianDate = new Date(ETHIOPIAN_EPOCH.getTime() + daysSinceEpoch * (1000 * 60 * 60 * 24));

  // Return the converted Gregorian date as an object with year, month, and day
  return {
    year: gregorianDate.getFullYear(),
    month: gregorianDate.getMonth() + 1,
    day: gregorianDate.getDate(),
  };
}

// Test gregorianToEthiopian()
console.log(gregorianToEthiopian(new Date(2024, 0, 1))); 
