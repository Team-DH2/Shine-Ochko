// "use client";
// import { useState, useEffect } from "react";
// import Image from "next/image";
// import { FaStar } from "react-icons/fa";

// export default function PerformersPage() {
//   const [performers, setPerformers] = useState<any[]>([]);
//   const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
//   const [selectedAvailability, setSelectedAvailability] = useState<string[]>(
//     []
//   );
//   const [minRating, setMinRating] = useState<number>(0);

//   useEffect(() => {
//     fetchPerformers();
//   const [isFilterOpen, setIsFilterOpen] = useState(false);

//   useEffect(() => {
//     // fetchPerformers();
//   }, []);

//   const fetchPerformers = async () => {
//     try {
//       const res = await fetch("/api/performers");
//       const data = await res.json();
//       setPerformers(data.performers || []);
//     } catch (error) {
//       console.error("Error fetching performers:", error);
//     }
//   };

//   const genres = ["Latin", "Hip-Hop", "Classical", "Jazz", "Rock", "Pop"];
//   const availabilityOptions = ["Available", "On Request", "Booked"];

//   const filteredPerformers = performers.filter((performer) => {
//     const genreMatch =
//       selectedGenres.length === 0 ||
//       selectedGenres.some((genre) => performer.genre?.includes(genre));
//     const availabilityMatch =
//       selectedAvailability.length === 0 ||
//       selectedAvailability.includes(performer.availability);
//     const ratingMatch = (performer.rating || 0) >= minRating;

//     return genreMatch && availabilityMatch && ratingMatch;
//   });

//   const getAvailabilityColor = (availability: string) => {
//     switch (availability) {
//       case "Available":
//         return "bg-green-600";
//       case "On Request":
//         return "bg-yellow-600";
//       case "Booked":
//         return "bg-red-600";
//       default:
//         return "bg-gray-600";
//     }
//   };

//   return (
//     <div className="min-h-screen bg-black text-white">
//       <div className="container mx-auto px-4 py-8">
//       <div className="container mx-auto px-4 py-8 mt-16">
//         <h1 className="text-4xl font-bold mb-8">Find Performers</h1>

//         <div className="flex gap-8">
//           {/* Sidebar Filters */}
//           <div className="w-64 bg-gray-900 rounded-lg p-6 h-fit sticky top-8">
//             <h2 className="text-xl font-bold mb-4">Filters</h2>

//             {/* Genre Filter */}
//             <div className="mb-6">
//               <h3 className="font-semibold mb-3 flex items-center gap-2">
//                 <span>🎵</span> Genre
//               </h3>
//               <div className="space-y-2">
//                 {genres.map((genre) => (
//                   <label
//                     key={genre}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedGenres.includes(genre)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedGenres([...selectedGenres, genre]);
//                         } else {
//                           setSelectedGenres(
//                             selectedGenres.filter((g) => g !== genre)
//                           );
//                         }
//                       }}
//                       className="w-4 h-4"
//                     />
//                     <span>{genre}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Availability Filter */}
//             <div className="mb-6">
//               <h3 className="font-semibold mb-3">Availability</h3>
//               <div className="space-y-2">
//                 {availabilityOptions.map((option) => (
//                   <label
//                     key={option}
//                     className="flex items-center gap-2 cursor-pointer"
//                   >
//                     <input
//                       type="checkbox"
//                       checked={selectedAvailability.includes(option)}
//                       onChange={(e) => {
//                         if (e.target.checked) {
//                           setSelectedAvailability([
//                             ...selectedAvailability,
//                             option,
//                           ]);
//                         } else {
//                           setSelectedAvailability(
//                             selectedAvailability.filter((a) => a !== option)
//                           );
//                         }
//                       }}
//                       className="w-4 h-4"
//                     />
//                     <span>{option}</span>
//                   </label>
//                 ))}
//               </div>
//             </div>

//             {/* Rating Filter */}
//             <div className="mb-6">
//               <h3 className="font-semibold mb-3">Rating</h3>
//               <input
//                 type="range"
//                 min="0"
//                 max="5"
//                 step="0.5"
//                 value={minRating}
//                 onChange={(e) => setMinRating(parseFloat(e.target.value))}
//                 className="w-full"
//               />
//               <div className="text-sm text-gray-400 mt-2">
//                 Minimum: {minRating.toFixed(1)} ⭐
//               </div>
//             </div>

//             <button
//               onClick={() => {
//                 setSelectedGenres([]);
//                 setSelectedAvailability([]);
//                 setMinRating(0);
//               }}
//               className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors"
//             >
//               Apply Filters
//             </button>
//           </div>

//           {/* Performers Grid */}
//           <div className="flex-1">
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {filteredPerformers.map((performer) => (
//                 <div
//                   key={performer.id}
//                   className="bg-gray-900 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-transform"
//                 >
//                   {/* Performer Image */}
//                   <div className="relative h-64 bg-gray-800">
//                     <img
//                       src={
//                         performer.image || "https://via.placeholder.com/400x300"
//                       }
//                       alt={performer.name}
//                       className="w-full h-full object-cover"
//                     <Image
//                       src={
//                         performer.image ||
//                         "https://via.placeholder.com/400x300?text=No+Image"
//                       }
//                       alt={performer.name}
//                       fill
//                       sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
//                       className="object-cover"
//                     />
//                     <div
//                       className={`absolute top-3 left-3 ${getAvailabilityColor(
//                         performer.availability || "Available"
//                       )} text-white px-3 py-1 rounded-full text-xs font-semibold`}
//                     >
//                       {performer.availability || "Available"}
//                     </div>
//                   </div>

//                   {/* Performer Info */}
//                   <div className="p-4">
//                     <h3 className="text-xl font-bold mb-1">{performer.name}</h3>
//                     <p className="text-gray-400 text-sm mb-3">
//                       {performer.performance_type || performer.genre}
//                     </p>

//                     {/* Rating */}
//                     <div className="flex items-center gap-2 mb-4">
//                       <FaStar className="text-yellow-400" />
//                       <span className="font-semibold">
//                         {performer.rating || "4.5"}
//                       </span>
//                     </div>

//                     {/* View Profile Button */}
//                     <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors">
//                       View Profile
//                     </button>
//                   </div>
//                 </div>
//               ))}

//               {filteredPerformers.length === 0 && (
//                 <div className="col-span-3 text-center py-12 text-gray-400">
//                   No performers found matching your filters.
//                 </div>
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
