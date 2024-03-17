import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logo } from "../assets";
import { navlinks } from "../constants";

const Icon = ({ styles, name, imgUrl, isActive, disabled, handleClick }) => (
    <div
        className={`w-[48px] h-[48px] rounded-[10px] ${
            isActive && isActive === name && "bg-gray-800"
        } flex justify-center items-center ${
            !disabled && "cursor-pointer"
        } ${styles}`}
        onClick={handleClick}
    >
        {!isActive ? (
            <img src={imgUrl} alt="fund_logo" className="w-1/2 h-1/2" />
        ) : (
            <img
                src={imgUrl}
                alt="fund_logo"
                className={`w-1/2 h-1/2 ${isActive !== name && "grayscale"}`}
            />
        )}
    </div>
);

const Sidebar = () => {
    const navigate = useNavigate();
    const [isActive, setIsActive] = useState("dashboard");

    return (
        <div className="flex flex-col h-[100vh]">
            <Link to="/" className="mb-6">
                <Icon styles="w-[52px] h-[52px] bg-gray-800" imgUrl={logo} />
            </Link>

            <div className="flex-1 flex flex-col justify-between items-center bg-[#e5eaee] rounded-[20px] w-[76px] py-4">
                <div className="flex flex-col justify-center items-center gap-3">
                    {navlinks.map((link) => (
                        <Icon
                            key={link.name}
                            {...link}
                            isActive={isActive}
                            handleClick={() => {
                                if (!link.disabled) {
                                    setIsActive(link.name);
                                    navigate(link.link);
                                }
                            }}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
