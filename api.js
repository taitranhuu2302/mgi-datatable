import { request } from "./config.js";

export const fetchAllBlogs = () =>
  request("GET", "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs");

export const createBlogApi = (data) =>
  request(
    "POST",
    "https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs",
    data
  );

export const updateBlogApi = (id, data) =>
  request(
    "PUT",
    `https://617b71c2d842cf001711bed9.mockapi.io/api/v1/blogs/${id}`,
    data
  );
