const router = require("express").Router();

router.use("/portfolio", require("./portfolio"));
router.use("/transactions", require("./transactions"));

router.use((req, res, next) => {
  const error = new Error("Not Found");
  error.status = 404;
  next(error);
});

module.exports = router;
