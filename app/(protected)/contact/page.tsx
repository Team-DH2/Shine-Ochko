import React from "react";
import EventHallForm from "./Form";

const ContactPage = () => {
  return (
    <div>
      <Header></Header>
      <EventHallForm></EventHallForm>
    </div>
  );
};

export default ContactPage;
import { Header } from "@/components/us/Header";

// export default function Contact() {
//   const team = [
//     {
//       name: "Elara Vance",
//       role: "CEO & Founder",
//       image: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg",
//     },
//     {
//       name: "Marcus Thorne",
//       role: "Chief Event Officer",
//       image:
//         "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg",
//     },
//     {
//       name: "Seraphina Lee",
//       role: "Head of Venue Relations",
//       image:
//         "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
//     },
//     {
//       name: "Julian Cross",
//       role: "Lead Performer Scout",
//       image: "https://images.pexels.com/photos/428327/pexels-photo-428327.jpeg",
//     },
//     {
//       name: "Anya Sharma",
//       role: "Logistics Director",
//       image:
//         "https://images.pexels.com/photos/3220374/pexels-photo-3220374.jpeg",
//     },
//     {
//       name: "Gabriel Stone",
//       role: "Client Success Manager",
//       image:
//         "https://images.pexels.com/photos/1704488/pexels-photo-1704488.jpeg",
//     },
//   ];

//   return (
//     <div>
//       <Header />
//       <div className="bg-black text-white font-serif px-50">
//         {/* Section*/}

//         <div className="bg-neutral-900 rounded-2xl w-fit h-[650px] flex flex-col items-center justify-center text-center px-[300px] mt-10">
//           <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
//             Crafting Unforgettable Moments
//           </h1>
//           <p className="text-lg md:text-xl max-w-3xl mb-10 opacity-80">
//             Your premier partner in bringing luxurious events to life,
//             flawlessly executed from concept to grand finale.
//           </p>
//           <button className="px-6 py-3 bg-blue-500 hover:bg-white hover:text-black duration-300 rounded-full font-medium">
//             Explore Our Story
//           </button>
//         </div>

//         {/* Title and Subtitle  */}
//         <div className="text-center mt-20 px-4">
//           <h2 className="text-4xl md:text-5xl font-extrabold">
//             Our Story: Excellence in Every Detail
//           </h2>
//           <p className="text-lg max-w-2xl mx-auto mt-4 opacity-70">
//             Discover the passion and precision behind EventLux, your trusted
//             partner for premium event experiences.
//           </p>
//         </div>

//         {/* Content */}
//         <div className="mt-16 flex justify-center px-4">
//           <div className="bg-[#1A1A1A] rounded-2xl p-10 flex flex-col md:flex-row gap-10 max-w-6xl">
//             <div className="flex-1 text-lg leading-relaxed opacity-90">
//               <p>
//                 Founded on the principle that every event should be a
//                 masterpiece, EventLux emerged from a desire to redefine luxury
//                 event management. We believe in meticulous planning, impeccable
//                 execution, and creating experiences that resonate long after the
//                 final toast.
//               </p>
//               <br />
//               <p>
//                 Our journey began with a vision to connect discerning clients
//                 with the most exquisite venues, gifted performers, and dedicated
//                 hosts. Today, we stand as a beacon of sophistication,
//                 transforming visions into breathtaking realities through a blend
//                 of innovation and classic elegance.
//               </p>
//               <br />
//               <p>
//                 We pride ourselves on our curated network and our unwavering
//                 commitment to client satisfaction, ensuring that every
//                 celebration, conference, or gathering is nothing short of
//                 extraordinary.
//               </p>
//             </div>
//             <button className="w-full md:w-[380px] h-80 object-cover rounded-xl border"></button>
//           </div>
//         </div>

//         {/*  */}
//         <div className="bg-neutral-900 rounded-2xl w-full h-[1200px] mt-16 justify-center text-center">
//           <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight pt-[100px]">
//             Meet Our Visionary Team
//           </h1>
//           <p className="md:text-xl font-sans">
//             Behind every successful event is a dedicated team of passionate
//             experts committed toast making your
//             <br />
//             vision a reality.
//           </p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mt-12 px-10 ">
//             {team.map((member, i) => (
//               <div
//                 key={i}
//                 className="bg-neutral-800 rounded-2xl text-center pb-6 overflow-hidden shadow-2xl hover:scale-[1.02] duration-200"
//               >
//                 <img
//                   src={member.image}
//                   className="w-full h-64 object-cover"
//                   alt={member.name}
//                 />
//                 <h3 className="text-2xl font-semibold mt-4">{member.name}</h3>
//                 <p className="text-blue-400 mt-1">{member.role}</p>
//               </div>
//             ))}
//           </div>
//         </div>

//         {/*  */}
//         <div className="mt-16 justify-center text-center">
//           <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight pt-[100px]">
//             Connect With EventLux
//           </h1>
//           <p className="md:text-xl font-sans">
//             We're here to help bring your vision to life. Reach out to us for
//             any inquiries or to start planning your next
//             <br />
//             spectacular event.
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// }
