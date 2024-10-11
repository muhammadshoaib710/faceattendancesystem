const { model, Schema } = require("mongoose");

const trxSchema = new Schema(
  {
    attendance: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    student: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    checkInTime: {
      type: Date,
      required: true,
    },
    checkOutTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = model("trx", trxSchema);