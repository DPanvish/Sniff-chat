import React from 'react'
import assets from '../util/assets'

const LeftSidebar = ({selectedUser, setSelectedUser}) => {
  return (
    <div>
      <div className="pb-5">
        <div className="flex justify-between items-center">
            <img src={assets.logo} />
        </div>
      </div>
    </div>
  )
}

export default LeftSidebar
