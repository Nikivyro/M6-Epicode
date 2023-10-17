import React from 'react';
import EditPostModal from './EditPostModal';

export default function SinglePost({ _id, title, cover, category, author, rate, readTime }) {
  return (
    <div key={_id}>
      <img src={cover} alt={title} />
      <h3>{title}</h3>
      <p>{category}</p>
      {author && (
        <>
          <img src={author.avatar} alt={author.name} width={30}/>
          <p>{author.name}</p>
        </>
      )}
      <p>{rate}</p>
      {readTime && (
        <>
          <p>{readTime.value}</p>
          <p>{readTime.unit}</p>
        </>
      )}
      <EditPostModal postId={_id}/>
    </div>
  );
}
