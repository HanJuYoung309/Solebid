import { menu } from "./mockData";
import { Link } from "react-router-dom";

const ProfileMenu = () => {
    return (
        <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                퀵 메뉴
            </h3>
            <nav className="space-y-2">
                {menu.map((link, index) => (
                    <Link
                        key={index}
                        to={link.href}
                        className="flex items-center px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer"
                    >
                        <i className={`${link.icon} w-5 text-center mr-3`} />
                        {link.text}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default ProfileMenu;