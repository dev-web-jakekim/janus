import {useEffect, useRef, useState} from "react";
import {publishOwnFeed, publishToRoom} from "../core/publisher";
import Janus from "../core/janus";
import styled from "styled-components";
import Video from "./Video";


const Publisher = ({ janus, opaqueId, room, username, setPubId, setPubPvId }) => {

    const videoContainerRef = useRef(null);

    useEffect(() => {
        publishToRoom( janus, opaqueId, room, username, true, (_sfutest, evtType, data) => {
            if (evtType === "joined") {
                const { id, private_id } = data;
                setPubId(id);
                setPubPvId(private_id);
                publishOwnFeed(_sfutest, true);
            } else if (evtType === "onlocalstream") {
                let stream = data;
                const videoContainer = videoContainerRef.current;
                const videoPlayer = videoContainer.querySelector("." + username);
                Janus.attachMediaStream(videoPlayer, stream);
            } else if (evtType === "oncleanup") {
                console.log('Publisher publish room oncleanup return');
            } else if (evtType === "error") {
                console.log('Publisher publish room error return');
            }
        })
    }, []);

    return (
        <Container ref={videoContainerRef}>
            <Video username={username} />
        </Container>
    )
}

const Container = styled.div`
  max-width: 500px;
`;



export default Publisher;