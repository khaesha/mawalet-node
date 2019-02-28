const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const cashFlowSchema = new Schema({
  date: { type: Date, default: Date.now },
  // type: { type: String, required: true },
  is_expense: { type: Boolean, required: true },
  category: { type: String, required: true },
  amount: { type: Number, required: true },
  description: String,
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
});

cashFlowSchema.pre("save", function(next) {
  var cashFlow = this;

  if (cashFlow.is_expense) {
    cashFlow.amount = Math.abs(cashFlow.amount) * -1;
    next();
  } else {
    next();
  }
});

cashFlowSchema.plugin(mongoosePaginate);
module.exports = mongoose.model("cash-flow", cashFlowSchema);
