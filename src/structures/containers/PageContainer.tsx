import React from 'react';
import styled from 'styled-components';

/* --------------------------------- styles --------------------------------- */

const StyledPageContainer = styled.div`
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

type PageContainerProps = {
  children?: React.ReactNode;
};

/* -------------------------------- component ------------------------------- */

const PageContainer = ({ children }: PageContainerProps) => (
  <StyledPageContainer>{children}</StyledPageContainer>
);

/* -------------------- default props / queries / exports ------------------- */

PageContainer.defaultProps = {
  children: null,
};

export default PageContainer;
