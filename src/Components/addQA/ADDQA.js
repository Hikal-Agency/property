import React from "react";
import { useStateContext } from "../../context/ContextProvider";
import { useState } from "react";
import { Box, Button, CircularProgress, TextField } from "@mui/material";

import axios from "../../axoisConfig";
import { toast } from "react-toastify";
import { Textarea } from "@material-tailwind/react";

const ADDQA = ({ tabValue, setTabValue, isLoading }) => {
  const { darkModeColors, BACKEND_URL, t } =
    useStateContext();
  const [loading, setloading] = useState(false);

  const [answers, setAnswers] = useState([""]);
  const [question, setQuestion] = useState();

  const handleChange = (event) => {
    const { name, value } = event.target;

    console.log("QA: ", event.target.value);
    if (name === "question") {
      setQuestion(value);
    } else if (name.startsWith("answer")) {
      const answerIndex = parseInt(name.split("-")[1]);
      const newAnswers = [...answers];
      newAnswers[answerIndex] = value;
      setAnswers(newAnswers);
    }
  };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();

  //   setloading(true);
  //   console.log("Question and answers: ", question, answers);

  //   // Combine questions and answers into an array of objects
  //   const questionsAndAnswers = [
  //     {
  //       question: question,
  //       answers: answers,
  //     },
  //   ];

  //   console.log("QA final: ", questionsAndAnswers);

  //   const token = localStorage.getItem("auth-token");
  //   try {
  //     const submitQA = await axios.post(
  //       `${BACKEND_URL}/trainingdata`,
  //       {
  //         questionsAndAnswers,
  //       },
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: "Bearer " + token,
  //         },
  //       }
  //     );
  //     console.log(submitQA.data);
  //     setloading(false);
  //     toast.success("Training data added successfully.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   } catch (error) {
  //     setloading(false);
  //     console.error(error);
  //     toast.error("Something went wrong. Data not added.", {
  //       position: "top-right",
  //       autoClose: 3000,
  //       hideProgressBar: false,
  //       closeOnClick: true,
  //       pauseOnHover: true,
  //       draggable: true,
  //       progress: undefined,
  //       theme: "light",
  //     });
  //   }
  // };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setloading(true);

    if (!question || !answers.some((answer) => answer !== "")) {
      setloading(false);
      toast.error("Please enter a question and at least one answer.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }

    const questionsAndAnswers = [
      {
        question: question,
        answers: answers.filter((answer) => answer !== ""),
      },
    ];

    const token = localStorage.getItem("auth-token");
    try {
      const submitQA = await axios.post(
        `${BACKEND_URL}/trainingdata`,
        {
          questionsAndAnswers,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        }
      );
      console.log(submitQA.data);
      setloading(false);

      setQuestion("");
      setAnswers([""]);
      toast.success("Training data added successfully.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      setloading(false);

      if (error?.response?.data?.status === false) {
        toast.error(error?.response?.data?.message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        return;
      }
      console.error(error);
      toast.error("Something went wrong. Data not added.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

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
          label={t("question")}
          className="w-full mb-3"
          style={{ marginBottom: "20px" }}
          variant="outlined"
          name="question"
          size="medium"
          value={question}
          onChange={handleChange}
        />

        {answers?.map((answer, answerIndex) => (
          <Box
            key={answerIndex}
            sx={{ display: "flex", alignItems: "center", gap: "8px" }}
          >
            <Textarea
              value={answer}
              onChange={handleChange}
              placeholder={t("enter_your_answer")}
              className="w-full mb-3"
              style={{ marginBottom: "20px", height: "150px" }}
              variant="outlined"
              name={`answer-${answerIndex}`}
              size="medium"
              rows={6}
            />

            <Button variant="outlined" size="small" onClick={handleAddAnswer}>
              +
            </Button>
            <Button
              variant="outlined"
              size="small"
              className="bg-btn-primary  text-white rounded-lg py-3 font-semibold mb-3"
              style={{color: "#ffffff" }}
              disabled={answers?.length === 1}
              onClick={() => handleRemoveAnswer(answerIndex)}
            >
              -
            </Button>
            <div className="space-y-4 mx-2 my-2 text-right"> 
              <Button variant="outlined" size="small" onClick={handleAddAnswer}>
                +
              </Button>
              <Button
                variant="outlined"
                size="small"
                className="bg-main-red-color text-white rounded-lg py-3 font-semibold mb-3"
                style={{ backgroundColor: "#cf372b", color: "#ffffff" }}
                disabled={answers?.length === 1}
                onClick={() => handleRemoveAnswer(answerIndex)}
              >
                -
              </Button>
            </div>
          </Box>
        ))}

        <Button
          type="submit"
          size="medium"
          className="bg-btn-primary w-full text-white rounded-lg py-3 font-semibold mb-3"
          style={{  color: "#ffffff" }}
          onClick={handleSubmit}
          disabled={loading ? true : false}
        >
          {loading ? (
            <CircularProgress
              size={23}
              sx={{ color: "white" }}
              className="text-white"
            />
          ) : (
            <span>{t("btn_add")}</span>
          )}
        </Button>
      </Box>
    </>
  );
};

export default ADDQA;
