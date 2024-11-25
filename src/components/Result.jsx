import React, { useState } from 'react'
import { FaCheckCircle } from "react-icons/fa";
import { MdError } from "react-icons/md";

const Result = ({result, index}) => {
    const [opened, setOpened] = useState(false)
  return (
    <div className={`result ${opened ? 'open' : 'close'} ${result.status === "passed" ? 'passed' : 'failed'}`} onClick={() => setOpened(prev => !prev)}>
        <div className="message">{result.message === "" ? `Test Case ${index + 1}` : result.message}</div>
        <div className="response">
            {result.status === "passed" ? <FaCheckCircle /> : <MdError />}
            {result.response}
        </div>
    </div>
  )
}

export default Result