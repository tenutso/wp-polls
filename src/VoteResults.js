import React, { useEffect, useState } from "react";
import client from "./services/axios.js";
export default (props) => {
  const { poll, voteResponse } = props;

  const [percentage, setPercentage] = useState([]);

  useEffect(() => {
    buildResults();
  }, [buildResults]);

  const buildResults = async (voteResults) => {
    let data = "";
    if (!voteResults) {
      const result = await client.get("/votes/getVoteTotal/" + poll._id);
      data = result.data;
    } else data = voteResults;

    const sumOfPoll = data.reduce((total, num) => total + num);
    const percentOfPoll = data.map((num) =>
      Math.round((num / sumOfPoll) * 100)
    );
    setPercentage(percentOfPoll);

    //console.log(data.map((num) => Math.round((num / sumOfPoll) * 100)));
  };

  const progress = (
    <div>
      {percentage.map((item, index) => {
        return (
          <div key={index}>
            <div className="progress">
              <div
                className={"progress-bar w-" + item}
                role="progressbar"
                style={{ width: item + "%" }}
                aria-valuenow={item}
                aria-valuemin="0"
                aria-valuemax="100"
              >
                {item}%
              </div>
            </div>
            {poll.pollAnswers[index]}
          </div>
        );
      })}
    </div>
  );

  let render;
  if (poll.showResults) {
    render = <div>{progress}</div>;
  } else {
    render = (
      <div>
        You answered: <strong>{voteResponse}</strong>
        <br />
        Results of this poll are hidden by the moderator
      </div>
    );
  }

  return render;
};
