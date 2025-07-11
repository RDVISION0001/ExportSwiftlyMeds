import React, { useEffect } from 'react'

function PCIDSS() {
    useEffect(() => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);
    return (
        <div>PCIDSS</div>
    )
}

export default PCIDSS