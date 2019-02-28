const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate-v2");

const Schema = mongoose.Schema;

const categorySchema = new Schema(
  {
    category_name: { type: String, required: true },
    type: { type: String, default: "default" },
    user: { type: Schema.Types.ObjectId, ref: "User" }
  },
  {
    collection: "categories"
  }
);

categorySchema.plugin(mongoosePaginate);
module.exports = mongoose.model("Category", categorySchema);
