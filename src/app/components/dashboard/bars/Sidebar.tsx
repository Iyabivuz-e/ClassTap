import Image from 'next/image';
import logo from "../../../../../public/images/logowm.png";
import Link from 'next/link';


const Sidebar = () => {
  return (
    <div>
      <div className="p-5">
        <div className="rounded-full w-[70px] h-[70px] m-auto">
          <Link href="/">
          <Image className="object-cover w-full h-full rounded-full" src={logo} alt="School logo" />

          </Link>
        </div>
        <nav className="mt-10">
          <div className="dropdown w-full">
            <div tabIndex={0} role="button" className="btn m-1 w-full">
              Dashboard
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>Today&#39;s attenddance</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
          <div className="dropdown w-full">
            <div tabIndex={0} role="button" className="btn m-1 w-full">
              Students
            </div>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-[1] w-52 p-2 shadow"
            >
              <li>
                <a>All Students</a>
              </li>
              <li>
                <a>Item 2</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Sidebar
