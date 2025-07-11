import React from 'react'

function PCIDSS() {
     useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
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