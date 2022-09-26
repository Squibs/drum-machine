import React from 'react';
import styled from 'styled-components';
import { Knob, SEO } from '../components';

/* -------------------------------------------------------------------------- */
/*                                   styles                                   */
/* -------------------------------------------------------------------------- */

const PageContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primaryDark};
  display: flex;
  flex-direction: column;
  height: 100%;
  color: ${({ theme }) => theme.colors.whiteTint};
  text-align: center;

  & footer,
  & h1 {
    font-family: 'Righteous', cursive;
  }

  & footer a {
    text-decoration: none;
    color: #c0392b;
  }
`;

const DrumMachineContainer = styled.main``;

const DrumMachineControlsContainer = styled.div``;

const DrumMachineLogicContainer = styled.div``;

const KnobContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Display = styled.div``;

const ButtonsContainer = styled.div`
  margin-top: 300px;
`;

const DrumPadContainer = styled.div``;

const DrumPad = styled.button``;

/* -------------------------------------------------------------------------- */
/*                                    types                                   */
/* -------------------------------------------------------------------------- */

// type DataProps = {};

// type IndexPageProps = DataProps;

/* -------------------------------------------------------------------------- */
/*                                  component                                 */
/* -------------------------------------------------------------------------- */

const IndexPage = () => {
  return (
    <PageContainer>
      <DrumMachineContainer>
        <h1>Drum Machine</h1>
        <DrumMachineControlsContainer>
          <DrumMachineLogicContainer>
            <KnobContainer>
              <Knob size={100} degrees={180} min={1} max={100} value={0} />
              {/* <Knob />
              <Knob /> */}
            </KnobContainer>
            <Display>
              <span />
            </Display>
            <ButtonsContainer>
              <label htmlFor="PowerButton">
                <input id="PowerButton" type="button" />
                Power
              </label>
              <label htmlFor="BankButton">
                <input id="BankButton" type="button" />
                Bank
              </label>
              <label htmlFor="UnknownButton">
                <input id="UnknownButton" type="button" />
                Unknown
              </label>
            </ButtonsContainer>
          </DrumMachineLogicContainer>
          <DrumPadContainer>
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
            <DrumPad />
          </DrumPadContainer>
        </DrumMachineControlsContainer>
      </DrumMachineContainer>
      <footer>
        Designed &amp; Coded by
        <a href="https://github.com/squibs"> Zachary Holman</a>
      </footer>
    </PageContainer>
  );
};

/* -------------------------------------------------------------------------- */
/*                      default props / queries / exports                     */
/* -------------------------------------------------------------------------- */

export default IndexPage;

// export const query = graphql``;

export const Head = () => <SEO title="Home Page" />;
