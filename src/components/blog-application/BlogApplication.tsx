import React, { useEffect, useState } from "react";
import { BackButton } from "../../shared/back-button/BackButton";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Card } from "react-bootstrap";
import { CardContent } from "@mui/material";

interface Post {
  id: number;
  title: string;
  body: string;
}

const BlogApplication: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/posts?_limit=10")
      .then((res) => res.json())
      .then((data) => {
        setPosts(data);
        setLoading(false);
      });
  }, []);

  return (
    <div className="container my-4">
      <BackButton />
      <h1 className="mb-4 text-center">My Blog</h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="row">
          {posts.map((post) => (
            <div className="col-md-6 mb-4" key={post.id}>
              <Card className="h-100">
                <CardContent>
                  <h5>{post.title}</h5>
                  <p>{post.body}</p>
                  <Button variant="primary">Read More</Button>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BlogApplication;
