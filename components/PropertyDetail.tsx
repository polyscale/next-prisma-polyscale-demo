import { Property, SalesHistory } from "@prisma/client";
import {
  Button,
  Card,
  Divider,
  PageHeader,
  Space,
  Statistic,
  Tag,
  Typography,
} from "antd";
import { AiOutlineEye, AiOutlineSave } from "react-icons/ai";
import { FC, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { MyImage } from "./MyImage";
import SimilarProperties from "./SimilarProperties";

const Map = dynamic(import("./Map"), {
  ssr: false,
  // eslint-disable-next-line react/display-name
  loading: () => (
    <div style={{ textAlign: "center", paddingTop: 20 }}>Loading...</div>
  ),
});

const ImageGallery = dynamic(import("./ImageGallery"), {
  ssr: false,
});

const imageId = () => Math.floor(Math.random() * 26);

const PropertyDetail: FC<{
  similarProperties: Property[];
  property: Property;
  medianAreaPrice: number;
  lastSale: Omit<SalesHistory, "propertyId" | "id"> | null;
  lastSaleInCity: Omit<SalesHistory, "propertyId" | "id"> | null;
}> = ({
  property,
  similarProperties,
  medianAreaPrice,
  lastSale,
  lastSaleInCity,
}) => {
  const heroImageId = useMemo(() => imageId(), []);
  const galleryImageIds = useMemo(
    () => [heroImageId, ...Array.from({ length: 10 }, (v, k) => imageId())],
    [heroImageId]
  );
  const [visible, setVisible] = useState(false);

  const type = useMemo(() => {
    switch (property.type) {
      case "Appartement":
        return {
          color: "magenta",
          label: "Appartement",
        };
      case "House":
        return {
          color: "purple",
          label: "House",
        };
      case "MultiFamilyHome":
        return {
          color: "blue",
          label: "Multi-Family-Home",
        };
    }
  }, [property]);

  return (
    <>
      <Card
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          height: "100%",
        }}
        cover={
          <div style={{ position: "relative" }}>
            <MyImage
              src={`/images/${heroImageId}.webp`}
              width={1200}
              height={400}
            />
            <Button
              style={{ position: "absolute", right: 16, bottom: 16 }}
              type="primary"
              onClick={() => setVisible(true)}
            >
              Gallery
            </Button>
          </div>
        }
        bodyStyle={{ flex: 1 }}
      >
        <div
          style={{
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Space size="small" direction="vertical">
            <Space>
              <Tag color={type.color}>{type.label}</Tag>
              <Typography.Text type="secondary" style={{ fontSize: "12px" }}>
                {property.street} {property.number}, {property.city}{" "}
                {property.postcode}, {property.region}
              </Typography.Text>
            </Space>
            <Card.Meta
              title={<Statistic prefix="$" value={property.price} />}
            ></Card.Meta>
            <Typography.Text type="secondary">
              The median price in this area is{" "}
              <b>
                $
                {Math.floor(medianAreaPrice)
                  .toString()
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </b>
            </Typography.Text>
            {lastSale && (
              <Typography.Text type="secondary">
                Last Sale Price of this property:{" "}
                <b>
                  $
                  {Math.floor(lastSale.price)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </b>{" "}
                ({new Intl.DateTimeFormat().format(lastSale.soldAt.getTime())})
              </Typography.Text>
            )}
            {lastSaleInCity && (
              <Typography.Text type="secondary">
                Last Sale Price of similar properties in this region:{" "}
                <b>
                  $
                  {Math.floor(lastSaleInCity.price)
                    .toString()
                    .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                </b>{" "}
                (
                {new Intl.DateTimeFormat().format(
                  lastSaleInCity.soldAt.getTime()
                )}
                )
              </Typography.Text>
            )}
          </Space>
          <main
            style={{
              marginTop: "8px",
            }}
          >
            <Space direction="vertical" style={{ width: "100%" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Typography.Text type="secondary">
                  {property.bedrooms} bd • {property.bathrooms} bt •{" "}
                  {property.area} m<sup>2</sup>
                </Typography.Text>
                <Space direction="horizontal">
                  <span>
                    <AiOutlineEye className="anticon" /> {property.views}
                  </span>
                  <span>
                    <AiOutlineSave className="anticon" /> {property.saves}
                  </span>
                </Space>
              </div>
              <Divider />
              <Typography.Text>{property.description}</Typography.Text>
            </Space>
          </main>
          <Divider />
          <footer>
            <PageHeader title="Location" />
            <Map property={property} height="400px" />
          </footer>
        </div>
        <div style={{ display: "none" }}>
          <ImageGallery
            galleryImageIds={galleryImageIds}
            visible={visible}
            setVisible={setVisible}
          ></ImageGallery>
        </div>
      </Card>
      <Divider />
      <SimilarProperties similarProperties={similarProperties} />
    </>
  );
};

export default PropertyDetail;
