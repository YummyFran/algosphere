import { useQuery } from '@tanstack/react-query'
import React from 'react'
import { useOutletContext, useParams } from 'react-router'
import { getCodeBits } from '../utils/firestore'
import { useUser } from '../provider/UserProvider'
import CodeBitItem from './CodeBitItem'

const CodeBits = () => {
    const { filterBy } = useParams()
    const [user] = useUser()
    const createRef = useOutletContext()

    const {data: codeBits, isLoading} = useQuery({
        queryKey: ['codebits', filterBy],
        queryFn: async () => await getCodeBits(filterBy, user.uid)
    })

    if(isLoading) return "Loading.."
  return (
    <>
        {codeBits?.length <= 0 ? (
            <div className='no-code'>
                <div className="message">No code bits yet.</div>
                <div className="sub-message">Create your first bit sized code now!</div>
                <button className="create" onClick={() => createRef.current.focus()}>Create</button>
            </div>
        ):(
            <>
                {codeBits?.map((codebit, i) => {    
                    return <CodeBitItem key={i} codebit={codebit} filterBy={filterBy}/>
                })}
            </>
        )}
    </>
  )
}

export default CodeBits