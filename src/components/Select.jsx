import React, { useState } from 'react'
import '../styles/select.css'

const Select = ({options, setter, className}) => {
    const [selected, setSelected] = useState({name: "Select"})
    const [isOpen, setIsOpen] = useState(false)

    const handleSelect = (option) => {
        setter(option)
        setSelected(option)
    }

  return (
    <div className={`select ${className}`} onClick={() => setIsOpen(!isOpen)}>
        <div className="name">{selected.name}</div>

        <div className={`options ${isOpen ? 'open' : ''}`}>
            {options?.map((option, i) => {
                return (
                    <div key={i} className="option" onClick={() => handleSelect(option)}>
                        {option.icon && <div className='icon'>
                            <img src={option.icon} alt={option.name} />
                        </div>}
                        <div className="detail">
                            <div className="name">{option.name}</div>
                            {option.tech && <div className="tech">{option.tech}</div>}
                        </div>
                    </div>
                )
            })}
        </div>
    </div>
  )
}

export default Select