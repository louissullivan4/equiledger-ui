import React from 'react';
import { NavLink } from 'react-router-dom';
import { BiHomeAlt, BiMoney, BiSolidDoorOpen } from "react-icons/bi";
import '../styles/styles.css';

import AuthService from '../services/AuthService';
import { useNavigate } from 'react-router-dom'

const Sidebar = () => {
    const navigate = useNavigate();

    const handleLogout = async (e) => {
        e.preventDefault();
        await AuthService.logout();
        navigate('/');
    };
    return (
        <nav>
            <ul>
                <li>
                    <NavLink to="/home">
                        <div className="logo">
                            <BiHomeAlt />
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/clients">
                        <div className="logo">
                            <BiMoney/>
                        </div>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/">
                        <div className="logo" onClick={handleLogout}>
                            <BiSolidDoorOpen/>
                        </div>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Sidebar;