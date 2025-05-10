"use client";

import React, { useState, ChangeEvent, FormEvent } from "react";

interface StudentFormData {
  student_id: string;
  student_name: string;
  card_id: string;
  gender: string;
  class_name: string;
  course: string;
  profile_image: string;
  enrollment_year: string; // Keep as string to match input value, API/Mongoose can coerce
}

const initialFormData: StudentFormData = {
  student_id: "",
  student_name: "",
  card_id: "",
  gender: "",
  class_name: "",
  course: "",
  profile_image: "",
  enrollment_year: "",
};

const AddStudentPage: React.FC = () => {
  const [formData, setFormData] = useState<StudentFormData>(initialFormData);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    setError("");

    // Basic client-side validation
    for (const key in formData) {
      if (formData[key as keyof StudentFormData].trim() === "") {
        setError(`Please fill in the ${key.replace(/_/g, " ")} field.`);
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch("/api/student/add-student", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        setMessage(result.message || "Student added successfully!");
        setFormData(initialFormData); // Reset form on success
      } else {
        setError(result.message || "Failed to add student. Please try again.");
      }
    } catch (err) {
      console.error("Frontend submission error:", err);
      setError(
        "An unexpected error occurred. Please check the console and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200 flex items-center justify-center p-4">
      <div className="card w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body">
          <h1 className="card-title text-3xl font-bold text-center mb-8 justify-center">
            Add New Student
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="form-control">
              <label htmlFor="student_id" className="label">
                <span className="label-text font-semibold">Student ID:</span>
              </label>
              <input
                type="text"
                id="student_id"
                name="student_id"
                value={formData.student_id}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="student_name" className="label">
                <span className="label-text font-semibold">Student Name:</span>
              </label>
              <input
                type="text"
                id="student_name"
                name="student_name"
                value={formData.student_name}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="card_id" className="label">
                <span className="label-text font-semibold">Card ID:</span>
              </label>
              <input
                type="text"
                id="card_id"
                name="card_id"
                value={formData.card_id}
                onChange={handleChange}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="gender" className="label">
                <span className="label-text font-semibold">Gender:</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className="select select-bordered w-full"
              >
                <option value="" disabled>-- Select Gender --</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-control">
              <label htmlFor="class_name" className="label">
                <span className="label-text font-semibold">Class Name:</span>
              </label>
              <input
                type="text"
                id="class_name"
                name="class_name"
                value={formData.class_name}
                onChange={handleChange}
                required
                placeholder="e.g., Level 4, Grade 10B"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="course" className="label">
                <span className="label-text font-semibold">Course:</span>
              </label>
              <input
                type="text"
                id="course"
                name="course"
                value={formData.course}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineering, General Science"
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="profile_image" className="label">
                <span className="label-text font-semibold">Profile Image URL:</span>
              </label>
              <input
                type="url"
                id="profile_image"
                name="profile_image"
                value={formData.profile_image}
                onChange={handleChange}
                placeholder="https://example.com/image.png"
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control">
              <label htmlFor="enrollment_year" className="label">
                <span className="label-text font-semibold">Enrollment Year:</span>
              </label>
              <input
                type="number"
                id="enrollment_year"
                name="enrollment_year"
                value={formData.enrollment_year}
                onChange={handleChange}
                placeholder="YYYY"
                min="1900"
                max={new Date().getFullYear() + 5}
                required
                className="input input-bordered w-full"
              />
            </div>

            <div className="form-control mt-8">
              <button
                type="submit"
                disabled={isLoading}
                className="btn btn-primary w-full"
              >
                {isLoading ? (
                  <>
                    <span className="loading loading-spinner"></span>
                    Adding Student...
                  </>
                ) : (
                  "Add Student"
                )}
              </button>
            </div>
          </form>

          {message && (
            <div role="alert" className="alert alert-success mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div role="alert" className="alert alert-error mt-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddStudentPage;
//           <label
//             htmlFor="student_id"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Student ID:
//           </label>
//           <input
//             type="text"
//             id="student_id"
//             name="student_id"
//             value={formData.student_id}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="student_name"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Student Name:
//           </label>
//           <input
//             type="text"
//             id="student_name"
//             name="student_name"
//             value={formData.student_name}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="card_id"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Card ID:
//           </label>
//           <input
//             type="text"
//             id="card_id"
//             name="card_id"
//             value={formData.card_id}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="gender"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Gender:
//           </label>
//           <select
//             id="gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleChange}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           >
//             <option value="">-- Select Gender --</option>
//             <option value="male">Male</option>
//             <option value="female">Female</option>
//             <option value="other">Other</option>
//           </select>
//         </div>

//         <div>
//           <label
//             htmlFor="class_name"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Class Name:
//           </label>
//           <input
//             type="text"
//             id="class_name"
//             name="class_name"
//             value={formData.class_name}
//             onChange={handleChange}
//             required
//             placeholder="Level 4"
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="course"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Course:
//           </label>
//           <input
//             type="text"
//             id="course"
//             name="course"
//             value={formData.course}
//             onChange={handleChange}
//             required
//             placeholder="software"
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="profile_image"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Profile Image URL:
//           </label>
//           <input
//             type="url"
//             id="profile_image"
//             name="profile_image"
//             value={formData.profile_image}
//             onChange={handleChange}
//             placeholder="https://example.com/image.png"
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <div>
//           <label
//             htmlFor="enrollment_year"
//             className="block mb-1 font-semibold text-sm text-gray-700"
//           >
//             Enrollment Year:
//           </label>
//           <input
//             type="number"
//             id="enrollment_year"
//             name="enrollment_year"
//             value={formData.enrollment_year}
//             onChange={handleChange}
//             placeholder="YYYY"
//             min="1900"
//             max={new Date().getFullYear() + 5}
//             required
//             className="w-full p-3 border border-gray-300 rounded-md text-base focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
//           />
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className={`w-full p-3 text-base text-white font-semibold rounded-md transition-colors duration-200 
//                       ${
//                         isLoading
//                           ? "bg-gray-400 cursor-not-allowed"
//                           : "bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//                       }`}
//         >
//           {isLoading ? "Adding Student..." : "Add Student"}
//         </button>
//       </form>

//       {isLoading && (
//         <p className="mt-4 text-center text-sm text-gray-600">Processing...</p>
//       )}

//       {message && (
//         <div className="mt-4 p-3 rounded-md bg-green-100 border border-green-300 text-green-700 text-sm">
//           {message}
//         </div>
//       )}

//       {error && (
//         <div className="mt-4 p-3 rounded-md bg-red-100 border border-red-300 text-red-700 text-sm">
//           {error}
//         </div>
//       )}
//     </div>
//   );
// };

// export default AddStudentPage;
