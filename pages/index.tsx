import { GetServerSideProps } from "next";
import type { NextPage } from "next";
import Head from "next/head";
import { prisma } from "../lib/prisma";
import { Property } from "@prisma/client";
import { Col, PageHeader, Row } from "antd";
import PropertyCard from "../components/PropertyCard";

const Home: NextPage<{ properties: Property[] }> = ({ properties }) => {
  return (
    <div>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <PageHeader title="Properties"></PageHeader>
      <Row gutter={[24, 24]}>
        {properties.map((p) => (
          <Col key={p.id} xs={24} sm={24} md={12}>
            <PropertyCard property={p} />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const properties = await prisma.property.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // By returning { props: { posts } }, the Blog component
  // will receive `posts` as a prop at build time
  return {
    props: {
      properties: properties.map((d) => ({
        ...d,
        createdAt: d.createdAt.toISOString(),
      })),
    },
  };
};

export default Home;
