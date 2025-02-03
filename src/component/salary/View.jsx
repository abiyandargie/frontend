import axios from "axios";
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const View = () => {
  const { id } = useParams();
  const [salaries, setSalaries] = useState(null);
  const [filteredSalaries, setFilteredSalaries] = useState(null);

  const fetchSalaries = async () => {
    try {
      const response = await axios.get(
        `https://employee-b-end.vercel.app/api/salary/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.data.success) {
        setSalaries(response.data.salary);
        setFilteredSalaries(response.data.salary);
      } else {
        alert("Failed to fetch salary details");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(
        error.response?.data?.error ||
          "An error occurred while fetching salary details"
      );
    }
  };

  useEffect(() => {
    fetchSalaries();
  }, []);

  const filterSalaries = (q) => {
    const filteredRecords = salaries.filter((salary) =>
      salary.employeeId.toLowerCase().includes(q.toLowerCase())
    );
    setFilteredSalaries(filteredRecords);
  };

  return (
    <>
      {filteredSalaries === null ? (
        <div>Loading...</div>
      ) : (
        <div className="overflow-x-auto p-5">
          <div className="text-center">
            <h2>Salary History</h2>
          </div>
          <div className="flex justify-end my-3">
            <input
              type="text"
              className="border px-2 rounded-md py-0.5 border-gray-300"
              placeholder="Search By Emp Id"
              onChange={(e) => filterSalaries(e.target.value)}
            />
          </div>

          {filteredSalaries.length > 0 ? (
            <table className="w-full text-sm text-left text-gray-500">
              <thead className="w-full text-sm text-center text-gray-700">
                <tr>
                  <th className="px-6 py-3">SNO</th>
                  <th className="px-6 py-3">Emp Id</th>
                  <th className="px-6 py-3">Salary</th>
                  <th className="px-6 py-3">Allowance</th>
                  <th className="px-6 py-3">Deduction</th>
                  <th className="px-6 py-3">Total</th>
                  <th className="px-6 py-3">Pay Date</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalaries.map((salary, index) => (
                  <tr
                    key={salary._id}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <td className="px-6 py-3">{index + 1}</td>
                    <td className="px-6 py-3">
                      {salary.employeeId.employeeId}
                    </td>
                    <td className="px-6 py-3">{salary.basicSalary}</td>
                    <td className="px-6 py-3">{salary.allowance}</td>
                    <td className="px-6 py-3">{salary.deduction}</td>
                    <td className="px-6 py-3">{salary.netSalary}</td>
                    <td className="px-6 py-3">
                      {new Date(salary.payDate).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div>No Records</div>
          )}
        </div>
      )}
    </>
  );
};

export default View;
