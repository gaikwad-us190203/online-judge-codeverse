import React, { useState, useEffect } from "react";
import { getsubmissions } from "../../services/operations/authAPI";
import { useSelector } from "react-redux";

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const submissionsPerPage = 20; // Number of submissions per page
  const { user } = useSelector((state) => state.profile);

  // Fetch submissions from API
  const fetchSubmissions = async () => {
    try {
      const data = await getsubmissions(); // Replace with your actual API endpoint
      setSubmissions(data.reverse()); // Reverse the data to have the latest submissions on top
    } catch (error) {
      console.error("Error fetching submissions:", error);
    }
  };

  // Load submissions on component mount
  useEffect(() => {
    fetchSubmissions();
  }, []);

  // Calculate index of the last submission on the current page
  const indexOfLastSubmission = currentPage * submissionsPerPage;
  // Calculate index of the first submission on the current page
  const indexOfFirstSubmission = indexOfLastSubmission - submissionsPerPage;
  // Get current submissions for the current page
  const currentSubmissions = submissions.slice(
    indexOfFirstSubmission,
    indexOfLastSubmission
  );

  // Function to handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 min-h-screen p-4">
      <h1 className="text-4xl font-bold text-white text-center mb-8">
        All Submissions
      </h1>
      {/* Render table with submissions */}
      <div className="overflow-x-auto shadow-lg rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          {/* Table headers */}
          <thead className="bg-gray-200">
            {/* Table header rows */}
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                User
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Problem
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-700 uppercase tracking-wider">
                Result
              </th>
              <th className="px-6 py-3 text-xs text-center font-medium text-gray-700 uppercase tracking-wider">
                Language
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                Submitted At
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                {user.accountType === "Admin" && <div>code</div>}
              </th>
            </tr>
          </thead>
          {/* Table body */}
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Map over current submissions and render table rows */}
            {currentSubmissions.map((submission, index) => (
              <tr key={index} className="hover:bg-gray-100">
                {/* Table data cells */}
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {submission.firstname} {submission.lastname}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {submission.problemTitle}
                  </div>
                </td>
                <td
                  className={`px-6 py-4 whitespace-nowrap ${
                    submission.result.includes("Accepted")
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  } rounded-full text-center`}
                >
                  {submission.result}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 text-center">
                    {submission.language}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(submission.submittedAt).toLocaleString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {/* Render view code button for admin users */}
                  {user.accountType === "Admin" && (
                    <button
                      onClick={() =>
                        handleCodeClick(submission.code, submission.result)
                      }
                      className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                      View Code
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="mx-2 px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentSubmissions.length < submissionsPerPage}
          className="mx-2 px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Submissions;
