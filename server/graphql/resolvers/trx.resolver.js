const Trx = require("../../models/trx.model");
const { TrxgqlParser } = require("./merge");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
    // ... (keep existing query resolvers)
  },
  Mutation: {
    async createTrx(_, { trxInput: { attendanceID, studentID } }, context) {
      const user = checkAuth(context);

      try {
        const existingTrx = await Trx.findOne({
          attendance: attendanceID,
          student: studentID,
        });

        if (!existingTrx || existingTrx.length <= 0) {
          const trx = new Trx({
            attendance: attendanceID,
            student: studentID,
            checkInTime: new Date().toISOString(),
          });
          await trx.save();
          return "Check-in Recorded";
        }

        return "Already checked in";
      } catch (err) {
        throw err;
      }
    },
    async checkOutTrx(_, { trxInput: { attendanceID, studentID } }, context) {
      const user = checkAuth(context);

      try {
        const existingTrx = await Trx.findOne({
          attendance: attendanceID,
          student: studentID,
        });

        if (existingTrx && !existingTrx.checkOutTime) {
          existingTrx.checkOutTime = new Date().toISOString();
          await existingTrx.save();
          return "Check-out Recorded";
        }

        return "No check-in record found or already checked out";
      } catch (err) {
        throw err;
      }
    },
  },
};