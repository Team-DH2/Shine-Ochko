"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChangeEvent, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TrashIcon } from "lucide-react";

export default function EventHallForm() {
  const [name, setName] = useState<string>("");
  const [hallName, setHallName] = useState<string>("");
  const [suitableEvents, setSuitableEvents] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [rating, setRating] = useState<string>("");
  const [menu, setMenu] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [locationLink, setLocationLink] = useState<string>("");
  const [parkingCapacity, setParkingcapacity] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [additional, setAdditional] = useState<string>("");
  const [aboutHall, setAboutHall] = useState<string>("");
  const [advantages, setAdvantages] = useState<string>("");
  const [booking, setBooking] = useState<string>("");
  const [images, setImages] = useState<File[]>([]);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [capacity, setCapacity] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleAddImage = (e: ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const newImages = [...images];
    newImages[index] = file;
    setImages(newImages);
    if (index === images.length) setImages([...newImages]);
  };

  const deleteImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    setImages(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const base64Images = await Promise.all(
        images.map(async (img) => {
          const arrayBuffer = await img.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          return `data:${img.type};base64,${buffer.toString("base64")}`;
        })
      );
      const response = await fetch("/api/form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          hallName,
          suitableEvents,
          price,
          rating,
          menu,
          location,
          locationLink,
          parkingCapacity,
          description,
          additional,
          aboutHall,
          advantages,
          booking,
          capacity,
          phoneNumber,
          email,
          images: base64Images,
        }),
      });
      const data = await response.json();
      alert(data.message);
      setName("");
      setHallName("");
      setSuitableEvents("");
      setPrice("");
      setRating("");
      setMenu("");
      setLocation("");
      setLocationLink("");
      setParkingcapacity("");
      setDescription("");
      setAdditional("");
      setAboutHall("");
      setAdvantages("");
      setBooking("");
      setCapacity("");
      setPhoneNumber("");
      setEmail("");
      setImages([]);
    } catch (error) {
      console.log(error);
      alert("Алдаа гарлаа");
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (
    label: string,
    value: string,
    setter: (v: string) => void,
    placeholder: string,
    type: string = "text"
  ) => (
    <div className="space-y-2 w-full">
      <div className="text-gray-300 font-medium text-sm">{label} *</div>
      <Input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="h-14 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 shadow-sm transition"
      />
    </div>
  );

  const renderTextarea = (
    label: string,
    value: string,
    setter: (v: string) => void,
    placeholder: string
  ) => (
    <div className="space-y-2 w-full">
      <div className="text-gray-300 font-medium text-sm">{label} *</div>
      <Textarea
        placeholder={placeholder}
        value={value}
        onChange={(e) => setter(e.target.value)}
        className="rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:ring-2 focus:ring-gray-500 h-24 p-3 shadow-sm transition"
      />
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-black">
      <div className="relative p-2 rounded-3xl bg-neutral-900 w-full max-w-4xl">
        <div className="bg-neutral-800 backdrop-blur-md rounded-3xl p-10 space-y-8">
          <h1 className="text-4xl font-bold text-center text-gray-100 drop-shadow-md">
            ✨ Event Hall Form
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {renderInput(
              "Холбоо барих хүний нэр",
              name,
              setName,
              "Жишээ: Бат-Эрдэнэ"
            )}
            {renderInput(
              "Заалны нэр",
              hallName,
              setHallName,
              "Жишээ: Оргил Зочид Буудал"
            )}
            {renderTextarea(
              "Хаяг / Байршил",
              location,
              setLocation,
              "УБ, ХУД..."
            )}
            {renderInput(
              "Холбоо барих утас",
              phoneNumber,
              setPhoneNumber,
              "9999-9999",
              "tel"
            )}
            {renderInput(
              "И-мэйл хаяг",
              email,
              setEmail,
              "example@gmail.com",
              "email"
            )}
            {renderTextarea(
              "Suitable Events",
              suitableEvents,
              setSuitableEvents,
              "Хүлээн авалт, хурим, концерт..."
            )}
            {renderTextarea("Price", price, setPrice, "Жишээ: 500,000₮ / өдөр")}
            {renderTextarea("Rating", rating, setRating, "Жишээ: 4.5/5")}
            {renderTextarea("Menu", menu, setMenu, "Жишээ: Тусгай цэс")}
            {renderTextarea(
              "Parking Capacity",
              parkingCapacity,
              setParkingcapacity,
              "Жишээ: 50 машины зогсоол"
            )}
            {renderTextarea(
              "Description",
              description,
              setDescription,
              "Заалны тухай товч мэдээлэл"
            )}
            {renderTextarea(
              "Additional",
              additional,
              setAdditional,
              "Нэмэлт боломжууд"
            )}
            {renderTextarea(
              "About Hall",
              aboutHall,
              setAboutHall,
              "Заалны дэлгэрэнгүй мэдээлэл"
            )}
            {renderTextarea(
              "Advantages",
              advantages,
              setAdvantages,
              "Давуу талууд"
            )}
            {renderTextarea(
              "Booking",
              booking,
              setBooking,
              "Бүртгэх боломжууд"
            )}
            {renderTextarea("Capacity", capacity, setCapacity, "Хүний тоо")}

            {/* Images */}
            <div className="space-y-4">
              <div className="text-gray-300 font-medium text-sm">Зургууд *</div>
              <div className="flex flex-wrap gap-4">
                {images.map((img, i) => (
                  <div key={i} className="relative group">
                    <Image
                      src={URL.createObjectURL(img)}
                      alt="Image"
                      width={220}
                      height={150}
                      className="rounded-xl border border-gray-600 shadow-sm object-cover"
                    />
                    <TrashIcon
                      onClick={() => deleteImage(i)}
                      className="absolute top-2 right-2 text-red-500 cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                      size={26}
                    />
                  </div>
                ))}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleAddImage(e, images.length)}
                  className="h-[150px] w-[220px] border-2 border-dashed border-gray-600 rounded-xl text-sm text-white bg-gray-800 placeholder-gray-400 shadow-sm cursor-pointer flex items-center justify-center text-center"
                />
              </div>
            </div>

            {renderTextarea(
              "Location link",
              locationLink,
              setLocationLink,
              "Жишээ: Google Maps link"
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full h-14 rounded-xl bg-gradient-to-r from-gray-700 to-gray-600 text-white font-semibold text-lg shadow-md hover:scale-105 transition-transform"
            >
              {loading ? "Бүртгэж байна..." : "Бүртгүүлэх"}
            </Button>
          </form>

          <Link href="/home">
            <Button className="w-full h-14 bg-gray-600 rounded-xl text-white font-medium text-lg border border-gray-500/40 hover:bg-gray-700 transition">
              🏠 Нүүр хуудас руу буцах
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

// "use client";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { ChangeEvent, useEffect, useState } from "react";
// import Link from "next/link";
// import Image from "next/image";
// import { TrashIcon } from "lucide-react";

// export default function EventHallForm() {
//   const [name, setName] = useState<string>("");
//   const [hallName, setHallName] = useState<string>("");
//   const [suitableEvents, setSuitableEvents] = useState<string>("");
//   const [price, setPrice] = useState<string>("");
//   const [rating, setRating] = useState<string>("");
//   const [menu, setMenu] = useState<string>("");
//   const [location, setLocation] = useState<string>("");
//   const [locationLink, setLocationLink] = useState<string>("");
//   const [parkingCapacity, setParkingcapacity] = useState<string>("");
//   const [description, setDescription] = useState<string>("");
//   const [additional, setAdditional] = useState<string>("");
//   const [aboutHall, setAboutHall] = useState<string>("");
//   const [advantages, setAdvantages] = useState<string>("");
//   const [booking, setBooking] = useState<string>("");
//   const [images, setImages] = useState<File[]>([]);
//   const [phoneNumber, setPhoneNumber] = useState<string>("");
//   const [email, setEmail] = useState<string>("");
//   const [capacity, setCapacity] = useState<string>("");
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     const getData = async () => {
//       try {
//         const res = await fetch("/api/event-halls");
//         const data = await res.json();
//         console.log({ data });
//       } catch (e) {
//         console.error(e);
//       }
//       setLoading(false);
//     };

//     getData();
//   }, []);

//   // Add image
//   const handleAddImage = (e: ChangeEvent<HTMLInputElement>, index: number) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const newImages = [...images];
//     newImages[index] = file;
//     setImages(newImages);

//     if (index === images.length) {
//       setImages([...newImages]);
//     }
//   };

//   // Delete image
//   const deleteImage = (index: number) => {
//     const updated = images.filter((_, i) => i !== index);
//     setImages(updated);
//   };

//   // Submit
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const base64Images = await Promise.all(
//         images.map(async (img) => {
//           const arrayBuffer = await img.arrayBuffer();
//           const buffer = Buffer.from(arrayBuffer);
//           return `data:${img.type};base64,${buffer.toString("base64")}`;
//         })
//       );

//       const response = await fetch("/api/form", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           name,
//           hallName,
//           location,
//           phoneNumber,
//           email,
//           images: base64Images,
//         }),
//       });

//       const data = await response.json();
//       alert(data.message);

//       setName("");
//       setHallName("");
//       setLocation("");
//       setPhoneNumber("");
//       setEmail("");
//       setImages([]);
//     } catch (error) {
//       console.log(error);
//       alert("Aldaaa");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center  from-neutral-900 via-neutral-800 to-neutral-900 p-6">
//       <div className="relative p-1 rounded-3xl bg-linear-to-r from-rose-500/50 via-purple-500/50 to-indigo-500/50 shadow-[0_0_40px_-10px_rgba(255,0,150,0.5)]">
//         <div className="bg-neutral-900/70 backdrop-blur-2xl rounded-3xl p-10 w-120 space-y-8">
//           {/* Event Hall */}
//           <h1 className="text-4xl font-bold text-center bg-linear-to-r from-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow">
//             ✨ Event Hall
//           </h1>

//           <form className="space-y-6">
//             {/* Холбоо барих хүний нэр */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Холбоо барих хүний нэр *
//               </div>
//               <Input
//                 type="name"
//                 className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder="Холбоо барих хүний нэр"
//                 value={name}
//                 onChange={(e) => setName(e.target.value)}
//               />
//             </div>

//             {/* Заалны нэр */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Заалны нэр *
//               </div>
//               <Input
//                 className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder="Заалны нэр"
//                 value={hallName}
//                 onChange={(e) => setHallName(e.target.value)}
//               />
//             </div>

//             {/* "Хаяг / Байршил" */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Хаяг / Байршил *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder="УБ, ХУД…"
//                 value={location}
//                 onChange={(e) => setLocation(e.target.value)}
//               />
//             </div>

//             {/* Холбоо барих утас */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Холбоо барих утас *
//               </div>
//               <Input
//                 className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder="9999-9999"
//                 value={phoneNumber}
//                 onChange={(e) => setPhoneNumber(e.target.value)}
//               />
//             </div>

//             {/* Email */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 И-мэйл хаяг *
//               </div>
//               <Input
//                 className="h-12 rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder="example@gmail.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//             </div>

//             {/* Suitable Events */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Suitable Events *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={suitableEvents}
//                 onChange={(e) => setSuitableEvents(e.target.value)}
//               />
//             </div>

//             {/* price */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Price *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={price}
//                 onChange={(e) => setPrice(e.target.value)}
//               />
//             </div>

//             {/* rating */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Rating *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={rating}
//                 onChange={(e) => setRating(e.target.value)}
//               />
//             </div>

//             {/* menu */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">Menu *</div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={menu}
//                 onChange={(e) => setMenu(e.target.value)}
//               />
//             </div>

//             {/* parkingCapacity */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Parking capacity *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={parkingCapacity}
//                 onChange={(e) => setParkingcapacity(e.target.value)}
//               />
//             </div>

//             {/* description */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Description *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={description}
//                 onChange={(e) => setDescription(e.target.value)}
//               />
//             </div>

//             {/* additional */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Additional *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={additional}
//                 onChange={(e) => setAdditional(e.target.value)}
//               />
//             </div>

//             {/* aboutHall */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Informations about hall *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={aboutHall}
//                 onChange={(e) => setAboutHall(e.target.value)}
//               />
//             </div>

//             {/* advantages */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Advantages *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={advantages}
//                 onChange={(e) => setAdvantages(e.target.value)}
//               />
//             </div>

//             {/* booking */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Booking *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={booking}
//                 onChange={(e) => setBooking(e.target.value)}
//               />
//             </div>

//             {/* capacity */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Capacity *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={capacity}
//                 onChange={(e) => setCapacity(e.target.value)}
//               />
//             </div>

//             {/* Images */}
//             <div className="space-y-4">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Зургууд *
//               </div>

//               {images.map((img, i) => (
//                 <div key={i} className="space-y-2">
//                   {img ? (
//                     <div className="flex items-start gap-2">
//                       <Image
//                         src={URL.createObjectURL(img)}
//                         alt="Image"
//                         width={200}
//                         height={140}
//                         className="rounded-xl border border-neutral-500/40 "
//                       />
//                       <TrashIcon
//                         onClick={() => deleteImage(i)}
//                         className="text-neutral-300 relative cursor-pointer hover:text-red-500 transition"
//                         size={22}
//                       />
//                     </div>
//                   ) : null}
//                 </div>
//               ))}

//               <Input
//                 className="h-[138px] border-2 border-dashed bg-neutral-700/30 border-neutral-500/40 rounded-md text-sm font-medium mx-auto "
//                 id="picture"
//                 type="file"
//                 accept="image/*"
//                 onChange={(e) => handleAddImage(e, images.length)}
//               />
//             </div>

//             {/* Location link */}
//             <div className="space-y-2">
//               <div className="text-neutral-300 font-medium text-sm">
//                 Location link *
//               </div>
//               <Textarea
//                 className="rounded-xl bg-neutral-700/30 border-neutral-500/40 text-neutral-200"
//                 placeholder=".."
//                 value={locationLink}
//                 onChange={(e) => setLocationLink(e.target.value)}
//               />
//             </div>

//             {/* Button */}
//             <Button
//               type="submit"
//               disabled={loading}
//               className="w-full h-12 rounded-xl bg-linear-to-r from-rose-600 to-purple-600 hover:brightness-110 hover:scale-[1.02] transition-all shadow-xl"
//               onClick={handleSubmit}
//             >
//               {loading ? "Бүртгэж байна......" : "Бүртгүүлэх"}
//             </Button>
//           </form>

//           <Link href="/home">
//             <Button className="w-full h-12 bg-white rounded-xl text-black text-lg border-neutral-500/40 hover:bg-neutral-700/40 transition">
//               🏠 Нүүр хуудас руу буцах
//             </Button>
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
