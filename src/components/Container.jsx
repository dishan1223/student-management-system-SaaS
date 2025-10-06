// this container component is used to center the content of the page
import React from "react";

const Container = ({ children }) => {
    return (
        <div className="w-full overflow-hidden lg:max-w-6xl mx-auto">
            {children}
        </div>
    );
};

export default Container;
