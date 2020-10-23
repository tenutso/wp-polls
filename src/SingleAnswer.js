import React from "react";

export default (props) => {
  const { poll, onChangedValue } = props;
  let render;

  const handleOptionChange = (event) => {
    onChangedValue(event.target.value);
  };
  render = (
    <div>
      {poll.pollAnswers.map((answer, index) => {
        return (
          <div key={index} className="form-check">
            <input
              onChange={handleOptionChange}
              id={"radio-answer-" + index}
              className="form-check-input"
              type="radio"
              name="voteResponse"
              value={answer}
              checked={answer === poll.voteResponse}
            />
            <label
              className="form-check-label"
              htmlFor={"radio-answer-" + index}
            >
              {answer}
            </label>
          </div>
        );
      })}
    </div>
  );

  return render;
};
