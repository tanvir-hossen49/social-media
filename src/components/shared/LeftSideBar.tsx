import { useEffect } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Button } from "../ui/button";
import { useSignOutAccount } from "@/lib/react-query/queriesAndMutations";
import { useUserContext } from "@/context/AuthContext";
import { sidebarLinks } from "@/constants";
import { INavLink } from "@/types";

const LeftSideBar = () => {
    const { pathname } = useLocation();
    const {mutate: signOut, isSuccess} = useSignOutAccount();
    const navigate = useNavigate();
    const { user } = useUserContext()

    useEffect(() => {
        if(isSuccess) {
            navigate(0)
        }
    }, [isSuccess])

    return (
        <nav className="leftsidebar">
            <div className="flex flex-col gap-11">
                <Link to='/' className="flex gap-3 items-center">
                    <img 
                        src='/public/assets/images/logo.svg'
                        alt="logo" width={130} height={325}
                    />
                </Link>

                <Link to={`/profile/${user.id}`} className="flex items-center gap-3">
                    <img src={user.imageUrl || '/public/assets/images/profile.png'} 
                    alt="profile image" 
                    className="h-14 w-14 rounded-full"
                    />
                    <div className="flex flex-col">
                        <p className="body-bold">{user.name}</p>
                        <p className="small-regular">@{user.username}</p>
                    </div>
                </Link>

                <ul className="flex flex-col gap-6">
                    {
                        sidebarLinks.map((link: INavLink) => {
                            const isActive = pathname === link.route;

                            return (
                                <li key={link.label} className={`group leftsidebar-link
                                ${isActive && 'bg-primary-500'}
                                `}>
                                    <NavLink to={link.route}
                                    className='flex gap-4 items-center p-4'>
                                        <img src={link.imgURL}
                                        alt={link.label} 
                                        className={`group-hover:invert-white
                                        ${isActive && 'invert-white'}
                                        `}
                                        />
                                        {link.label}
                                    </NavLink>
                                </li>
                            )
                        })
                    }
                </ul>
            </div>

            <Button 
                variant="ghost" 
                className="shad-button_ghost " onClick={
                () => signOut()
            }>
                <img src="/public/assets/icons/logout.svg" alt="log out" /> 
                <p className="small-medium lg:base-medium">Logout</p>
            </Button>
        </nav>
    );
};

export default LeftSideBar;