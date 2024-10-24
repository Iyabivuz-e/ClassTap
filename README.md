**Director of Study (DoS) Dashboard - Attendance Management System**

###**Project Overview**

The Director of Study (DoS) Dashboard is a comprehensive platform designed to manage student attendance efficiently. It allows the Director of Studies to view, track, and manage attendance across multiple classes and courses in real-time. The dashboard integrates RFID/Smart Card technology for seamless attendance capture and provides features such as manual entries, attendance reports, and alerts for absent students.

###**Key Features**

Class and Course Selection: Easily select classes and courses from dropdowns and view real-time attendance logs.
Real-time Notifications: Get alerts when a student's attendance needs attention.
Attendance Logs: View detailed logs of student attendance.
Student Management: Search and filter students based on attendance status and other parameters.
Attendance Reports: Generate detailed reports of attendance for classes or students over time.
Real-Time Attendance Capture: Use RFID or Smart Card technology to capture student attendance in real time.

###**Technologies Used**

**Frontend**: Next.js 14+ with TypeScript and Tailwind CSS, DaisyUI for responsive design.
**Backend**: Node.js using Next.js for API routes and MongoDB with Mongoose for database management.
**Real-time Features**: Firebase for real-time attendance updates and notifications.
**Attendance Capturing**: RFID integration for logging attendance using smart cards.


###**Table of Contents**

1. Setup and Installation
2. Database Configuration
3. API Endpoints
4. Testing the API
   
###**Usage**

**Setup and Installation**
**Prerequisites**
Before starting, ensure you have the following installed on your machine:

1. Node.js (version 16 or higher)
2. MongoDB (local or cloud instance)
3. Git for version control

###**Installation Steps**

**Clone the Repository:**

git clone https://github.com/Iyabivuz-e/ClassTap.git
cd dos-attendance-dashboard

**Install Dependencies:** Navigate to the project root and install the dependencies.

npm install
Set Up Environment Variables: Create a .env.local file in the root directory and add the following:


MONGODB_URI=mongodb+srv://<your-db-user>:<password>@cluster0.mongodb.net/dos-attendance
NEXT_PUBLIC_FIREBASE_API_KEY=<your-firebase-api-key>
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=<your-firebase-sender-id>
Run the Project: To start the development server, run:

npm run dev
Access the Application: The application will be available at http://localhost:3000.

**Database Configuration**

**MongoDB Setup**
You will need MongoDB to store student data, attendance logs, and other related records. If you do not have MongoDB installed, you can use a cloud database service like MongoDB Atlas.

**Create a MongoDB Cluster**: Sign up for MongoDB Atlas or run MongoDB locally on your machine.

**Create Collections**: Use the following structure in MongoDB:

. students: Stores student details (name, class, card ID, etc.).
. attendance: Logs student attendance status (present, absent, late).
. courses: Stores the courses available for each class.
. Ensure that your database URI is correctly configured in the .env.local file.

###**API Endpoints**

Base URL: /api

1. **Fetch Attendance by Class and Course**
   
Endpoint: /api/attendance/class
Method: GET
Description: Fetches attendance logs based on the selected class and course.
Request Parameters:
class: The selected class (e.g., Level 3).
course: The selected course (e.g., Software).
Response: Returns a list of students and their attendance status.
Example Request:

GET /api/attendance/class
2. Capture Student Attendance
Endpoint: /api/attendance/log
Method: POST
Description: Captures or updates student attendance for the current day.
Request Body:
json
{
  "card_id": "CARD003",
}
Response: Attendance status updated successfully.


###**Viewing Attendance:**

Navigate to the Class Attendance section.
Select a class (e.g., Level 3).
Select a course (e.g., Software).
The student list and attendance status will be displayed accordingly.

###**Capturing Attendance:**

. Students tap their RFID card to log attendance.
. The system captures the attendance status in real-time.
. The Director of Study can manually override or add attendance if needed.

###**Conclusion**

The Director of Study (DoS) Dashboard provides a streamlined interface for managing student attendance and viewing attendance logs by class and course. With real-time notifications, report generation, and easy-to-use attendance management features, it simplifies the overall process for school administrators.






