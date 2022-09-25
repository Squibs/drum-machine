import React from 'react';
import styled from 'styled-components';
import { SEO } from '../components';

/* --------------------------------- styles --------------------------------- */

const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  color: ${({ theme }) => theme.colors.whiteTint};

  & h1,
  p {
    text-align: center;
  }
`;

/* ---------------------------------- types --------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------- component ------------------------------- */

const IndexPage = () => {
  return (
    <PageContainer>
      <h1>Drum Machine</h1>
    </PageContainer>
  );
};

/* -------------------- default props / queries / exports ------------------- */

export default IndexPage;

// export const query = graphql``;

export const Head = () => <SEO title="Home Page" />;
