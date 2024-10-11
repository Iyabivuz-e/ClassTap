import React from 'react'

const AttendanceList = () => {
  return (
    <div className="mt-7">
      <h1>Attendance List</h1>
      <div className="overflow-x-auto mt-3">
        <table className="table">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>Student Name</th>
              <th>Student Id</th>
              <th>Card Id</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {/* row 1 */}
            <tr className="bg-base-200">
              <th>1</th>
              <td>Dieudonne Iyabivuze</td>
              <td>1234</td>
              <td>ABC123</td>
              <td className="text-green-500">Present</td>
            </tr>
            {/* row 2 */}
            <tr>
              <th>2</th>
              <td>Niyibikora Obed</td>
              <td>23456</td>
              <td>HGS234</td>
              <td className="text-green-500">present</td>
            </tr>
            {/* row 3 */}
            <tr>
              <th>3</th>
              <td>Emmanuel Nsengiyumva</td>
              <td>34567</td>
              <td>EFG345</td>
              <td className="text-red-500">Absent</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AttendanceList
