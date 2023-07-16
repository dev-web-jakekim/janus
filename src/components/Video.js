import styled from "styled-components";

const Video = ({ username }) => {

    return (
        <Container>
            <Title> {username} </Title>
            <Contents className={username} autoPlay />
        </Container>
    )
};

const Container = styled.div`
  width: 100%;
  max-width: 500px;
  height: 100%;
  max-height: 500px;
  overflow: hidden;
`;
const Title = styled.span`
  font-size: 14px;
`;
const Contents = styled.video`
  width: 100%;
  height: 100%;
`;

export default Video;