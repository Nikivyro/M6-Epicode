import React from 'react';

const Navbar = () => {
    return (
        <nav className="bg-orange-700 p-3 text-white flex flex-wrap justify-between">
            <div>Epiblog</div>
            <div>
                <ul className="flex gap-4">
                    <li>link 1</li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;