import React, { useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import Navbar from "./Navbar";
import SideMenu from "./SideMenu";

// Main layout component for dashboard pages - Combines navbar and sidebar navigation with content area
const DashboardLayout = ({ children, activeMenu }) => {
    const { user } = useContext(UserContext);

    return (
        <div className="">
            <Navbar activeMenu={activeMenu} />

            <div className="flex">
                <div className="max-[1080px]:hidden">
                    <SideMenu activeMenu={activeMenu} />
                </div>

                <div className="grow mx-5">
                    {children}
                </div>
            </div>
        </div>
    );
};


export default DashboardLayout;
                

