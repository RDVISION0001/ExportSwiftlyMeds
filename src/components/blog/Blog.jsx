import React, { useEffect, useRef } from 'react'
import Blogimage1 from "../../assets/Blog/Blogimage1.png"
import Blogimage2 from "../../assets/Blog/Blogimage2.png"
import Blogimage3 from "../../assets/Blog/Blogimage3.png"
import Blogimage4 from "../../assets/Blog/Blogimage4.png"
import Blogimage5 from "../../assets/Blog/Blogimage5.png"

const Blog = () => {
    const topRef = useRef(null);
    useEffect(() => {
        topRef.current?.scrollIntoView({ behavior: 'smooth' });
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, []);

    const blogPosts = [
        { title: "Understanding Conception Fertility", img: Blogimage5, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage2, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage3, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage5, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage2, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage5, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage2, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage3, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
        { title: "Understanding Conception Fertility", img: Blogimage5, content: "If you have been trying to get pregnant for over a year now, then you might want to learn about fertility. Every month..." },
    ];

    const blogCategories = [
        { name: "Gym", img: Blogimage5, content: "Understanding Conception: Fertility, Timing, and Patience" },
        { name: "Weight gain", img: Blogimage2, content: "Understanding Conception: Fertility, Timing, and Patience" },
        { name: "Weight loss", img: Blogimage3, content: "Understanding Conception: Fertility, Timing, and Patience" },
        { name: "Sexual health", img: Blogimage4, content: "Understanding Conception: Fertility, Timing, and Patience" },
    ];

    const categories = [
        { name: "Men's Healthcare", img: Blogimage5 },
        { name: "Intimacy", img: Blogimage1 },
        { name: "Relationship", img: Blogimage2 },
        { name: "Nutrition", img: Blogimage3 },
        { name: "Mental Health", img: Blogimage4 },
    ];

    return (
        <>
            <div ref={topRef}>
                <div className="container mx-auto p-4">
                    {/* Search Bar */}
                    <div className="flex justify-center mb-8">
                        <input
                            type="text"
                            placeholder="Search for posts..."
                            className="w-full max-w-5xl p-2 border rounded-lg"
                        />
                    </div>

                    {/* Explore by Category */}
                    <div className="mb-12">
                        <h2 className="text-2xl text-center mb-6 mt-12">Explore by Category</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 max-w-6xl mx-auto">
                            {categories.map((category, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden mb-2">
                                        <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                                    </div>
                                    <p className="text-center text-sm md:text-base bg-white p-2 w-full rounded border whitespace-nowrap">{category.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Our Latest Blog */}
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-2xl mt-10 text-center mb-6">Our Latest Blog</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                            {blogPosts.map((post, index) => (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg shadow hover:shadow-md transition-shadow">
                                    <img src={post.img} alt={post.title} className="w-full h-40 object-cover mb-2 rounded" />
                                    <h3 className="text-lg font-semibold">{post.title}</h3>
                                    <p className="text-gray-600">{post.content.substring(0, 100)}...</p>
                                    <a href="#" className="text-blue-500 hover:text-blue-700">Continue reading</a>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Load More Button */}
                    <div className="flex justify-center mb-36">
                        <button className="px-6 py-2 border md:text-xl lg:text-3xl hover:bg-gray-300 transition-colors">
                            Load More
                        </button>
                    </div>

                    {/* Blog by Categories - Updated to match Explore by Category */}
                    <div className="max-w-6xl mx-auto mb-12">
                        <h2 className="lg:text-2xl text-xl text-left mb-6">Blog by Categories</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {blogCategories.map((category, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <div className='bg-gray-200 rounded-xl p-2 mb-3'>
                                        <div className="w-full aspect-square overflow-hidden mb-2">
                                            <img src={category.img} alt={category.name} className="w-full h-full object-cover" />
                                        </div>
                                        <p className='lg:text-lg text-sm'>{category.content}</p>
                                    </div>
                                    <p className="text-center text-md md:text-xl lg:text-3xl bg-white p-2 w-full">{category.name}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Blog;