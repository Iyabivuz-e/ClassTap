// Sidebar.tsx
import Image from "next/image";
import logo from "../../../../../public/images/logowm.png";
import Link from "next/link";

interface SidebarProps {
  setRenderComp: (comp: string) => void; // Prop to update the rendered component
  renderComp: string;
}

const Sidebar: React.FC<SidebarProps> = ({ setRenderComp, renderComp }) => {
  return (
    <div>
      <div className="p-5">
        <div className="rounded-full w-[70px] h-[70px] m-auto">
          <Link href="/">
            <Image
              className="object-cover w-full h-full rounded-full"
              src={logo}
              alt="School logo"
            />
          </Link>
        </div>
        <h1 className="text-center font-semibold uppercase mt-2 text-sm">
          World Mission High School
        </h1>
        <nav className="mt-10">
          <div className="dropdown w-full ">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "dashboard"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("dashboard")} // Set dashboard component
            >
              Dashboard
            </div>
          </div>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "students"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("students")} // Set student management component
            >
              Students
            </div>
          </div>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "classes"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("classes")} // Set student management component
            >
              Classes
            </div>
          </div>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "attendance-reports"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("attendance-reports")} // Set Attendance reports component
            >
              Attendance Reports
            </div>
          </div>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "add-student"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("add-student")} // Set profile component
            >
              Add Student
            </div>
          </div>
          <div className="dropdown w-full">
            <div
              tabIndex={0}
              role="button"
              className={`btn m-1 w-full ${
                renderComp === "profile"
                  ? "btn m-1 w-full bg-base-content text-base-200 hover:text-inherit"
                  : ""
              }`}
              onClick={() => setRenderComp("profile")} // Set profile component
            >
              Profile
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
