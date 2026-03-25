export const validateRequest = (schema) => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body, {
      abortEarly: false,
      allowUnknown: true,
    });

    if (error) {
      const errorMessage = error.details.map((d) => d.message).join("");

      // 🚩 ADD THIS LINE RIGHT HERE
      console.log("❌ JOI VALIDATION ERROR:", errorMessage);
      console.log("📦 BODY RECEIVED BY JOI:", req.body);
      
      return res.status(400).json({ success: false, message: errorMessage });
    }
    next();
  };
};


