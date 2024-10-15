
const express = require('express');
const router = express.Router();
const trxController = require('../controllers/trxController');

router.get('/attendance/:attendanceID', trxController.getTrxListInAttendance);
router.post('/create', trxController.createTrx);
router.get('/:studentID', trxController.getTrxWithPersonInfo);

module.exports = router;
