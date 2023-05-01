import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";

const ADDQA = ({ tabValue, setTabValue, isLoading }) => {
  const { currentMode, darkModeColors, formatNum, BACKEND_URL } =
    useStateContext();
  const [loading, setloading] = useState(false);

  const [answers, setAnswers] = useState([""]);

  const handleAddAnswer = () => {
    setAnswers([...answers, ""]);
  };

  const handleRemoveAnswer = (answerIndex) => {
    const newAnswers = [...answers];
    newAnswers.splice(answerIndex, 1);
    setAnswers(newAnswers);
  };
  return (
    <>
      <Box sx={darkModeColors}>
        <TextField
          type={"text"}
          label="Question "
          className="w-full mb-3"
          style={{ marginBottom: "20px" }}
          variant="outlined"
          name="question"
          size="medium"
          //   value={}
          //   onChange={ }
        />

        {answers?.map((answer, answerIndex) => (
          <Box
            key={answerIndex}
            sx={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <TextField
              label={`Answer ${answerIndex + 1}`}
              value={answer}
              onChange={(event) => {
                const newAnswers = [...answers];
                newAnswers[answerIndex] = event.target.value;
                setAnswers(newAnswers);
              }}
              className="w-full mb-3"
              style={{ marginBottom: "20px" }}
              variant="outlined"
              name="answer"
              size="medium"
            />
            <Button variant="outlined" size="small" onClick={handleAddAnswer}>
              +
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="bg-main-red-color  text-white rounded-lg py-3 font-semibold mb-3"
              style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
              disabled={answers?.length === 1}
              onClick={() => handleRemoveAnswer(answerIndex)}
            >
              -
            </Button>
          </Box>
        ))}

        <Button
          type="submit"
          size="medium"
          className="bg-main-red-color w-full text-white rounded-lg py-3 font-semibold mb-3"
          style={{ backgroundColor: "#da1f26", color: "#ffffff" }}
          //   onClick={handleClick}
          disabled={loading ? true : false}
        >
          {loading ? (
            <CircularProgress
              size={23}
              sx={{ color: "white" }}
              className="text-white"
            />
          ) : (
            <span> Add</span>
          )}
        </Button>
      </Box>
    </>
  );
};

export default ADDQA;
