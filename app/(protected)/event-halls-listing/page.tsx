"use client";

import EventHallsListing from "@/components/event-halls/jasu";
import { Header } from "@/components/us/Header";
// import EventHalls from "@/components/us/Nasocomponent";

const Event = () => {
  return (
    <div>
      <Header />
      {/* <EventHalls /> */}
      <EventHallsListing />
    </div>
  );
};
export default Event;
