import type { MLRecord, DatasetInfo, InputPattern, DomainType, ColumnMeta } from '../types/sorting';

const FIRST_NAMES = ['Aarav', 'Rohan', 'Aditya', 'Kunal', 'Vivek', 'Rahul', 'Aniket', 'Siddharth', 'Pranav', 'Dev', 'Neha', 'Priya', 'Sneha', 'Isha', 'Ananya', 'Tanvi', 'Riya', 'Pooja', 'Shreya', 'Kavya'];
const DEPARTMENTS = ['Engineering', 'Data Science', 'Product', 'Finance', 'Marketing', 'Operations', 'Research'];

/**
 * Generates synthetic ML-style domain-specific datasets with strict schema isolation
 */
export function generateSyntheticMLDataset(count: number, domain: DomainType = 'student'): DatasetInfo {
  const records: MLRecord[] = [];

  let name = '';
  let domainLabel = '';
  let description = '';
  let columns: string[] = [];
  let numericColumns: string[] = [];
  let selectedColumn = '';
  let columnDictionary: Record<string, ColumnMeta> = {};

  if (domain === 'student') {
    domainLabel = 'Student Academic Performance';
    name = `Student_Performance_${count.toLocaleString()}_records.csv`;
    description = 'Standard machine learning benchmark dataset capturing student study habits, attendance, and exam test scores.';
    columns = ['id', 'studentName', 'age', 'studyHours', 'score', 'attendancePercent', 'gpa'];
    numericColumns = ['score', 'gpa', 'studyHours', 'attendancePercent', 'age', 'id'];
    selectedColumn = 'score';

    columnDictionary = {
      score: { colName: 'score', label: 'Exam Score', description: 'Final examination score (0 - 100 points)', unit: 'pts', minVal: 0, maxVal: 100 },
      gpa: { colName: 'gpa', label: 'Grade Point Average', description: 'Cumulative Grade Point Average (0.0 - 4.0 scale)', unit: 'GPA', minVal: 0.0, maxVal: 4.0 },
      studyHours: { colName: 'studyHours', label: 'Weekly Study Hours', description: 'Total study hours dedicated per week (1 - 40 hours)', unit: 'hrs/wk', minVal: 1, maxVal: 40 },
      attendancePercent: { colName: 'attendancePercent', label: 'Attendance Rate', description: 'Lecture and lab attendance percentage (50% - 100%)', unit: '%', minVal: 50, maxVal: 100 },
      age: { colName: 'age', label: 'Student Age', description: 'Age of the enrolled student (17 - 26 years)', unit: 'yrs', minVal: 17, maxVal: 26 },
      id: { colName: 'id', label: 'Student ID', description: 'Unique primary identifier key', unit: '#', minVal: 1, maxVal: count },
    };

    for (let i = 1; i <= count; i++) {
      const studentName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const age = Math.floor(17 + Math.random() * 9); // 17-25
      const studyHours = parseFloat((2.0 + Math.random() * 38.0).toFixed(1));
      const score = parseFloat(Math.min(100, Math.max(10, 30 + studyHours * 1.6 + (Math.random() - 0.5) * 20)).toFixed(2));
      const attendancePercent = Math.min(100, Math.round(55 + Math.random() * 45));
      const gpa = parseFloat((1.5 + (score / 100) * 2.5).toFixed(2));

      records.push({
        id: i,
        studentName,
        age,
        studyHours,
        score,
        attendancePercent,
        gpa,
      });
    }
  } else if (domain === 'salary') {
    domainLabel = 'Corporate Employee Salaries';
    name = `Employee_Salaries_${count.toLocaleString()}_records.csv`;
    description = 'Human resources dataset containing corporate salaries, experience years, and performance evaluation metrics.';
    columns = ['id', 'employeeName', 'department', 'age', 'salary', 'experienceYears', 'performanceRating', 'bonusPercent'];
    numericColumns = ['salary', 'experienceYears', 'performanceRating', 'bonusPercent', 'age', 'id'];
    selectedColumn = 'salary';

    columnDictionary = {
      salary: { colName: 'salary', label: 'Annual Salary', description: 'Total gross base compensation per year', unit: 'USD ($)', minVal: 35000, maxVal: 280000 },
      experienceYears: { colName: 'experienceYears', label: 'Experience Years', description: 'Total professional industry experience in years', unit: 'yrs', minVal: 0, maxVal: 35 },
      performanceRating: { colName: 'performanceRating', label: 'Performance Score', description: 'Annual performance review rating (1.0 - 5.0 scale)', unit: '/ 5.0', minVal: 1.0, maxVal: 5.0 },
      bonusPercent: { colName: 'bonusPercent', label: 'Bonus Percentage', description: 'Performance incentive bonus percentage', unit: '%', minVal: 0, maxVal: 35 },
      age: { colName: 'age', label: 'Employee Age', description: 'Employee age in years (21 - 65)', unit: 'yrs', minVal: 21, maxVal: 65 },
      id: { colName: 'id', label: 'Employee ID', description: 'Unique corporate employee code', unit: '#', minVal: 1, maxVal: count },
    };

    for (let i = 1; i <= count; i++) {
      const employeeName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
      const department = DEPARTMENTS[Math.floor(Math.random() * DEPARTMENTS.length)];
      const age = Math.floor(22 + Math.random() * 42); // 22-63
      const experienceYears = Math.min(Math.floor((age - 21) * 0.85), Math.floor(Math.random() * 32));
      const baseSalary = 40000 + experienceYears * 4200 + (age - 20) * 800;
      const salary = Math.round(baseSalary + (Math.random() - 0.5) * 20000);
      const performanceRating = parseFloat((1.5 + Math.random() * 3.5).toFixed(1));
      const bonusPercent = Math.round(performanceRating * 5 + Math.random() * 10);

      records.push({
        id: i,
        employeeName,
        department,
        age,
        salary,
        experienceYears,
        performanceRating,
        bonusPercent,
      });
    }
  } else if (domain === 'ratings') {
    domainLabel = 'E-Commerce Customer Ratings';
    name = `Customer_Ratings_${count.toLocaleString()}_records.csv`;
    description = 'Product review dataset capturing user ratings, purchase amounts, and product satisfaction feedback.';
    columns = ['id', 'customerAge', 'purchaseAmount', 'ratingStars', 'itemsBought', 'satisfactionScore'];
    numericColumns = ['ratingStars', 'purchaseAmount', 'satisfactionScore', 'itemsBought', 'customerAge', 'id'];
    selectedColumn = 'ratingStars';

    columnDictionary = {
      ratingStars: { colName: 'ratingStars', label: 'Rating Stars', description: 'Customer product rating score (1.0 - 5.0 stars)', unit: '★', minVal: 1.0, maxVal: 5.0 },
      purchaseAmount: { colName: 'purchaseAmount', label: 'Purchase Amount', description: 'Total transaction order value in USD', unit: 'USD ($)', minVal: 10, maxVal: 4500 },
      satisfactionScore: { colName: 'satisfactionScore', label: 'Satisfaction Score', description: 'Customer CSAT satisfaction index (1 - 100 points)', unit: 'pts', minVal: 1, maxVal: 100 },
      itemsBought: { colName: 'itemsBought', label: 'Items Purchased', description: 'Number of discrete product items purchased', unit: 'items', minVal: 1, maxVal: 40 },
      customerAge: { colName: 'customerAge', label: 'Customer Age', description: 'Age of the purchasing customer', unit: 'yrs', minVal: 18, maxVal: 75 },
      id: { colName: 'id', label: 'Customer ID', description: 'Unique customer record key', unit: '#', minVal: 1, maxVal: count },
    };

    for (let i = 1; i <= count; i++) {
      const customerAge = Math.floor(18 + Math.random() * 58);
      const itemsBought = Math.floor(1 + Math.random() * 25);
      const purchaseAmount = parseFloat((itemsBought * 35 + Math.random() * 800).toFixed(2));
      const ratingStars = parseFloat((1.0 + Math.random() * 4.0).toFixed(1));
      const satisfactionScore = Math.min(100, Math.round(ratingStars * 18 + Math.random() * 10));

      records.push({
        id: i,
        customerAge,
        purchaseAmount,
        ratingStars,
        itemsBought,
        satisfactionScore,
      });
    }
  } else if (domain === 'ecommerce') {
    domainLabel = 'Global E-Commerce Transactions';
    name = `Ecommerce_Orders_${count.toLocaleString()}_records.csv`;
    description = 'Large-scale online retail order logs tracking order value, shipping velocity, and customer discounts.';
    columns = ['id', 'orderValueUsd', 'discountPercent', 'shippingDays', 'customerAge', 'feedbackScore'];
    numericColumns = ['orderValueUsd', 'discountPercent', 'shippingDays', 'feedbackScore', 'customerAge', 'id'];
    selectedColumn = 'orderValueUsd';

    columnDictionary = {
      orderValueUsd: { colName: 'orderValueUsd', label: 'Order Value', description: 'Total gross order subtotal in USD', unit: 'USD ($)', minVal: 12, maxVal: 3200 },
      discountPercent: { colName: 'discountPercent', label: 'Discount Rate', description: 'Applied promotional discount percentage', unit: '%', minVal: 0, maxVal: 50 },
      shippingDays: { colName: 'shippingDays', label: 'Shipping Velocity', description: 'Fulfillment and transit time in calendar days', unit: 'days', minVal: 1, maxVal: 14 },
      feedbackScore: { colName: 'feedbackScore', label: 'Feedback Score', description: 'Post-delivery order feedback rating (1.0 - 10.0)', unit: '/ 10', minVal: 1.0, maxVal: 10.0 },
      customerAge: { colName: 'customerAge', label: 'Customer Age', description: 'Buyer account age demographic', unit: 'yrs', minVal: 18, maxVal: 72 },
      id: { colName: 'id', label: 'Order ID', description: 'Unique order transaction ID', unit: '#', minVal: 1, maxVal: count },
    };

    for (let i = 1; i <= count; i++) {
      const customerAge = Math.floor(18 + Math.random() * 54);
      const discountPercent = Math.round(Math.random() * 40);
      const orderValueUsd = parseFloat((25 + Math.random() * 1800).toFixed(2));
      const shippingDays = Math.floor(1 + Math.random() * 10);
      const feedbackScore = parseFloat((3.0 + Math.random() * 7.0).toFixed(1));

      records.push({
        id: i,
        orderValueUsd,
        discountPercent,
        shippingDays,
        customerAge,
        feedbackScore,
      });
    }
  } else {
    domainLabel = 'Financial Credit & Loan Risk';
    name = `Financial_Credit_${count.toLocaleString()}_records.csv`;
    description = 'Banking and credit risk benchmark table analyzing credit scores, annual incomes, and loan obligations.';
    columns = ['id', 'creditScore', 'annualIncome', 'debtToIncomeRatio', 'loanAmountUsd', 'latePayments'];
    numericColumns = ['creditScore', 'annualIncome', 'debtToIncomeRatio', 'loanAmountUsd', 'latePayments', 'id'];
    selectedColumn = 'creditScore';

    columnDictionary = {
      creditScore: { colName: 'creditScore', label: 'Credit Score', description: 'Standard credit score index (300 - 850 FICO score)', unit: 'pts', minVal: 300, maxVal: 850 },
      annualIncome: { colName: 'annualIncome', label: 'Annual Income', description: 'Verified gross annual applicant income in USD', unit: 'USD ($)', minVal: 20000, maxVal: 350000 },
      debtToIncomeRatio: { colName: 'debtToIncomeRatio', label: 'Debt-to-Income', description: 'Total monthly debt payments relative to gross income', unit: 'ratio', minVal: 0.05, maxVal: 0.65 },
      loanAmountUsd: { colName: 'loanAmountUsd', label: 'Loan Amount', description: 'Approved principal loan amount in USD', unit: 'USD ($)', minVal: 1000, maxVal: 120000 },
      latePayments: { colName: 'latePayments', label: 'Late Payments', description: 'Count of delinquent late payment history events', unit: 'cnt', minVal: 0, maxVal: 12 },
      id: { colName: 'id', label: 'Applicant ID', description: 'Unique credit application key', unit: '#', minVal: 1, maxVal: count },
    };

    for (let i = 1; i <= count; i++) {
      const creditScore = Math.floor(320 + Math.random() * 520);
      const annualIncome = Math.round(25000 + (creditScore / 850) * 150000 + Math.random() * 50000);
      const debtToIncomeRatio = parseFloat((0.08 + Math.random() * 0.45).toFixed(2));
      const loanAmountUsd = Math.round(2000 + Math.random() * 85000);
      const latePayments = Math.floor(Math.max(0, (750 - creditScore) / 60 + (Math.random() - 0.5) * 3));

      records.push({
        id: i,
        creditScore,
        annualIncome,
        debtToIncomeRatio,
        loanAmountUsd,
        latePayments,
      });
    }
  }

  return {
    name,
    domain,
    domainLabel,
    description,
    recordsCount: count,
    columns,
    numericColumns,
    selectedColumn,
    columnDictionary,
    data: records,
    isCustomCSV: false,
  };
}

/**
 * Extracts a numeric array from a dataset column and applies target pattern (random, sorted, reverse)
 */
export function extractAndTransformColumn(
  dataset: MLRecord[],
  columnName: string,
  pattern: InputPattern
): number[] {
  let values = dataset.map((row) => {
    const val = row[columnName];
    if (typeof val === 'number') return val;
    const parsed = parseFloat(String(val));
    return isNaN(parsed) ? 0 : parsed;
  });

  if (pattern === 'sorted') {
    values.sort((a, b) => a - b);
  } else if (pattern === 'reverse') {
    values.sort((a, b) => b - a);
  }

  return values;
}
