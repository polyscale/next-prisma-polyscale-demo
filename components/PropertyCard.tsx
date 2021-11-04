import Link from "next/link";
import { Property } from "@prisma/client";
import { Card, Space, Statistic, Tag } from "antd";
import { AiOutlineEye, AiOutlineSave } from "react-icons/ai";
import { FC, useMemo } from "react";
import Meta from "antd/lib/card/Meta";
import Text from "antd/lib/typography/Text";
import { MyImage } from "./MyImage";

const PropertyCard: FC<{ property: Property }> = ({ property }) => {
  const imageId = useMemo(() => Math.floor(Math.random() * 26), []);
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
    <Link passHref={true} href={`/properties/${property.id}`}>
      <a>
        <Card
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
          cover={
            <div style={{ position: "relative" }}>
              <MyImage
                src={`/images/${imageId}.webp`}
                width={600}
                height={400}
              />
              <Tag
                style={{ position: "absolute", right: "16px", bottom: "16px" }}
                color={type.color}
              >
                {type.label}
              </Tag>
            </div>
          }
          hoverable
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
              <Text type="secondary" style={{ fontSize: "12px" }}>
                {property.street} {property.number}, {property.city}{" "}
                {property.postcode}, {property.region}
              </Text>
              <Meta
                title={<Statistic prefix="$" value={property.price} />}
              ></Meta>
            </Space>
            <footer
              style={{
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Text type="secondary">
                {property.bedrooms} bd • {property.bathrooms} bt •{" "}
                {property.area} m<sup>2</sup>
              </Text>
              <Space direction="horizontal">
                <span>
                  <AiOutlineEye className="anticon" /> {property.views}
                </span>
                <span>
                  <AiOutlineSave className="anticon" /> {property.saves}
                </span>
              </Space>
            </footer>
          </div>
        </Card>
      </a>
    </Link>
  );
};

export default PropertyCard;
