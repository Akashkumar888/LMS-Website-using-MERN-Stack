
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../context/AppContext';
import { assets, dummyDashboardData } from '../../assets/assets';
import Loading from '../../components/student/Loading';
import api from '../../axios/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [dashboardData,setDashboardData]=useState(null);
  const {currency,isEducator}=useContext(AppContext);

  const fetchDashBoardData=async()=>{
    try {
      const {data}=await api.get(`/api/educator/dashboard`);
      if(data.success){
        setDashboardData(data.dashboardData);
      }
      else{
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  }
  

  useEffect(()=>{
    fetchDashBoardData();
  },[]);

  return dashboardData ? (
  <div className="p-6 md:p-8">
    <div className="space-y-5">
      <div className="flex flex-wrap gap-5 items-center">

        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-58 rounded-md">
          <img src={assets.patients_icon} alt="patients_icon" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashboardData.enrolledStudentsData.length}
            </p>
            <p className="text-base text-gray-500">Total Enrollments</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-58 rounded-md">
          <img src={assets.appointments_icon} alt="appointments_icon" />
          <div>
            <p className="text-2xl font-medium text-gray-600">
              {dashboardData.totalCourses}
            </p>
            <p className="text-base text-gray-500">Total Courses</p>
          </div>
        </div>

        <div className="flex items-center gap-3 shadow-card border border-blue-500 p-4 w-58 rounded-md">
          <img src={assets.earning_icon} alt="earning_icon" />
          <div>
         <p className="text-2xl font-medium text-gray-600">
  {currency}{(dashboardData.totalEarnings / 100).toFixed(2)}
</p>

            <p className="text-base text-gray-500">Total Earning</p>
          </div>
        </div>

      </div>

    <div className='pb-4 text-lg font-medium'>
      <h2>Latest Enrollments</h2>
      <div className='flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20'>
      <table className="table-fixed md:table-auto w-full overflow-hidden">
  <thead className="text-gray-900 border-b border-gray-500/20 text-sm text-left">
    <tr>
      <th className="px-4 py-3 font-semibold text-center hidden sm:table-cell">
        #
      </th>
      <th className="px-4 py-3 font-semibold">Student Name</th>
      <th className="px-4 py-3 font-semibold">Course Title</th>
    </tr>
  </thead>

  <tbody className="text-sm text-gray-500">
    {dashboardData.enrolledStudentsData.map((item, index) => (
      <tr key={index} className="border-b border-gray-500/20">
        <td className="px-4 py-3 text-center hidden sm:table-cell">
          {index + 1}
        </td>

        <td className="md:px-4 px-2 py-3 truncate">
  {item.userId}
</td>


        <td className="px-4 py-3 truncate">
          {item.courseTitle}
        </td>
      </tr>
    ))}
  </tbody>
</table>

      </div>
    </div>

    </div>
  </div>
) : <Loading />;

}

export default Dashboard
