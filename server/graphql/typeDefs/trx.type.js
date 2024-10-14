const { gql } = require("apollo-server");

module.exports = gql`
  type Trx {
    _id: ID!
    attendanceID: String!
    studentID: String!
    checkInTime: String
    checkOutTime: String
    createdAt: String!
    updatedAt: String!
  }

  input trxInput {
    attendanceID: ID!
    studentID: ID!
  }

  extend type Query {
    getTrx(trxInput: trxInput!): Trx!
    getTrxListInAttendance(attendanceID: ID!): [Trx!]
  }

  extend type Mutation {
    createTrx(trxInput: trxInput!): String!
<<<<<<< Updated upstream
    checkOutTrx(trxInput: trxInput!): String!
=======
    createCheckout(trxInput: trxInput!): String!  // Add this line
>>>>>>> Stashed changes
  }
`;