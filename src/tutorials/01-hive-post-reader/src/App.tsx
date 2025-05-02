import React, { useEffect, useState } from "react";
import axios from "axios";

interface Post {
  title: string;
  author: string;
  permlink: string;
  created: string;
}

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const response = await axios.post("https://api.hive.blog", {
        jsonrpc: "2.0",
        method: "condenser_api.get_discussions_by_created",
        params: [{ tag: "hive", limit: 5 }],
        id: 1,
      });
      setPosts(response.data.result);
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 Publicaciones recientes en Hive</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.permlink}>
            <a
              href={`https://peakd.com/@${post.author}/${post.permlink}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.title}
            </a>{" "}
            <small>por @{post.author}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}
