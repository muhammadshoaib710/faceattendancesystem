const Trx = require("../../models/trx.model");
const { TrxgqlParser } = require("./merge");
const checkAuth = require("../../util/check-auth");

module.exports = {
  Query: {
<<<<<<< Updated upstream
    // ... (keep existing query resolvers)
=======
    async getTrx(_, { trxInput: { attendanceID, studentID } }, context) {
      const user = checkAuth(context);

      try {
        const trx = await Trx.findOne({
          attendance: attendanceID,
          student: studentID,
        });
        if (!trx) throw new Error("Transaction does not exist");
        return TrxgqlParser(trx);
      } catch (err) {
        throw err;
      }
    },
    async getTrxListInAttendance(_, { attendanceID }, context) {
      const user = checkAuth(context);

      try {
        const trxList = await Trx.find({
          attendance: attendanceID,
        });
        return trxList.map((trx) => TrxgqlParser(trx));
      } catch (err) {
        throw err;
      }
    },
>>>>>>> Stashed changes
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
    async createCheckout(_, { trxInput: { attendanceID, studentID } }, context) { // Add this resolver
      const user = checkAuth(context);

      try {
        const existingTrx = await Trx.find({
          attendance: attendanceID,
          student: studentID,
        });

        if (existingTrx.length <= 0) {
          const trx = new Trx({
            attendance: attendanceID,
            student: studentID,
          });
          await trx.save();
          return "Checkout Recorded";
        }

        return "";
      } catch (err) {
        throw err;
      }
    },
  },
};