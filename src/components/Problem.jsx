import React, { useEffect } from 'react'
import { useTheme } from '../provider/ThemeProvider'
import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { useUser } from '../provider/UserProvider';
import { getProblemUserData } from '../utils/firestore';

const Problem = ({problem}) => {
    const [theme] = useTheme()
    const [user] = useUser()
    
    const {data: problemuserData} = useQuery({
      queryKey: ['problemUser', problem.slug, user?.uid],
      queryFn: async () => await getProblemUserData(problem.slug, user.uid)
    })

  return (
    <tr className={`secondary-${theme}-bg`}>
        <td className='status'>{problemuserData?.status === "accepted" && <IoMdCheckmarkCircleOutline />}</td>
        <td><Link to={`${problem.slug}`} className={`problem midtone-${theme}`}>{problem.name}</Link></td>
        <td style={{color: problem.rank.color}}>{problem.rank.name}</td>
    </tr>
  )
}

export default Problem