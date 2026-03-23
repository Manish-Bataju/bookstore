export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join("");
      return res.status(400).json({ success: false, message: errorMessage });
    }
    next();
  };
};
