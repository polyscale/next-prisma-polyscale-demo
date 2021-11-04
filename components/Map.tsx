import { Property } from "@prisma/client";
import { FC, memo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { icon, Icon } from "leaflet";
import { Card } from "antd";

const Map: FC<{ property: Property; height: string }> = ({
  height,
  property,
}) => {
  const position = [property.lat, property.lon] as [number, number];
  const markerIcon = new Icon({
    iconUrl: "/marker-icon.png",
    iconRetinaUrl: "/marker-icon-2x.png",
    iconSize: [30, 47],
    iconAnchor: [16, 47],
  });
  return (
    <Card
      bordered
      cover={
        <div style={{ height, borderRadius: 3, overflow: "hidden" }}>
          <MapContainer center={position} zoom={13} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker
              position={[property.lat, property.lon]}
              icon={markerIcon}
            ></Marker>
          </MapContainer>
        </div>
      }
    ></Card>
  );
};

export default memo(Map);
