
import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { gql } from '@apollo/client';

const GET_TRX_LIST = gql`
  query GetTrxListInAttendance($attendanceID: ID!) {
    getTrxListInAttendance(attendanceID: $attendanceID) {
      id
      attendance
      student
      createdAt
    }
  }
`;

const TrxList = ({ attendanceID, studentID }) => {
  const [trxList, setTrxList] = useState([]);

  const { loading, error, data } = useQuery(GET_TRX_LIST, {
    variables: { attendanceID },
  });

  useEffect(() => {
    if (data && data.getTrxListInAttendance) {
      const filteredTrxList = data.getTrxListInAttendance.filter(
        (trx) => trx.student === studentID
      );
      setTrxList(filteredTrxList);
    }
  }, [data, studentID]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <h2>Transactions for Student</h2>
      {trxList.length === 0 ? (
        <p>No transactions found for this student.</p>
      ) : (
        <ul>
          {trxList.map((trx) => (
            <li key={trx.id}>
              Transaction ID: {trx.id}, Created At: {new Date(parseInt(trx.createdAt)).toLocaleString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TrxList;
