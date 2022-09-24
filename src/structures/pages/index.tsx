import React from 'react';
import { graphql, Link } from 'gatsby';
import { GatsbyImage, IGatsbyImageData } from 'gatsby-plugin-image';
import styled from 'styled-components';
import { SEO } from '../components';
import { PageContainer } from '../containers';

/* --------------------------------- styles --------------------------------- */

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  height: 500px;

  & .snail {
    display: none;
  }

  & * {
    margin: 5px;
  }

  ${({ theme }) => theme.breakpoints.for3TabletPortraitUp()`
    & .snail { display: initial; }
  `}
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.whiteTint};
`;

/* ---------------------------------- types --------------------------------- */

type DataProps = {
  data: {
    Snail: {
      childImageSharp: {
        gatsbyImageData: IGatsbyImageData;
      };
    };

    Eel: {
      publicURL: string;
    };
  };
};

type IndexPageProps = DataProps;

/* -------------------------------- component ------------------------------- */

const IndexPage = ({ data }: IndexPageProps) => {
  const snail = data.Snail.childImageSharp.gatsbyImageData;
  const eel = data.Eel.publicURL;

  return (
    <PageContainer>
      <h1>Squibs&apos; Gatsby Starter</h1>
      <ImageContainer>
        <GatsbyImage class="snail" image={snail} alt="" />
        <img src={eel} alt="" />
      </ImageContainer>
      <StyledLink to="/pageTwo">Go to Page 2</StyledLink>
    </PageContainer>
  );
};

/* -------------------- default props / queries / exports ------------------- */

export default IndexPage;

export const query = graphql`
  {
    Snail: file(relativePath: { eq: "indexPage/my-ramshorn-snail.jpg" }) {
      childImageSharp {
        gatsbyImageData(layout: CONSTRAINED, height: 450)
      }
    }

    Eel: file(relativePath: { eq: "indexPage/my-snowflake-eel.gif" }) {
      publicURL
    }
  }
`;

export const Head = () => <SEO title="Home Page" />;
