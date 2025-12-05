"use client";

import { CarouselMy } from "@/components/us/CarouselMy";
import { Hero } from "@/components/us/Hero";
import { WhyChooseUs } from "@/components/us/WhyChooseUs";
import { LayoutFooter } from "@/components/us/LayoutFooter";

interface Hall {
  id: number;
  title: string;
  overview: string;
  backdrop_path: string;
  vote_average: number;
}

export default function Page() {
  // Sample halls data - replace backdrop_path with your own paths
  const halls: Hall[] = [
    {
      id: 1,
      title: "Grand Ballroom",
      overview:
        "Elegant ballroom with stunning chandeliers and spacious dance floor.",
      backdrop_path:
        "https://fourcolumns.com/wp-content/uploads/2023/07/Featured-image-6.jpg", // Replace with your image path
      vote_average: 4.8,
    },
    {
      id: 2,
      title: "Riverside Hall",
      overview: "Beautiful venue overlooking the river with modern amenities.",
      backdrop_path:
        "https://www.baltana.com/files/wallpapers-33/Path-Photography-Background-Wallpaper-116652.jpg", // Replace with your image path
      vote_average: 4.9,
    },
    {
      id: 3,
      title: "Crystal Palace",
      overview: "Luxurious wedding venue with crystal decor and garden views.",
      backdrop_path:
        "https://www.hamaraevent.com/uploads/blog/0098447001471609271.jpg", // Replace with your image path
      vote_average: 4.7,
    },
    {
      id: 4,
      title: "Garden Court",
      overview: "Charming outdoor venue perfect for intimate celebrations.",
      backdrop_path:
        "https://camelotbanquets.com/wp-content/uploads/2020/01/0901-%C2%A9-KATANA-PHOTO.jpg", // Replace with your image path
      vote_average: 4.6,
    },
    {
      id: 5,
      title: "Urban Lofts",
      overview: "Modern industrial-style venue in the heart of the city.",
      backdrop_path:
        "https://thumbs.dreamstime.com/b/landscape-background-path-urkiola-sunset-139943640.jpg", // Replace with your image path
      vote_average: 4.5,
    },
  ];

  return (
    <main className="h-screen overflow-y-scroll snap-y snap-mandatory">
      <CarouselMy halls={halls} />
      <Hero />
      <WhyChooseUs />
      <LayoutFooter />
    </main>
  );
}
