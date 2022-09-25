import React from 'react';
import styled from 'styled-components';
import { SEO } from '../components';
import { PageContainer } from '../containers';

/* --------------------------------- styles --------------------------------- */

/* ---------------------------------- types --------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------- component ------------------------------- */

const IndexPage = () => {
  return (
    <PageContainer>
      <h1>Squibs&apos; Gatsby Starter</h1>
    </PageContainer>
  );
};

/* -------------------- default props / queries / exports ------------------- */

export default IndexPage;

// export const query = graphql``;

export const Head = () => <SEO title="Home Page" />;
