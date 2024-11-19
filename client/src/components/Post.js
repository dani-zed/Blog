// import React from 'react'
// import { Link } from 'react-router-dom'
// import {format} from "date-fns"

// function Post({author,title,summary,cover,content,createdAt}) {
//   return (
//     <div className="post">
//     <div className="image">
//     <img src={cover} alt="Blog-Image" />

//     </div>
//    <div className="texts">
//    <h2>{title}</h2> 
//    <p className="info">
//     <Link to="/" className="author">{author.username}</Link>
//     <time>{format(new Date(createdAt),'MMM d, yyyy HH:mm')}</time>
//    </p>
//    <p className="summary">{summary}</p>
//    </div>
   
//   </div>
//   )
// }

// export default Post
import React from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

function Post({_id, author, title, summary, cover, content, createdAt }) {
  const coverUrl = `http://localhost:4000/${cover}`; // Ensure this URL matches your backend

  return (
    <div className="post">
      <div className="image">
        <Link to={`/post/${_id}`}>
        <img src={coverUrl} alt="Blog-Image" onError={(e) => e.target.style.display = 'none'} />

        </Link>
      </div>
      <div className="texts">
      <Link to={`/post/${_id}`}>

        <h2>{title}</h2>
        </Link>
        <p className="info">
          <Link to="/" className="author">{author?.username || 'Unknown Author'}</Link>
          <time>{createdAt ? format(new Date(createdAt), 'MMM d, yyyy HH:mm') : 'Date not available'}</time>
        </p>
        <Link to={`/post/${_id}`}>
        <p className="summary">{summary}</p>
        </Link>
        <Link to={`/post/${_id}`}>

        <p>Read more......</p>
</Link>
      </div>
    </div>
  );
}

export default Post;
