import './App.css';
import { useEffect, useState } from "react";
import Janus from "./core/janus";
import Publisher from "./components/Publisher";
import Subscriber from "./components/Subscriber";
import styled from "styled-components";

const SERVER = "wss://" + "janus-legacy.conf.meetecho.com" + "/ws";
const ROOM = 1234;
const OPAQUE_ID = 'JANUS-APP-TEST-1234'

function App() {

    const [janusInstance, setJanusInstance] = useState(null);
    // Publisher ID
    const [pubId, setPubId] = useState(null);
    // Publisher Private ID
    const [pubPvId, setPubPvId] = useState(null);
    // Add Subscriber for Testing
    const [addSub, setAddSub] = useState([]);

    useEffect(() => {
        Janus.init({debug: "all", callback: function() {
                if(!Janus.isWebrtcSupported()) {
                    console.log("No WebRTC support... ");
                    return;
                }

                const janus = new Janus(
                    {
                        server: SERVER,
                        success: function() {
                            console.log("Janus Loaded");
                            setJanusInstance(janus);
                        },
                        error: function(error) {
                            console.log("Janus Error");
                            Janus.error(error);
                            setJanusInstance(null);
                        },
                        destroyed: function() {
                            console.log("Janus Destroyed");
                            setJanusInstance(null);
                        }
                    });
            }});
    }, []);

    const handleAddSubscriber = () => {
        let userName = "Subscriber_" + addSub.length;
        setAddSub([...addSub, userName]);
    }

    return (
        <Container>
            <Header>
                <Info>
                    JANUS APP DEMO
                </Info>
                <Action>
                    <button onClick={handleAddSubscriber}>Add Subscriber</button>
                </Action>

            </Header>
            <Contents>
                {
                    janusInstance &&
                    <PublisherWrapper>
                        <Publisher
                            janus={janusInstance}
                            opaqueId={OPAQUE_ID}
                            room={ROOM}
                            username="TEST_PUBLISHER"
                            setPubId={setPubId}
                            setPubPvId={setPubPvId}
                        />
                    </PublisherWrapper>
                }

                {
                    addSub.length > 0 &&
                    <SubscriberWrapper>
                        {
                            addSub.map((sub) => {
                                return (
                                    <Subscriber
                                        janus={janusInstance}
                                        opaqueId={OPAQUE_ID}
                                        room={ROOM}
                                        pubId={pubId}
                                        pubPvId={pubPvId}
                                        username={sub}
                                    />
                                )
                            })
                        }
                    </SubscriberWrapper>
                }
            </Contents>
        </Container>
    );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

const Header = styled.div`
  border: 1px solid #333;
  margin: 50px;
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div``;

const Action = styled.div`
  margin-left: auto;
`;

const Contents = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 50px;
`;

const PublisherWrapper = styled.div`
  width: 30%;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SubscriberWrapper = styled.div`
  width: 60%;
  border: 1px solid #333;
  border-radius: 8px;
  padding: 30px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  flex-wrap: wrap;
`;

export default App;

