
import gql from 'graphql-tag';

export const FETCH_TRX_LIST = gql`
  query getTrxList($attendanceID: ID!, $studentID: ID!) {
    getTrx(trxInput: { attendanceID: $attendanceID, studentID: $studentID }) {
      _id
      attendanceID
      studentID
      checkInTime
      checkOutTime
      createdAt
      updatedAt
    }
  }
`;
