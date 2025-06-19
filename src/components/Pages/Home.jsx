import React, { useEffect, useRef } from 'react'
import Home1 from './Home1'
import Home2 from './Home2'

function Home() {

  const topRef = useRef(null);

  useEffect(() =>{
    topRef.current?.scrollIntoView({ behavior : 'smooth'});
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
  }, [])

  return (
    <div ref={topRef}>
        <Home1/>
        <Home2/>
    </div>
  )
}

export default Home