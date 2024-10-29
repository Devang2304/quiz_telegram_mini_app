import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { Counter } from "./components/Counter";
import { Jetton } from "./components/Jetton";
import { TransferTon } from "./components/TransferTon";
import styled from "styled-components";
import { Button, FlexBoxCol, FlexBoxRow } from "./components/styled/styled";
import { useTonConnect } from "./hooks/useTonConnect";
import { CHAIN } from "@tonconnect/protocol";
import "@twa-dev/sdk";
import { useState } from 'react'
import QuestionCard from './components/QuestionCard'
import {fetchQuestions} from './API'
import {Difficulty} from './API'
import {QuestionState} from './API'
export type AnswerObject = {
  question: string;
  answer : string | null;
  correct : boolean;
  correctAnswer : string;
}

const totalQuestion = 10;



const StyledApp = styled.div`
  background-color: #e8e8e8;
  color: black;

  @media (prefers-color-scheme: dark) {
    background-color: #222;
    color: white;
  }
  min-height: 100vh;
  padding: 20px 20px;
`;

const AppContainer = styled.div`
  max-width: 900px;
  margin: 0 auto;
`;

function App() {
  
    const [loding, setLoding] = useState(false)
      const [questions, setquestions] = useState<QuestionState[]>([])
      const [number, setNumber] = useState(0)
      const [userAns, setUserAns] = useState<AnswerObject[]>([])
      const [score, setScore] = useState(0)
      const [gameOver, setGameOver] = useState(true)
      const { connected } = useTonConnect();



      const startQuiz = async () => {
    
        setLoding(true)
        setGameOver(false)
        
        const newQuestions = await fetchQuestions(totalQuestion, Difficulty.EASY)
    
        setquestions(newQuestions)
        setScore(0)
        setUserAns([])
        setNumber(0)
        setLoding(false)
      }
    
      const checkAnswer = (e: React.MouseEvent<HTMLButtonElement>) => {
          if(!gameOver) {
    
            const ans = e.currentTarget.textContent
            const correct = questions[number].correct_answer === ans
    
            if(correct){
              setScore( prev => prev+1);
              (e.target as HTMLBodyElement).style.backgroundColor = `rgb(0, 255, 0, 0.2)`;
            }else{
              (e.target as HTMLBodyElement).style.backgroundColor = `rgb(255, 0, 0, 0.2)`
            }
    
            const answerObject ={
              question: questions[number].question,
              answer : ans,
              correct,
              correctAnswer : questions[number].correct_answer,
            }
            setUserAns((prev) => [...prev, answerObject]);
          }
      }
    
      const nextQuestion = () => {
        const nextQuestion = number +  1
    
        if(nextQuestion === totalQuestion){
          setGameOver(true)
        }else{
          setNumber(nextQuestion)
        }
      }

  // const { network } = useTonConnect();

  return (
    
      <div className="min-h-screen flex items-center flex-col flex justify-center bg-green-100 pb-6">
  
        {!connected && (
        <>
          <h1 className="text-3xl my-2 font-bold">Sports knowledge Quiz</h1>
          <p className='text-xl font-medium m-2 p-2'>Connect your TON wallet to begin.</p>
          <TonConnectButton />
        </>
      )}
      
      {connected && (
    <>
            <h1 className="text-3xl my-2 font-bold">Sports knowledge Quiz</h1>
            <p className='text-xl font-medium m-2 p-2'>Test your Sports knowledge now👇 </p>
            {(gameOver || userAns.length === totalQuestion) && (
                <button className="py-2 px-4 bg-green-500 rounded m-2 text-white font-medium" onClick={startQuiz}>
                    Start
                </button>
            )}
            {!gameOver && ( <p className='text-xl p-2 m-2 font-medium'>Score : {score}</p>)}
            {loding && ( <p className='text-green-500 p-2 m-2 font-medium'>Loading questions ...</p>) }
            {!loding && !gameOver && (
                <QuestionCard
                    questionNo={number + 1}
                    totolQuestions={totalQuestion}
                    question={questions[number].question}
                    answers={questions[number].answers}
                    userAnswer={userAns ? userAns[number] : undefined}
                    callback={checkAnswer}
                />
            )}
            {!gameOver && !loding  && userAns.length === number + 1 && number != totalQuestion - 1 && (
                <button className='m-2 py-2 px-4 text-white bg-green-500 rounded' onClick={nextQuestion}>
                    Next Question
                </button>
            )}
        </>
    )}

        </div>
  );
}

export default App;
