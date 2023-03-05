import React, { useState, useEffect } from 'react'; // Import React library and useState and useEffect hooks
import { PrismAsyncLight } from 'react-syntax-highlighter'; // Import syntax highlighter library PrismAsyncLight
import { location } from 'react-router-dom'; // Import location object from react-router-dom
import { Link ,useNavigate} from 'react-router-dom'; // Import Link and useNavigate components from react-router-dom
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'; // Import the Prism style called dracula
import {
    Grid,
    Paper,
    Typography,
    TextField,
    Button,
    IconButton,
    Card,
    CardHeader,
    CardContent,
    AppBar,
    Toolbar,
    Delete,
    Avatar,
} from '@mui/material'; // Import some components from Material UI
import ReactPaginate from 'react-paginate'; // Import the ReactPaginate component

import { makeStyles } from '@mui/styles'; // Import the makeStyles function from Material UI
import { pink } from '@mui/material/colors'; // Import the pink color from Material UI



const API_URL = 'http://localhost:1234'; // Define the API URL
const useStyles = makeStyles({ // Use the makeStyles function to define some styles
    root: { // The root style
      marginTop: 50, // The top margin is 50
      marginBottom: 50, // The bottom margin is 50
    },
    card: { // The card style
      padding: '10px 20px', // The padding is 10px top and bottom and 20px left and right
      marginBottom: 20, // The bottom margin is 20
    },
    avatar: { // The avatar style
      backgroundColor: pink[500], // The background color is Material UI's pink
    },
    form: { // The form style
      display: 'flex', // Use flexbox layout
      flexDirection: 'column', // Column layout
      justifyContent: 'center', // Vertically center
      alignItems: 'center', // Horizontally center
      marginBottom: 50, // The bottom margin is 50
    },
    textField: { // The text field style
      margin: '10px 0', // The top and bottom margin is 10 and the left and right margin is 0
      width: '80%', // The width is 80%
    },
    button: { // The button style
      margin: '10px 0', // The top and bottom margin is 10 and the left and right margin is 0
    },
  });


function Comment() {
    const handleLogout = () => {// Function to handle logout
        localStorage.removeItem('token');
        
        localStorage.removeItem('userId')
        localStorage.removeItem('useremail')
        setLoggedIn(false);
    };
    // const username = localStorage.getItem('useremail');             
    // console.log(username)
const [loggedIn, setLoggedIn] = useState(localStorage.getItem('token') ? true : false);
    const [editPostId, setEditPostId] = useState(null);
    const [currentPage, setCurrentPage] = useState(0);
const [postsPerPage, setPostsPerPage] = useState(10);
const[username,setusername]=useState(localStorage.getItem('useremail') ? true : false)
    
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [comment, setComments] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
    const [author, setAuthor] = useState('');

    const[vote,setVote]=useState(0)
const [editCommentId, setEditCommentId] = useState(null);

    const token = localStorage.getItem('token');

    useEffect(() => {// Hook to fetch posts and check if the user is logged in
        fetchPosts();
        const token = localStorage.getItem('token');
        if (token) {
            setLoggedIn(true);
            setusername(true)
        }
      }, []);

      const fetchPosts = async () => {// Function to fetch posts from the API
        try {
          const response = await fetch('http://localhost:1234/api/posts');
            const data = await response.json();
            
          const postsWithVotes = data.map(post => ({ ...post})); // 添加 votes 属性
            setPosts(postsWithVotes);
            
            console.log(data)
        } catch (error) {
          console.log(error);
        }
      }
      const handlePageClick = (data) => {// Function to handle pagination clicks
        setCurrentPage(data.selected);
    };
    ;
  const handlePostSubmit = async (e) => {// Function to handle pagination clicks
      e.preventDefault();
      const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to post!');
      return;
      }
      
      try {
          
      const response = await fetch('http://localhost:1234/api/posts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, content, author,token,vote }),
      });
        const data = await response.json();
        console.log(data)
      setPosts([...posts, data]);
      setTitle('');
      setContent('');
      setAuthor('');
    } catch (error) {
      console.log(error);
    }
  };

  const handleCommentSubmit = async (postId, commentContent, commentAuthor) => {// Function to handle comment submission
      // Check if there is a token in local storage
      const token = localStorage.getItem('token');
      if (token === "1") {
              
      }
       // If there is no token, display an alert message and return
    else if (!token) {
      alert('Please log in to comment!');
      return;
    }
      try {
           // Make a POST request to the API endpoint for adding a comment to a post
      const response = await fetch(`http://localhost:1234/api/posts/${postId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
          body: JSON.stringify({
              content: commentContent, author: commentAuthor,
              vote: 0,
          }),
      });
          const data = await response.json();
          console.log(data);
          // Update the posts state to include the new comment
      const updatedPosts = posts.map(post => {
          if (post._id === postId) {
            console.log(post._id)
          post.comments.push(data);
        }
        return post;
      });
      setPosts(updatedPosts);
    } catch (error) {
      console.log(error);
    }
    };
    // Function to handle post deletion
    const handlePostDelete = async (postId,post) => {
        console.log(post)
        const token = localStorage.getItem('token');
        if (token === "1") {
              
        } // If there is no token or token does not match the post token, display an alert message and return
      else if (!token || post.token !== token) {
            console.log(token)
            console.log(postId)
          alert('You are not authorized to edit this post!');
          return;
        }
        try {
            console.log(postId)
            console.log(token)
             // Make a DELETE request to the API endpoint for deleting a post
          const response = await fetch(`http://localhost:1234/api/posts/${postId}`, {
            method: 'DELETE',
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
                
              },
              body: JSON.stringify(post),
          });// If the request is successful, update the posts state to remove the deleted post
          if (response.ok) {
            const updatedPosts = posts.filter(post => post._id !== postId);
            setPosts(updatedPosts);
          } else {
            const data = await response.json();
            throw new Error(data.error);
          }
        } catch (error) {
          console.log(error);
          alert('Failed to delete the post.');
        }
      };
      // Function to handle post editing
      const handlePostEdit = (post) => { // Check if there is a token in local storage
          const token = localStorage.getItem("token");
          if (token === "1") {
              
          }
           // If there is no token or token does not match the post token, display an alert message and return
        else if (!token || post.token !== token) {
          alert("You are not authorized to edit this post!");
          return;
        }
        setTitle(post.title);
        setAuthor(post.author);
        setContent(post.content);
        setEditPostId(post._id);
        setComments(post.comments);
        setPosts((prevPosts) =>
          prevPosts.map((p) =>
            p._id === post._id ? { ...p, showComments: true } : p
          )
        );
      };
    // const handleCommentEdit = ( comment) => {
    //     const token = localStorage.getItem("token");
    //     if (token === "1") {
            
    //     }
    //     setContent(comment.content);
    //     setAuthor(comment.author);
    //     setEditCommentId(comment._id);
    //     setPosts((prevPosts) =>
    //       prevPosts.map((p) =>
    //         p._id === comment._id ? { ...p, } : p
    //       )
    //     );
    //       };
      const handlePostEditSubmit = (e) => {// Function to handle post edit submission
        e.preventDefault();
      
        const post = { // Create a post object with the updated post data
          title,
          author,
          content,
          token, // add token to post data
        };
          const token1 = localStorage.getItem("token");
          if (token === "1") {
              
          }
        else if (!token1 || token !== token1) {
          alert("You are not authorized to edit this post!");
          return;
        }
      
        if (post.title !== "" && post.author !== "" && post.content !== "") {
          fetch(`http://localhost:1234/api/posts/${editPostId}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token1}`,
            },
            body: JSON.stringify(post),//Include updated post data in the request body
          })
            .then((res) => res.json())
            .then((data) => {
              setPosts((prevPosts) =>
                prevPosts.map((post) =>
                  post._id === editPostId ? { ...data, showComments: true } : post
                )
              );
              setEditPostId(null);
              setTitle("");
              setAuthor("");
              setContent("");
              setComments([]);
            })
            .catch((err) => console.error(err));
        } else {
          setEditPostId(null);
          setTitle("");
          setAuthor("");
          setContent("");
          setComments([]);
        }
      };
      const handlePostCancel = () => {
        setEditPostId(null);
        setTitle('');
        setContent('');
        setAuthor('');
    }

    
    // Render the UI components including header, post form and post list
  return (
      <div>
          <AppBar position="static">
                <Toolbar>
                    <Button color="inherit" component={Link} to="/comment">
                        {'My Blog'}
                    </Button>
                    {loggedIn && (
                      <Button color="inherit"
                          type="logout"
                          onClick={handleLogout}>
                            {'Logout'}
                        </Button>
                  )}
                  <Button color="inherit" component={Link} to="/User">
                  {'Userinformation'}
                  </Button>
                  <Button color="inherit" component={Link} to="/">
            {'Login'}
                    </Button>   
                </Toolbar>
            </AppBar>
          <h1>My Blog</h1>
          {editPostId !== null ? (
            <form className={classes.form} onSubmit={handlePostEditSubmit}>
                <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    label="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
            />
            {/* Content input field */}
                <TextField
                    className={classes.textField}
                    fullWidth
                    variant="outlined"
                    label="Content"
                    multiline
                    rows={4}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                      required
                      
                  />
                   {/* Submit and cancel button */}
                <Button
                    className={classes.button}
                    variant="contained"
                    color="primary"
                    type="submit"
                >
                    Save
                </Button>
                <Button
                    className={classes.button}
                    variant="contained"
                    onClick={handlePostCancel}
                >
                    Cancel
                </Button>
            </form>
          ) : (
                  
                  <form className={classes.form} onSubmit={handlePostSubmit}>
                      {/* Show post create form */}
                <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Author"
                            value={author}
                            onChange={(e) => setAuthor(e.target.value)}
                            required
                        />
                    </Grid>
                          <Grid item xs={12}>
                          {/* <PrismAsyncLight language="javascript" style={dracula}> */}
                        <TextField
                            fullWidth
                            variant="outlined"
                            label="Content"
                            multiline
                            rows={4}
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                                  />
                                  {/* </PrismAsyncLight> */}
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            className={classes.button}
                            variant="contained"
                            color="primary"
                            type="submit"
                        >
                            Post
                        </Button>
                    </Grid>
                </Grid>
            </form>
        )}

      <ul>
              {posts.map((post) => (
                  <Grid item xs={12} key={post._id}>
                      <Paper elevation={3} className={classes.card}>
                          <CardHeader
                              avatar={
                                  <Avatar className={classes.avatar}>
                                      {post.author.charAt(0)}
                                  </Avatar>
                              }
                              title={post.title}
                              subheader={`by ${post.author}`}
                          />
                          <CardContent>
                              {editPostId === post._id ? (
                                  <form className={classes.form}>
                                      <TextField
                                          className={classes.textField}
                                          label="Title"
                                          variant="outlined"
                                          value={title}
                                          onChange={(e) => setTitle(e.target.value)}
                                          required
                                      />
                                      <TextField
                                          className={classes.textField}
                                          label="Content"
                                          variant="outlined"
                                          multiline
                                          rows={4}
                                          value={content}
                                          onChange={(e) => setContent(e.target.value)}
                                          required
                                      />
                                      <Button
                                          className={classes.button}
                                          variant="contained"
                                          color="primary"
                                          type="submit"
                                          onClick={handlePostEditSubmit}
                                      >
                                          Save
                                      </Button>
                                      <Button
                                          className={classes.button}
                                          variant="contained"
                                          onClick={handlePostCancel}
                                      >
                                          Cancel
                                      </Button>
                                  </form>
                              ) : (
                                // display post content
                              
                                  <>
                                      <Typography variant="body2" component="div">
<PrismAsyncLight language="javascript" style={dracula}>{post.content}</PrismAsyncLight>
  

                                      </Typography>
                                          <Typography color="textSecondary" component="p">
                                              
                                          Votes: {post.vote}
                                      </Typography>
                                          <Button
                                               // handle upvote click
  className={classes.button}
  variant="contained"
                                              color="primary"
                                              type="upvote"
  onClick={async () => {
    const newVotes = post.vote + 1;
      console.log(newVotes)
      console.log(post)
      var tokenuser = localStorage.getItem('token')
      console.log(tokenuser)
fetch(`http://localhost:1234/api/posts/${post._id}/upvote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    body: JSON.stringify({
        vote: post.vote + 1,
        token:post,
    }),
})
    

            .then((data) => {
                setPosts((prevPosts) =>
                    prevPosts.map((post) =>
                        post._id === editPostId ? { ...data, vote:post.vote } : post
                    )
                )
            })
    
      .catch((error) => console.error(error));
      fetchPosts()
                                              fetchPosts();}}
>
  Upvote
</Button>

                                      <Button
                                          className={classes.button}
                                          variant="contained"
                                          color="secondary"
                                          onClick={async () => {
                                            const newVotes = post.vote - 1;
                                              console.log(newVotes)
                                              console.log(post)
                                              
                                        fetch(`http://localhost:1234/api/posts/${post._id}/upvote`, {
                                              method: 'POST',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                Authorization: `Bearer ${localStorage.getItem('token')}`,
                                              },
                                              body: JSON.stringify({vote: post.vote - 1}),
                                            })
                                        
                                                    .then((data) => {
                                                        setPosts((prevPosts) =>
                                                            prevPosts.map((post) =>
                                                                post._id === editPostId ? { ...data, vote:post.vote } : post
                                                            )
                                                        )
                                                    })
                                            
                                              .catch((error) => console.error(error));
                                              fetchPosts()
                                              fetchPosts() ;
                                          }}
                                      >
                                          Downvote
                                          </Button>
                                          <Typography variant="caption" color="textSecondary" component="p">
  {`Last edited: ${new Date(post.date).toLocaleString()}`}
</Typography>
                                          <Button
                                              // handle edit post click
                                          className={classes.button}
                                              variant="contained"
                                              type="showcomment"
                                          onClick={() =>
                                              setPosts((posts) =>
                                                  posts.map((p) =>
                                                      p._id === post._id ? { ...p, showComments: !p.showComments } : p
                                                  )
                                              )
                                          }
                                      >
                                          {post.showComments ? "Hide Comments" : "Show Comments"}
                                      </Button>
                                      <Button
    className={classes.button}
    variant="contained"
                                              color="primary"
                                              type="edit"
    onClick={() => {
        handlePostEdit(post);
        // handleCommentEdit(comment);
      }}
  >
    Edit Post
                                          </Button>
                                          
                                          <Button
    className={classes.button}
    variant="contained"
                                              color="secondary"
                                              type="delete"
    onClick={() => handlePostDelete(post._id,post)}
>
    Delete
                                          </Button>
                                          

                                  </>
                              )}
                              

                        
                              {post.showComments && (
                                  <div className={classes.comments}>
                                      <form
                                          onSubmit={(e) => {
                                              e.preventDefault();
                                              const commentContent = e.target.elements.content.value;
                                              const commentAuthor = e.target.elements.author.value;
                                              handleCommentSubmit(post._id, commentContent, commentAuthor);
                                              e.target.reset();
                                          }}
                                      >
                                          <TextField
                                              className={classes.commentInput}
                                              label="Comment"
                                              name="content"
                                              variant="outlined"
                                              size="small"
                                              fullWidth
                                              required
                                          />
                                          <TextField
                                              className={classes.commentInput}
                                              label="Author"
                                              name="author"
                                              variant="outlined"
                                              size="small"
                                              fullWidth
                                              required
                                          />
                                          <Button
                                              className={classes.commentButton}
                                              variant="contained"
                                              color="primary"
                                              type="submit"
                                          >
                                              Comment
                                          </Button>
                                          
                                      </form>
                                     
                                      <ul className={classes.commentList}>
                                          {post.comments.map((comment) => (
                                              <li key={comment._id} className={classes.comment}>
                                                  <CardHeader
                              
                              title={comment.title}
                              subheader={`by ${comment.author}`}
                                                  />
                                                  
                                 
                              
                                                  <Typography variant="body2" component="p">
                                                      {comment.content}
                                                  </Typography>
                                                  {/* <Avatar >
                                      {comment.author.charAt}
                                  </Avatar> */}
                                                  <Typography
                                                      variant="caption"
                                                      color="textSecondary"
                                                      component="p"
                                                  >
                                                      Author: {comment.author}
                                                  </Typography>
                                                
                                          <Typography color="textSecondary" component="p">
                                              
                                          Votes: {comment.vote}
                                                  </Typography>
                                                  
                                                  <Button
  className={classes.button}
  variant="contained"
                                                      color="primary"
                                                      
                                                      onClick={async () => {
      // Increase the vote count for the comment by sending a POST request to the server
    
    const newVotes = comment.vote + 1;
      console.log(newVotes)
      console.log(comment)
      var tokenuser = localStorage.getItem('token')
      console.log(tokenuser)
fetch(`http://localhost:1234/api/posts/${comment._id}/upvote/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
    
      },
    body: JSON.stringify({
        vote: comment.vote + 1,
        token:comment,
    }),
})
    

            .then((data) => {
                setComments((prevPosts) =>
                    prevPosts.map((comment) =>
                    comment._id === editCommentId ? { ...data, vote:comment.vote } : comment
                    )
                )
            })
    
      .catch((error) => console.error(error));
      fetchPosts()
                                              fetchPosts();}}
>
  Upvote
</Button>

                                      <Button
                                          className={classes.button}
                                          variant="contained"
                                                      color="secondary"
                                                      type="downvote"
                                                      onClick={async () => {
                                               // Decrease the vote count for the comment by sending a POST request to the server
                                            const newVotes = post.vote - 1;
                                              console.log(newVotes)
                                              console.log(post)
                                              
                                        fetch(`http://localhost:1234/api/posts/${comment._id}/upvote/comment`, {
                                              method: 'POST',
                                              headers: {
                                                'Content-Type': 'application/json',
                                                
                                              },
                                            body: JSON.stringify({
                                                vote: comment.vote - 1,
                                            token:comment}),
                                            })
                                        
                                            .then((data) => {
                                                        // Update the comment's vote count
                                                        setComments((prevPosts) =>
                                                            prevPosts.map((comment) =>
                                                            comment._id === editPostId ? { ...data, vote:comment.vote } : comment
                                                            )
                                                        )
                                                    })
                                            
                                              .catch((error) => console.error(error));
                                              fetchPosts()
                                              fetchPosts() ;
                                          }}
                                      >
                                          Downvote
                                                  </Button>
                                                  <Typography variant="caption" color="textSecondary" component="p">
  {`Last edited: ${new Date(comment.date).toLocaleString()}`}
</Typography>
                                              </li>
                                          ))}
                                          
                                      </ul>
                                      
                                  </div>
                              )}
                              
</CardContent >
                          
                      </Paper>
                      
                  </Grid>
                  
              ),
              )}
              <ReactPaginate
  previousLabel={'Previous'}
  nextLabel={'Next'}
  breakLabel={'...'}
  breakClassName={'break-me'}
  pageCount={Math.ceil(posts.length / postsPerPage)}
  marginPagesDisplayed={2}
  pageRangeDisplayed={5}
  onPageChange={handlePageClick}
  containerClassName={'pagination'}
  activeClassName={'active'}
/> 
          </ul>
             
    </div>
  );
}

export default Comment;