  import React, { useState, useEffect } from 'react';
  import { useParams } from 'react-router-dom';
  import { Table, Typography, Spin, Alert } from 'antd';

  const { Title } = Typography;

  const TrxList = () => {
    const [trxList, setTrxList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
      const fetchTrxList = async () => {
        try {
          const response = await fetch(`http://localhost:4000/api/trx/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch transaction list');
          }
          const data = await response.json();
          setTrxList(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };

      fetchTrxList();
    }, [id]);

    const columns = [
      {
        title: 'Attendance ID',
        dataIndex: 'attendanceID',
        key: 'attendanceID',
      },
      {
        title: 'Check-In Time',
        dataIndex: 'createdAt',
        key: 'checkInTime',
        render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: 'Check-Out Time',
        dataIndex: 'checkOutTime',
        key: 'checkOutTime',
        render: (text) => new Date(text).toLocaleString(),
      },
      {
        title: 'Full Name',
        key: 'fullName',
        render: (_, record) => `${record.firstName} ${record.lastName}`,
      },
      {
        title: 'Student ID',
        dataIndex: 'studentID',
        key: 'studentID',
      },
    ];

    if (loading) return <Spin size="large" />;
    if (error) return <Alert message={`Error: ${error}`} type="error" />;

    return (
      <div>
        <Title level={2}>Transactions for Student</Title>
        {trxList.length === 0 ? (
          <Alert message="No transactions found for this student." type="info" />
        ) : (
          <Table columns={columns} dataSource={trxList} rowKey="attendanceID" />
        )}
      </div>
    );
  };

  export default TrxList;