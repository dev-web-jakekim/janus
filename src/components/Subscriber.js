import {useEffect, useRef, useState} from "react";
import {publishToRoom} from "../core/publisher";
import {subscribeRemoteFeed} from "../core/subscriber";
import Janus from "../core/janus";
import Video from "./Video";
import styled from "styled-components";

const Subscriber = ({ janus, opaqueId, room, pubId, pubPvtId, username }) => {

    const videoContainerRef = useRef(null);

    const remoteFeedCallback = (_remoteFeed, eventType, data) => {
        if(eventType === "onremotestream"){
            const stream = data;
            const videoContainer = videoContainerRef.current;
            const videoPlayer = videoContainer.querySelector("." + username)
            Janus.attachMediaStream(videoPlayer, stream);
        }else if(eventType === "oncleanup"){
            console.log('Subscriber remoteFeedCallback oncleanup return');
        }else if(eventType === "error"){
            console.log('Subscriber remoteFeedCallback error return');
        }
    }

    useEffect(() => {
        publishToRoom(janus, opaqueId, room, username, false, (_sfutest, evtType, data) => {
            if (evtType === "joined") {
                const list = data?.publishers;
                if (list.length < 1) {
                    return;
                }
                const publisher = list[0];
                const { id, audio_codec, video_codec } = publisher;
                subscribeRemoteFeed(janus, opaqueId, room, id, pubPvtId, audio_codec, video_codec, remoteFeedCallback);
            }
        });
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

export default Subscriber
