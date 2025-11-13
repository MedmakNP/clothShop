import React from "react";
import Blog from "../Components/Blog/blog";
import Footer from "../Components/Footer/footer";
import Header from "../Components/Header/header";
import HotBar from "../Components/HotBar/hotBar";

function BlogPage() {
  return (
    <>
      <Header />
      <HotBar />
      <Blog />
      <Footer />
    </>
  );
}

export default BlogPage;
