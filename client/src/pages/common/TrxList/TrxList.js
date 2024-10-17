  import React, { useState, useEffect, useContext } from 'react';
  import { useParams } from 'react-router-dom';
  import { Table, Typography, Spin, Alert, Layout } from 'antd';
  import { AuthContext } from "../../../context";
  import { CheckError } from "../../../utils/ErrorHandling";
  import {
    Footer,
    Greeting,
    Navbar,
    PageTitleBreadcrumb,
  } from "../../../components/common/sharedLayout";

  const { Title } = Typography;
  const { Content } = Layout;

  const TrxList = () => {
    const [trxList, setTrxList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();
    const { user } = useContext(AuthContext);

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
          CheckError(err);
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

    const titleList = [
      { name: "Home", link: "/dashboard" },
      { name: "Transactions", link: `/trx/${id}` },
    ];

    return (
      <Layout className="trxList layout">
        <Navbar />
        <Layout>
          <Greeting
            firstName={user.firstName}
            profilePicture={user.profilePicture}
          />
          <PageTitleBreadcrumb titleList={titleList} />
          <Content>
            <Title level={2}>Transactions for Student</Title>
            {loading ? (
              <Spin size="large" />
            ) : error ? (
              <Alert message={`Error: ${error}`} type="error" />
            ) : trxList.length === 0 ? (
              <Alert message="No transactions found for this student." type="info" />
            ) : (
              <Table columns={columns} dataSource={trxList} rowKey="attendanceID" />
            )}
          </Content>
          <Footer />
        </Layout>
      </Layout>
    );
  };

  export default TrxList;