const queryModel = require("../models/queryHelper");
const { successResponse } = require("../utils/responseHelper");
const {TABLES} = require('../common/constant')

const rollDice = () => Math.floor(Math.random() * 6) + 1;

exports.placeBet = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { betAmount, betType } = req.body;

    if (!["UP", "DOWN", "SEVEN"].includes(betType)) throw { message: "Invalid bet type", statusCode: 200 };

    if (!betAmount || betAmount <= 0) throw { message: "Invalid bet amount", statusCode: 200 };

    const user = await queryModel.findOne(TABLES.USERS, { id: userId });
    if (!user || user.balance < betAmount) throw { message: "Insufficient balance", statusCode: 200 };

    const dice1 = rollDice();
    const dice2 = rollDice();
    const total = dice1 + dice2;

    let result;

    if (total > 7){
        result = "UP";
    }else if (total < 7) {
        result = "DOWN";
    }else{
        result = "SEVEN";
    } 
    
    const isWin = result === betType;
    const payout = isWin ? (result === "SEVEN" ? betAmount * 4 : betAmount * 2) : 0;

    await queryModel.insert(TABLES.BETS, {
      userId,
      betAmount,
      betType,
      dice1,
      dice2,
      total,
      result,
      isWin: isWin ? 1 : 0,
      payout,
      betDate: new Date()
    });

    const updatedBalance = isWin ? user.balance + payout : user.balance - betAmount;
    await queryModel.update(TABLES.USERS, { id: userId }, { balance: updatedBalance });

    const resp = {
      betType,
      betAmount,
      result,
      dice1,
      dice2,
      total,
      isWin,
      payout,
      updatedBalance
    };

    return successResponse(res, resp, "Bet placed successfully");

  } catch (error) {
    console.error("Place Bet Error:", error);
    next(error);
  }
};

exports.getBetHistory = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const bets = await queryModel.findAll({
      table: TABLES.BETS,
      where: { userId },
      orderBy: "betDate DESC"
    });
    return successResponse(res, bets, "Bet history fetched successfully");
  } catch (error) {
    console.error("Get Bet History Error:", error);
    next(error);
  }
};
