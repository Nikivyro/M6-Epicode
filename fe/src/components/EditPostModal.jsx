import React, { useState } from 'react'

function EditPostModal({_id}) {
    const [postId, setPostId] = useState(null)

    const handleEditPost = () => {
        setPostId(_id)
    }

    return (
        <button onClick={handleEditPost}>modifica post</button>
    )
}

export default EditPostModal