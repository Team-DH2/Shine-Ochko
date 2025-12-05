# Map Component Setup Guide

## Overview

The Map component displays all event halls on an interactive map using **Leaflet.js** - a completely **FREE** and open-source mapping library. No API keys or costs required!

## Features

- 📍 Shows all event halls with markers
- 🗺️ Automatically fits bounds to show all locations
- ℹ️ Info windows with hall details, images, and links
- � **100% FREE** - No API keys, no billing, no limits
- 📱 Responsive and mobile-friendly
- 🔗 Direct links to Google Maps for each location
- 🌍 Uses OpenStreetMap tiles (free and open-source)

## Setup Instructions

### ✅ Already Installed!

The required packages have been installed:

- `leaflet` - Core mapping library
- `react-leaflet` - React components for Leaflet
- `@types/leaflet` - TypeScript types

### No API Keys Needed! 🎉

Unlike Google Maps, Leaflet uses **OpenStreetMap** tiles which are completely free. You can start using the map immediately without any setup or registration.

## Usage

Simply import and use the Map component anywhere in your app:

```tsx
import { Map } from "@/components/event-halls/map";

export default function Page() {
  return (
    <div>
      <h1>Event Halls</h1>
      <Map />
    </div>
  );
}
```

That's it! No environment variables, no API keys, no configuration needed.

## Location Link Format

The component supports Google Maps links in these formats:

1. **Query format**: `https://maps.google.com/?q=47.9184,106.9177`
2. **Place format**: `https://www.google.com/maps/place/@47.9184,106.9177`
3. **Coordinates**: Direct lat/lng coordinates in the URL

### Example Location Links

```
https://maps.google.com/?q=47.9184,106.9177
https://www.google.com/maps/@47.9184,106.9177,15z
https://www.google.com/maps/place/@47.9184,106.9177,15z
```

## Customization

### Change Map Tiles (Style)

You can use different free tile providers. Replace the `TileLayer` URL in `map.tsx`:

```tsx
{
  /* Dark theme */
}
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://carto.com/">CARTO</a>'
/>;

{
  /* Light theme */
}
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>;

{
  /* Satellite (Esri) */
}
<TileLayer
  url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
  attribution="&copy; Esri"
/>;
```

### Change Default Center

Modify the default center location (line 113):

```tsx
const defaultCenter: [number, number] = [47.9184, 106.9177]; // Ulaanbaatar
```

### Customize Marker Icon

Replace the custom icon (lines 16-24):

```tsx
const customIcon = L.icon({
  iconUrl: "/custom-marker.png", // Your custom marker
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});
```

### Adjust Map Height

Change the height class:

```tsx
<div className="h-96 w-full"> {/* Change h-96 to h-64, h-screen, etc. */}
```

## Troubleshooting

### Map not showing

1. Check browser console for errors
2. Ensure event halls have valid `location_link` values
3. Clear browser cache and refresh
4. Check that Leaflet CSS is loading

### Markers not appearing

Verify event halls in your database have valid `location_link` values with coordinates:

```sql
SELECT id, name, location_link FROM event_halls;
```

### Hydration errors in Next.js

The component already handles this with:

```tsx
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);
```

## Database Requirements

Ensure your `event_halls` table has the `location_link` column:

```prisma
model event_halls {
  id            Int     @id @default(autoincrement())
  name          String
  location      String?
  location_link String? // Required for map markers
  images        String[]
  // ... other fields
}
```

## Why Leaflet vs Google Maps?

| Feature           | Leaflet (OpenStreetMap) | Google Maps                                     |
| ----------------- | ----------------------- | ----------------------------------------------- |
| **Cost**          | ✅ FREE                 | ❌ $200 free credit/month, then $7 per 1k loads |
| **API Key**       | ✅ Not required         | ❌ Required                                     |
| **Setup**         | ✅ Instant              | ❌ Cloud Console setup                          |
| **Billing**       | ✅ Never                | ❌ Credit card required                         |
| **Open Source**   | ✅ Yes                  | ❌ No                                           |
| **Customization** | ✅ Unlimited            | ⚠️ Limited                                      |

## Additional Free Tile Providers

### Stamen Toner (High Contrast)

```tsx
url = "https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}{r}.png";
```

### CartoDB Positron (Clean, Light)

```tsx
url = "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
```

### CartoDB Dark Matter (Dark Theme)

```tsx
url = "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png";
```

## Support

Leaflet is widely used and has excellent documentation:

- Official docs: https://leafletjs.com/
- React Leaflet: https://react-leaflet.js.org/
- Examples: https://leafletjs.com/examples.html

## License

Both Leaflet and OpenStreetMap are open-source and free to use:

- Leaflet: BSD 2-Clause License
- OpenStreetMap: Open Data Commons Open Database License (ODbL)
