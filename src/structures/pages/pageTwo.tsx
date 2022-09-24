import React from 'react';
import { Link } from 'gatsby';
import styled from 'styled-components';
import { SEO } from '../components';
import { decrement, increment } from '../../store/counter/counterSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { PageContainer } from '../containers';

/* --------------------------------- styles --------------------------------- */

const ReduxExample = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 112px;
  margin-bottom: 112px;

  & span {
    font-size: 72px;
  }

  & div button:first-child {
    margin-right: 25px;
  }
`;

const StyledLink = styled(Link)`
  color: ${({ theme }) => theme.colors.whiteTint};
`;

/* -------------------------------- component ------------------------------- */

const PageTwo = () => {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  return (
    <PageContainer>
      <h1>Squibs&apos; Gatsby Starter</h1>
      <p>This is page two.</p>
      <ReduxExample>
        <h2>Simple Counter</h2>
        <p>Gatsby redux-toolkit / react-redux simple counter example.</p>
        <span>{count}</span>
        <div>
          <button type="button" aria-label="Increment value" onClick={() => dispatch(increment())}>
            Increment
          </button>
          <button type="button" aria-label="Decrement value" onClick={() => dispatch(decrement())}>
            Decrement
          </button>
        </div>
      </ReduxExample>
      <StyledLink to="/">Go to Page 1</StyledLink>
    </PageContainer>
  );
};

/* -------------------- default props / queries / exports ------------------- */

export default PageTwo;

export const Head = () => <SEO title="Page Two" />;
