import React from 'react'

const InputField = ({label, type, value, onChange}) => {
  return (
     <div className="flex flex-col gap-1 mb-3">
      <label className="text-sm font-medium">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  )
}

export default InputField