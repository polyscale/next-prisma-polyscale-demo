import { Property, SalesHistory } from "@prisma/client";
import { GetServerSideProps, NextPage } from "next";
import PropertyDetail from "../../components/PropertyDetail";
import { prisma } from "../../lib/prisma";

const Object: NextPage<{
  similarProperties: Property[];
  property: Property;
  medianAreaPrice: number;
  lastSale: Omit<SalesHistory, "propertyId" | "id">;
  lastSaleInCity: Omit<SalesHistory, "propertyId" | "id">;
}> = ({
  property,
  similarProperties,
  medianAreaPrice,
  lastSale,
  lastSaleInCity,
}) => {
  return (
    <PropertyDetail
      property={property}
      similarProperties={similarProperties}
      medianAreaPrice={medianAreaPrice}
      lastSale={
        lastSale ? { ...lastSale, soldAt: new Date(lastSale.soldAt) } : null
      }
      lastSaleInCity={
        lastSaleInCity
          ? {
              ...lastSaleInCity,
              soldAt: new Date(lastSaleInCity.soldAt),
            }
          : null
      }
    />
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const property = await prisma.property.findFirst({
      where: { id: context.params!.id as string },
    });

    if (!property) {
      return {
        notFound: true,
      };
    }

    const [{ percentile_disc }]: [{ percentile_disc: number }] =
      await prisma.$queryRawUnsafe(`
    SELECT PERCENTILE_DISC(0.5)
    WITHIN GROUP (ORDER BY price) 
    FROM "Property"
    WHERE price is NOT NULL
    AND city = '${property.city}'
    AND bedrooms = ${property.bedrooms}
    AND type = '${property.type}';
    `);

    const lastSale = await prisma.salesHistory.findFirst({
      where: {
        propertyId: property.id,
      },
      select: {
        price: true,
        soldAt: true,
      },
      orderBy: {
        soldAt: "desc",
      },
      take: 1,
    });

    const lastSaleInCity = await prisma.salesHistory.findFirst({
      where: {
        property: {
          city: property.city,
          bedrooms: property.bedrooms,
        },
      },
      select: {
        price: true,
        soldAt: true,
      },
      orderBy: {
        soldAt: "desc",
      },
      take: 1,
    });

    const similarProperties = await prisma.property.findMany({
      where: {
        id: {
          not: property.id,
        },
        city: property.city,
        bedrooms: property.bedrooms,
        type: property.type,
        area: {
          lte: property.area + 15,
          gte: property.area - 15,
        },
      },
      take: 6,
    });
    return {
      props: {
        key: property.id,
        property: { ...property, createdAt: property.createdAt.toISOString() },
        lastSale:
          lastSale !== null
            ? { ...lastSale, soldAt: lastSale?.soldAt.toISOString() }
            : null,
        lastSaleInCity:
          lastSaleInCity !== null
            ? { ...lastSaleInCity, soldAt: lastSaleInCity.soldAt.toISOString() }
            : null,
        medianAreaPrice: percentile_disc,
        similarProperties: similarProperties.map((d) => ({
          ...d,
          createdAt: d.createdAt.toISOString(),
        })),
      },
    };
  } catch (error) {
    console.log(error);

    throw error;
  }
};

export default Object;
