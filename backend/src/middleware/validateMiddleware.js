const AppError = require("../utils/AppError");

const validate = (schema) => (req, res, next) => {
  const errors = [];

  Object.entries(schema).forEach(([field, rules]) => {
    const value = req.body[field];
    const hasValue = value !== undefined && value !== null && value !== "";

    if (rules.required && !hasValue) {
      errors.push(`${field} is required`);
      return;
    }

    if (!hasValue) {
      return;
    }

    if (rules.type === "string" && typeof value !== "string") {
      errors.push(`${field} must be a string`);
      return;
    }

    if (rules.minLength && String(value).trim().length < rules.minLength) {
      errors.push(
        `${field} must be at least ${rules.minLength} characters long`
      );
    }

    if (rules.maxLength && String(value).trim().length > rules.maxLength) {
      errors.push(
        `${field} must not exceed ${rules.maxLength} characters`
      );
    }

    if (rules.pattern && !rules.pattern.test(String(value).trim())) {
      errors.push(rules.message || `${field} format is invalid`);
    }

    if (rules.enum && !rules.enum.includes(value)) {
      errors.push(`${field} must be one of: ${rules.enum.join(", ")}`);
    }

    if (rules.custom) {
      const result = rules.custom(value, req.body);
      if (result !== true) {
        errors.push(result || `${field} is invalid`);
      }
    }
  });

  if (errors.length) {
    return next(new AppError(errors.join(". "), 400));
  }

  next();
};

module.exports = validate;
