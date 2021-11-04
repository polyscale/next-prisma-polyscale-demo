import { Property } from ".prisma/client";
import { Col, PageHeader, Row } from "antd";
import { FC, memo } from "react";
import PropertyCard from "./PropertyCard";

const SimilarProperties: FC<{ similarProperties: Property[] }> = ({
  similarProperties,
}) => {
  return (
    <>
      <PageHeader title="Similar Properties in the Area"></PageHeader>
      <Row gutter={[24, 24]}>
        {similarProperties.map((p) => (
          <Col key={p.id} xs={24} sm={12} md={8}>
            <PropertyCard property={p} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default memo(SimilarProperties);
