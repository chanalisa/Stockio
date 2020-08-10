const router = require("express").Router();
const axios = require("axios");

const User = require("../db/models").User;
const Portfolio = require("../db/models").Portfolio;
const Transaction = require("../db/models").Transaction;

const BASE_URL = process.env.BASE_URL;
const REACT_APP_API_TOKEN = process.env.REACT_APP_API_TOKEN;

// middleware to collect current data for requested stock
const getStockInfo = async (req, res, next) => {
  try {
    const { data } = await axios.get(
      BASE_URL + req.body.ticker + "/quote?token=" + REACT_APP_API_TOKEN
    );
    if (data) {
      req.stockInfo = data;
      next();
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error(error);
  }
};

// find all instances of portfolio with given userId
router.post("/", async (req, res, next) => {
  try {
    const stockPortfolio = await Portfolio.findAll({
      where: { userId: req.body.id },
    });
    // update portfolio with latest price
    if (stockPortfolio.length) {
      for (let stock of stockPortfolio) {
        const { data } = await axios.get(
          BASE_URL + stock.ticker + "/price?token=" + REACT_APP_API_TOKEN
        );
        await stock.update({
          currentPrice: Math.round(data * 100),
        });
      }
    }
    res.json(stockPortfolio);
  } catch (error) {
    console.error(error);
  }
});

// buy stock
router.put("/", getStockInfo, async (req, res, next) => {
  // funds check
  const userCashBalance = Math.round(
    req.body.user.cash - req.stockInfo.latestPrice * 100 * req.body.quantity
  );
  console.log("user: ", req.body.user.cash);
  console.log("latest: ", req.stockInfo.latestPrice);
  console.log("quant: ", req.body.quantity);
  console.log(
    "result: ",
    Math.round(
      req.body.user.cash - req.stockInfo.latestPrice * 100 * req.body.quantity
    )
  );
  if (userCashBalance < 0) {
    res.sendStatus(403).json({ error: "Insufficient Funds" });
  } else {
    try {
      // update user funds
      const user = await User.findByPk(req.body.user.id);
      user.update({
        cash: userCashBalance,
      });
      // create a new entry in the transactions table
      const newTransaction = await Transaction.create({
        ticker: req.stockInfo.symbol,
        companyName: req.stockInfo.companyName,
        priceAtTransaction: Math.round(req.stockInfo.latestPrice * 100),
        quantity: req.body.quantity,
        userId: req.body.user.id,
      });
      // looks for an entry in the portfolios table or create one if not found
      const [stock, created] = await Portfolio.findOrCreate({
        where: {
          ticker: newTransaction.ticker,
          userId: req.body.user.id,
        },
        defaults: {
          ticker: req.stockInfo.symbol,
          companyName: req.stockInfo.companyName,
          currentPrice: Math.round(req.stockInfo.latestPrice * 100),
          quantity: +req.body.quantity,
          openPrice: Math.round(req.stockInfo.open * 100),
          userId: req.body.user.id,
        },
      });
      // if found, update the quantity
      if (!created) {
        stock.update({
          quantity: stock.quantity + newTransaction.quantity,
          currentPrice: Math.round(req.stockInfo.latestPrice * 100),
          openPrice: Math.round(req.stockInfo.open * 100),
        });
        res.json(stock);
      }
    } catch (error) {
      console.error(error);
    }
  }
});

module.exports = router;
