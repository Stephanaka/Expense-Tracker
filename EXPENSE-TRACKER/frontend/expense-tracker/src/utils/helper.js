import moment from "moment";
import 'moment/locale/bg';

moment.locale('bg');

// Utility functions for date formatting, translation, and data validation

// Helper function to format date in Bulgarian with ordinal numbers
const formatDateBG = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const monthNames = ['янв.', 'февр.', 'март', 'апр.', 'май', 'юни', 'юли', 'авг.', 'сеп.', 'окт.', 'ное.', 'дек.'];
    const monthShort = monthNames[d.getMonth()];
    
    // Add ordinal suffix in Bulgarian
    let ordinal = '-ти';
    if (day === 1 || day === 21 || day === 31) ordinal = '-ви';
    else if (day === 2 || day === 22) ordinal = '-ри';
    
    return `${day}${ordinal} ${monthShort}`;
};

// Helper function to format date with full year in Bulgarian
export const formatDateBGFull = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const year = d.getFullYear();
    const monthNames = ['янв.', 'февр.', 'март', 'апр.', 'май', 'юни', 'юли', 'авг.', 'сеп.', 'окт.', 'ное.', 'дек.'];
    const monthShort = monthNames[d.getMonth()];
    
    // Add ordinal suffix in Bulgarian
    let ordinal = '-ти';
    if (day === 1 || day === 21 || day === 31) ordinal = '-ви';
    else if (day === 2 || day === 22) ordinal = '-ри';
    
    return `${day}${ordinal} ${monthShort} ${year}`;
};

// Translation map for expense categories
const expenseTranslations = {
    "Rent": "Наем",
    "Groceries": "Хранителни стоки",
    "Transport": "Транспорт",
    "Food": "Храна",
    "Entertainment": "Развлечение",
    "Utilities": "Коммунални услуги",
    "Health": "Здравство",
    "Travel": "Пътуване",
    "Music Subscription": "Музикален абонамент",
    "Loan": "Заем",
};

// Translation map for income sources
const incomeTranslations = {
    "Salary": "Заплата",
    "Freelance": "Фрилансър",
    "Business": "Бизнес",
    "Investment": "Инвестиция",
    "Bonus": "Бонус",
    "Youtube Revenue": "YouTube приход",
    "Business Income": "Бизнес приход",
};

export const translateCategory = (category) => {
    // Return Bulgarian translation for expense category, or original if not found in map
    return expenseTranslations[category] || category;
};

export const translateSource = (source) => {
    // Return Bulgarian translation for income source, or original if not found in map
    return incomeTranslations[source] || source;
};

export const validateEmail = (email) => {
    // Validate email format using regex - checks for proper email structure (text@domain.text)
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

export const getInitials = (name) => {
    // Extract first letters of first and last names for avatar display
    if (!name) return "";

    const words = name.split(" ");
    let initials = "";

    // Get initials from first 2 words (first and last name)
    for (let i = 0; i < Math.min(words.length, 2); i++) {
        initials += words[i][0];
    }

    return initials.toUpperCase();
};


export const addThousandsSeparator = (num) => {
    // Format numbers with commas for thousands (e.g., 1000 becomes 1,000)
    if(num == null || isNaN(num)) return "";

    const[integerPart, fractionalPart] = num.toString().split(".");
    // Add commas every 3 digits from the right using regex
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    // Preserve decimal places if they exist
    return fractionalPart
        ? `${formattedInteger}.${fractionalPart}`
        : formattedInteger;
};

export const prepareExpenseBarChartData = (data = []) => {
    // Transform expense data for bar chart - group by category with translations
    const chartData = data.map((item) => ({
        category: translateCategory(item?.category),
        amount: item?.amount,
    }));

    return chartData;
};

export const prepareIncomeBarChartData = (data = []) => {
    // Transform income data for bar chart - sort chronologically and translate
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: formatDateBG(item?.date),
        amount: item?.amount,
        source: translateSource(item?.source),
    }));

    return chartData;
};

export const prepareExpenseLineChartData = (data = []) => {
    // Transform expense data for line chart - sort chronologically and translate categories
    const sortedData = [...data].sort((a, b) => new Date(a.date) - new Date(b.date));

    const chartData = sortedData.map((item) => ({
        month: formatDateBG(item?.date),
        amount: item?.amount,
        category: translateCategory(item?.category),
    }));

    return chartData;
};