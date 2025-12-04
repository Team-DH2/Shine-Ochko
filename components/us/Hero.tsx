import React from "react";
import Image from "next/image";
import { Users, DollarSign, Star } from "lucide-react";

const featuredHalls = [
  {
    id: 1,
    title: "The Grand Ballroom",
    location: "Downtown Metropolis",
    capacity: 500,
    rate: 250,
    rating: 4.8,
    imageUrl:
      "https://thumbs.dreamstime.com/b/landscape-background-path-urkiola-sunset-139943640.jpg", // Replace with actual image path
  },
  {
    id: 2,
    title: "Sunset Garden Court",
    location: "Oceanview Heights",
    capacity: 150,
    rate: 120,
    rating: 4.9,
    imageUrl:
      "https://s3-media0.fl.yelpcdn.com/bphoto/_2-Ayj15iTMesu5_X2YWFA/1000s.jpg",
  },
  {
    id: 3,
    title: "The Onyx Loft",
    location: "Industrial District",
    capacity: 80,
    rate: 95,
    rating: 4.7,
    imageUrl:
      "https://www.hamaraevent.com/uploads/blog/0098447001471609271.jpg",
  },
  {
    id: 4,
    title: "Celestial Hall",
    location: "Starlight Mountain",
    capacity: 300,
    rate: 200,
    rating: 4.6,
    imageUrl:
      "https://fourcolumns.com/wp-content/uploads/2023/07/Featured-image-6.jpg",
  },
  {
    id: 5,
    title: "The Ivory Suite",
    location: "Uptown Plaza",
    capacity: 50,
    rate: 75,
    rating: 4.8,
    imageUrl:
      "https://ingenium.ca/wp-content/uploads/2024/12/cstm-event-hall-image-gallery-2.jpg",
  },
  {
    id: 6,
    title: "Riverside Pavilion",
    location: "Green Valley",
    capacity: 200,
    rate: 150,
    rating: 4.9,
    imageUrl:
      "https://huree.mn/wp-content/uploads/2024/01/391699141_709680631195887_625406038368004298_n.jpg",
  },
];

export const Hero = () => {
  return (
    <section className="bg-black text-white w-full min-h-screen flex flex-col justify-start snap-start overflow-hidden py-16 lg:py-24">
      <div className="container mx-auto px-4 text-center">
        {/* Main Hero Text */}
        <h2
          className="font-extrabold text-5xl lg:text-8xl mb-4 animate-fade-in-up"
          style={{ animationDelay: "200ms" }}
        >
          Our Featured Event Halls
        </h2>
        <p
          className="max-w-3xl mx-auto text-lg text-blue-600 animate-fade-in-up"
          style={{ animationDelay: "400ms" }}
        >
          Discover a variety of stunning venues perfect for any occasion. From
          grand ballrooms to intimate garden courts, we have the perfect space
          for your next event.
        </p>
      </div>

      {/* Featured Cards Grid */}
      <div className="container mx-auto px-4 mt-12 lg:mt-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredHalls.map((hall, index) => (
            <div
              key={hall.id}
              className="bg-neutral-900 rounded-lg overflow-hidden transform hover:shadow-xl hover:scale-[1.02] transition-transform duration-200"
              style={{ animationDelay: `${600 + index * 100}ms` }}
            >
              <div className="relative h-48 w-full">
                <Image
                  src={
                    hall.imageUrl ||
                    "https://via.placeholder.com/400x300?text=No+Image"
                  }
                  alt={hall.title}
                  fill={true}
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  className="object-cover opacity-80"
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-white">{hall.title}</h3>
                <p className="text-sm text-neutral-400 mt-1">{hall.location}</p>
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-neutral-800 text-sm text-neutral-300">
                  <div className="flex items-center gap-1.5" title="Capacity">
                    <Users className="w-4 h-4 text-neutral-400" />
                    <span>{hall.capacity}</span>
                  </div>
                  <div
                    className="flex items-center gap-1.5"
                    title="Hourly Rate"
                  >
                    <DollarSign className="w-4 h-4 text-neutral-400" />
                    <span>{hall.rate}/hr</span>
                  </div>
                  <div className="flex items-center gap-1.5" title="Rating">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span>{hall.rating}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
