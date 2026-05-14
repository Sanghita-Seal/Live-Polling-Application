import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import PageWrapper from "../../components/layout/PageWrapper.jsx";
import GlassCard from "../../components/ui/GlassCard.jsx";
import GradientButton from "../../components/ui/GradientButton.jsx";
import { pollService } from "../../features/polls/polls.service.js";
import { getErrorMessage } from "../../utils/errorHandler.js";


function PollBuilder(){
    const {pollId} = useParams();

    const [poll, setPoll] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [form , setForm] = useState({
        question:"",
        options: ["", ""]
     });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(()=>{
        const loadPoll = async ()=>{
            try{
                const response = await pollService.getPollById(pollId);
                setPoll(response.data?.poll || null);
                setQuestions(response.data?.questions || []);
            }catch(err){
                setError(getErrorMessage(err, "Failed to load poll"));
            }finally{
                setIsLoading(false);
            }
        };

        loadPoll();
    },[pollId]);

    const handleQuestionChange = (event)=>{
        setForm((current)=>({
            ...current,
            question: event.target.value,
        }));
    }

     const handleOptionChange= (index, value)=>{
        setForm((current)=>({
            ...current,
            options: current.options.map((option, optionIndex)=> optionIndex === index ? value : option)
        }));
    }


    const addOption = ()=>{
        setForm((current)=>({
            ...current,
            options: [...current.options, ""],
        }))
    }

    const removeOption = (index)=>{
        setForm((current) =>({
            ...current, 
            options: current.options.filter((_, optionIndex)=> optionIndex!==index),
        }))
    }

    const handleSubmit = async (event)=>{
        event.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const payload = {
                question:form.question,
                questionNumber: questions.length+1,
                options: form.options.map((option, index)=>({
                    text: option,
                    order: index+1,
                })),
            };

            const response = await pollService.createQuestion(pollId, payload);

            setQuestions((current)=> [...current, response.data]);
            setForm({
                question:"",
                options: ["", ""],
             });
            }
        catch (error) {
            setError(getErrorMessage(error, "Failed to add question"));
        }finally{
            setIsSubmitting(false);
        }

    };
    if(isLoading){
        return (
            <PageWrapper>
                <main className="dashboard-main">
                    <GlassCard> Loading poll...</GlassCard>
                </main>
             </PageWrapper>
        )
    }
    
return (
  <PageWrapper>
    <main className="dashboard-main">
      <GlassCard>
        <p className="eyebrow">Poll builder</p>
        <h2>{poll?.pollName}</h2>
        <p>{poll?.pollDescription}</p>
      </GlassCard>

      <GlassCard>
        <h2>Add question</h2>

        <form className="form-stack" onSubmit={handleSubmit}>
          <label>
            Question
            <input
              value={form.question}
              onChange={handleQuestionChange}
              minLength={3}
              maxLength={300}
              required
            />
          </label>

          {form.options.map((option, index) => (
            <label key={index}>
              Option {index + 1}
              <input
                value={option}
                onChange={(event) => handleOptionChange(index, event.target.value)}
                maxLength={200}
                required
              />

              {form.options.length > 2 ? (
                <button type="button" onClick={() => removeOption(index)}>
                  Remove
                </button>
              ) : null}
            </label>
          ))}

          {form.options.length < 4 ? (
            <button type="button" onClick={addOption}>
              Add option
            </button>
          ) : null}

          {error ? <p className="form-error">{error}</p> : null}

          <GradientButton type="submit" isLoading={isSubmitting}>
            Add question
          </GradientButton>
        </form>
      </GlassCard>

      <GlassCard>
        <h2>Questions</h2>

        {questions.length === 0 ? (
          <p>No questions added yet.</p>
        ) : (
          questions.map((question) => (
            <div key={question._id}>
              <h3>
                {question.questionNumber}. {question.question}
              </h3>

              <ul>
                {question.options.map((option) => (
                  <li key={option._id}>{option.text}</li>
                ))}
              </ul>
            </div>
          ))
        )}
      </GlassCard>

      <GradientButton as={Link} to="/dashboard">
        Back to dashboard
      </GradientButton>
    </main>
  </PageWrapper>
);


    
}

export default PollBuilder;