import React, { useEffect, useState } from 'react'
import axiosInstance from '../AuthContext/AxiosInstance'
import { useParams } from 'react-router-dom'
import clsx from 'clsx'

function Unsubscribe() {

  const [htmlTemp, setHtmlTemp] = useState()

  const { email } = useParams()
  const fetcUbsubscribe = async () => {
    const resp = await axiosInstance.get(`/review/getUnsubscribeMessage/${email}`)
    setHtmlTemp(resp.data)
  }

  useEffect(() => {
    fetcUbsubscribe()
  }, [email])
  return (
    <div>
      {/* Email content */}
      {htmlTemp && <div
        className={clsx(
          "flex-1 overflow-y-auto p-4 width-full",
        )}
        dangerouslySetInnerHTML={{ __html: htmlTemp }}
      />}
    </div >
  )
}

export default Unsubscribe