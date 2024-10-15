
const Trx = require("../models/trx.model");
const Person = require("../models/person.model");
const { TrxgqlParser } = require("../graphql/resolvers/merge");

exports.getTrxListInAttendance = async (req, res) => {
  const { attendanceID } = req.params;

  try {
    const trxList = await Trx.find({
      attendance: attendanceID,
    });
    const parsedTrxList = trxList.map((trx) => TrxgqlParser(trx));
    res.status(200).json(parsedTrxList);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transaction list", error: err.message });
  }
};

exports.createTrx = async (req, res) => {
  const { attendanceID, studentID } = req.body;

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
      res.status(201).json({ message: "Attendance Recorded" });
    } else {
      res.status(200).json({ message: "Attendance already recorded" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error creating transaction", error: err.message });
  }
};

exports.getTrxWithPersonInfo = async (req, res) => {
  const { studentID } = req.params;

  try {
    const trxs = await Trx.find({
      student: studentID,
    });
    if (trxs.length === 0) {
      return res.status(404).json({ message: "No transactions found for this student" });
    }
    
    const person = await Person.findById(studentID);
    if (!person) {
      return res.status(404).json({ message: "Person does not exist" });
    }

    const trxsWithPersonInfo = trxs.map(trx => ({
      ...TrxgqlParser(trx),
      firstName: person.firstName,
      lastName: person.lastName,
    }));

    res.status(200).json(trxsWithPersonInfo);
  } catch (err) {
    res.status(500).json({ message: "Error fetching transactions with person info", error: err.message });
  }
};