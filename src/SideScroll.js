import React, { useEffect, useState } from "react";
import client from "./services/axios.js";
import SingleAnswer from "./SingleAnswer.js";
import VoteResults from "./VoteResults.js";
export default function Showcase(props) {
  const [polls, setPolls] = useState([]);
  const [currentPoll, setCurrentPoll] = useState({
    pollAnswers: []
  });
  const [user, setUser] = useState(null);
  const [previousDisable, setPreviousDisable] = useState(true);
  const [nextDisable, setNextDisable] = useState(false);

  const fetchUser = async () => {
    let result = await client.get("/auth/anon/profile");

    let response = result.data;
    if (!Object.keys(response).length) {
      setUser({
        firstName: "Anonymous",
        lastName: "User",
        email: "anonymous@user.com"
      });
    } else setUser(response);
  };

  const fetchPolls = async () => {
    let result = await client.get("/polls/event/eWRhpRV");
    let polls = result.data.map((poll) => {
      poll.status = "ready";
      poll.voteResponse = null;
      return poll;
    });
    setPolls(polls);
    setCurrentPoll(polls[0]);
  };

  const nextPoll = () => {
    let index = polls.findIndex((p) => p._id === currentPoll._id);
    index = index + 1;
    if (index > 0) setPreviousDisable(false);
    console.log(index);
    if (index === polls.length - 1) {
      setNextDisable(true);
    }
    setCurrentPoll(polls[index]);
  };

  const previousPoll = () => {
    let index = polls.findIndex((p) => p._id === currentPoll._id);
    index = index - 1;
    if (index < polls.length - 1) setNextDisable(false);
    console.log(index);
    if (index === 0) setPreviousDisable(true);
    setCurrentPoll(polls[index]);
  };
  const editCancel = () => {
    setCurrentPoll((prevPoll) => ({ ...prevPoll, status: "submitted" }));
  };

  const editResponse = () => {
    // API edit response in database
    setCurrentPoll((prevPoll) => ({ ...prevPoll, status: "edit" }));
  };

  const saveVote = async (event) => {
    if (!currentPoll.voteResponse) {
      return;
    }
    console.log("Saving", currentPoll);
    const voteData = {
      userId: user._id,
      pollId: currentPoll._id,
      voteResponse: currentPoll.voteResponse,
      pollText: currentPoll.pollText,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email
    };
    if (currentPoll.status === "edit") {
      //await client.put("/votes/" + user._id, voteData);
    } else {
      //await client.post("/votes", voteData);
    }

    setCurrentPoll((prevPoll) => ({ ...prevPoll, status: "submitted" }));

    let index = polls.findIndex((p) => p._id === currentPoll._id);
    console.log("SPLICE", index);

    setPolls((prevPolls) => {
      prevPolls.splice(index, 1, currentPoll);
      prevPolls[index].status = "submitted";
      return prevPolls;
    });

    console.log("Polls after submitted", polls);
    console.log("Current poll", currentPoll);
  };

  const handleChangedValue = (value) => {
    setCurrentPoll((prevPoll) => ({ ...prevPoll, voteResponse: value }));
  };

  useEffect(() => {
    fetchUser();
    fetchPolls();
    return () => {
      console.log("unmount");
    };
  }, []);

  let render;
  render = (
    <div>
      <div className="card border-secondary mb-3" style={{ maxWidth: "26rem" }}>
        <div className="card-body text-secondary">
          <h5 className="card-title">{currentPoll.pollText}</h5>
          {/* STATUS READY */}
          {currentPoll.status === "ready" && (
            <div className="card-text">
              <SingleAnswer
                poll={currentPoll}
                onChangedValue={handleChangedValue}
              />
              <div className="mx-auto pt-5" style={{ width: "26rem" }}>
                <button
                  onClick={previousPoll}
                  type="button"
                  className="btn btn-primary mr-3"
                  disabled={previousDisable}
                >
                  Previous
                </button>
                <button
                  onClick={saveVote}
                  type="button"
                  className="btn btn-primary"
                  disabled={!currentPoll.voteResponse}
                >
                  Submit
                </button>
                <button
                  onClick={nextPoll}
                  type="button"
                  className="btn small btn-primary ml-3"
                  disabled={nextDisable}
                >
                  Next
                </button>
              </div>
            </div>
          )}
          {/* STATUS EDIT */}
          {currentPoll.status === "edit" && (
            <div className="card-text">
              <SingleAnswer
                poll={currentPoll}
                onChangedValue={handleChangedValue}
              />
              <div className="mx-auto pt-5" style={{ width: "26rem" }}>
                <button
                  onClick={saveVote}
                  type="button"
                  className="btn btn-primary"
                  disabled={!currentPoll.voteResponse}
                >
                  Submit
                </button>
                <button
                  onClick={editCancel}
                  type="button"
                  className="btn btn-primary ml-3"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {/* STATUS SUBMITTED */}
          {currentPoll.status === "submitted" && (
            <div className="card-text">
              <VoteResults
                poll={currentPoll}
                voteResponse={currentPoll.voteResponse}
              />
              <div className="mx-auto pt-5" style={{ width: "26rem" }}>
                <button
                  onClick={previousPoll}
                  type="button"
                  className="btn btn-primary mr-3"
                  disabled={previousDisable}
                >
                  Previous
                </button>
                <button
                  onClick={editResponse}
                  type="button"
                  className="btn btn-primary"
                  disabled={!currentPoll.voteResponse}
                >
                  Edit Response
                </button>
                <button
                  onClick={nextPoll}
                  type="button"
                  className="btn btn-primary ml-3"
                  disabled={nextDisable}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return render;
}
