
import { IoPersonCircleOutline } from "react-icons/io5";
import Rootments from '../../public/Rootments.jpg'
import { useState } from "react";
const Header = ({
    // eslint-disable-next-line react/prop-types
    title
}) => {
    const currentusers = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object
    console.log(currentusers);
    const [logOut, setlogOut] = useState(false)
    const HanndleRemove = () => {
        try {
            localStorage.removeItem("rootfinuser");

            window.location.reload();

        } catch (error) {
            throw new Error(error)
        }
    }
    return (

        <>


            <nav className="bg-white ml-[250px] border-gray-200  dark:border-gray-700">
                <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
                    <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                        <img src={Rootments} className="h-8 rounded-md" alt="Flowbite Logo" />
                        <span className="self-center text-2xl font-semibold whitespace-nowrap text-black">{title}</span>
                    </a>

                    <div onClick={() => setlogOut((prev) => !prev)}
                        className="hidden cursor-pointer w-full md:block md:w-auto" id="navbar-multi-level" >
                        <div className="flex items-center gap-4">
                            <h2>{currentusers?.username}</h2>
                            <IoPersonCircleOutline className="text-4xl  text-green-600" />
                        </div>

                    </div>
                </div>
                {logOut && <div className="flex justify-center text-center w-30 h-20 rounded-md shadow-2xl bg-slate-200 absolute right-5 ">

                    <button className="px-3 h-10 mt-[20px] bg-red-500 text-white rounded-md hover:bg-red-600 cursor-pointer" onClick={HanndleRemove}>Logout</button>

                </div>}
            </nav>


        </>

    )
}

export default Header