export async function generateOutline(_formData: any) {
  const data = ""
  return data;
}

export async function generateEssay(_payload: any) {
  const data = ""
  return data;
}

export async function generateFeedback(_payload: any) {
  const data = {
    "feedback": [
      "Your explanation was very clear and easy to follow. You provided a strong, cohesive example.",
      "You effectively highlighted the key challenges and your specific contributions to the project's success.",
      "The way you connected your past experience to the requirements of this role was excellent. It showed a deep understanding of the position."
    ],
    "additional_info_request": {
      "needs_additional_info": true,
      "reason": "We need to understand the quantifiable impact of your work to better evaluate your candidacy.",
      "questions": [
        "Can you provide specific metrics or numbers related to your project's outcome? For example, by what percentage did you increase efficiency or reduce costs?",
        "How did you measure the success of your solution?"
      ]
    }
  }
  return data;
}

export async function generateRevision(_payload: any) {
  const data = {
    "revised_essay": "The revised essay would have appeared here. This version would be a polished final draft, incorporating the feedback on your original essay and integrating the additional details you provided through the sub-questions. We would have refined the language, strengthened the narrative, and ensured the essay directly addresses the prompt with clear, impactful examples.",
    "revision_explanation": [
      "Refined sentence structure and word choice for better flow and a more professional tone.",
      "Integrated the key details you provided about the project's goal, your specific role, and the final impact. This transforms general statements into a compelling, data-backed narrative.",
      "Strengthened the introduction and conclusion to be more impactful, clearly setting up your argument and providing a memorable closing statement.",
      "Ensured all revisions maintained your unique voice and story while improving clarity and coherence."
    ]
  }
  return data;
}

export async function generateSubQuestions(payload: any) {
  const questionText = payload.question_text || "Tell me about a time you faced a difficult challenge at work.";
  const data = {
    "subquestion": {
      "1": {
        "question": questionText,
        "sub_question_list": {
          "1": {
            "sub_question": "What was the specific problem you were trying to solve?",
            "suggested_inputs": [
              "A critical bug in production",
              "A tight project deadline",
              "A difficult team conflict",
              "A major system outage"
            ]
          },
          "2": {
            "sub_question": "What steps did you take to resolve the challenge?",
            "suggested_inputs": [
              "I gathered information from stakeholders",
              "I broke down the problem into smaller tasks",
              "I collaborated with a senior engineer",
              "I created a new test suite"
            ]
          },
          "3": {
            "sub_question": "What was the outcome of your actions?",
            "suggested_inputs": [
              "We met the deadline",
              "The system was restored within 30 minutes",
              "The bug was fixed and customer satisfaction increased",
              "The team developed a new communication strategy"
            ]
          }
        }
      },
    },
    prompts: {
      "1": {  }
    }
  }
  return data;
}

export async function generateFreeEssay(_payload: any) {
  const data = {
    "essay": "This is would have been an AI generated 자기소개서 (self-introduction essay) based on the provided question text.",
    "length": "108",
  }
  return data;
}

export async function getFeedback(_payload: any) {
  const data = {
    "final_score": 82,
    "feedback_dict": {
      "항목별_평가": {
        "질문_적합도": {
          "점수": 3,
          "설명": "You understood the intent of the interview questions well and clearly presented the core of your answers. However, some responses did not fully capture the hidden meaning of the questions.",
          "피드백": "Your answers get to the heart of the questions. But there are parts where the interviewer might ask 'Why?' Add a bit more of your 'intent' or 'thought process' to your answers to make them stronger."
        },
        "경험_연결력": {
          "점수": 4,
          "설명": "You connected your experiences to the answers well, but some were just simple listings. It would be better to explain the lessons or results you gained from these experiences in more detail.",
          "피드백": "You've shared your experiences well! However, the answer to 'So how does that experience help you in this job?' is still a bit lacking. Strengthen the link between what you learned and how you can apply it to this company and this role."
        },
        "직무_키워드_반영": {
          "점수": 4,
          "설명": "You made an effort to use job-related keywords, but some were not integrated naturally into the context.",
          "피드백": "It's good that you tried to use job-related terms. But they sometimes feel like words copied directly from a dictionary. Practice explaining these keywords in your 'own words.' For example, instead of just 'refactoring,' you could say 'the process of 고민 ( 고민: 고민 in Korean is a deep thought or worry, here, it's used as the process of serious consideration to make better code).' "
        },
        "표현력과_문장력": {
          "점수": 5,
          "설명": "Overall, your sentences are clear and easy to understand. However, some sentences are simple in structure and can feel a bit dull.",
          "피드백": "Your sentences are clean and clear, which is great! But they can sometimes feel a bit too much like a textbook. Vary your sentence lengths and use different expressions instead of ending every sentence with 'did' or 'was' to create a better rhythm."
        },
        "개성과_차별성": {
          "점수": 3,
          "설명": "You made an effort to appeal your strengths. However, your story lacks the uniqueness to differentiate you from other candidates.",
          "피드백": "I appreciate your effort to highlight your strengths! But the question 'So why do we need this person on our team?' is still not fully answered. Create a 'special episode' about yourself related to this job. You need a 'one-hit wonder' that will make the interviewer remember you."
        }
      },
      "총괄_피드백": "This letter is a solid B-minus on the sincerity scale—it's polite, functional, and could be sent to literally any company on the planet. The problem is, it’s missing the \"you.\" It doesn't tell them what makes you, well, you. You're a human being, not a corporate-speak factory.\n\nThe goal isn't just to list your skills; it's to tell a story that makes them want to meet you. Instead of saying you're a \"team player\" (which is like saying you're a fan of oxygen), tell them how you once wrangled a team of stubborn developers to hit a deadline while fueled entirely by stale donuts and sheer willpower. Instead of just admiring their work, mention a specific project they've done that blew your mind. Was it a website? A campaign? A viral tweet? Make them feel special!"
    }
  }
  return data;
}

export async function getPersonaFeedback(payload: any) {
  const persona = payload.feedback_style_name || "럭키비키";
  
  const data =
    {
      "persona_feedback": `The chosen feedback style is ${persona}. The 총괄_피드백 would have been written in a ${persona} tone of voice.` 
    };
  return data;
}

export async function chatBotRevision(_payload: any) {
  const data = {
    "user_insight_target": "This is where we would show a line or two showing that we understood the user's intent and what was fixed.",
    "edited_essay": "This would have been the newly revised essay, updated in real-time based on your last response. we would have incorporated your feedback and made the necessary revisions. It would be a more polished version, showing how your input had improved the overall content and tone. The updated draft would have appeared on the right or below depending on whether this is viewed on a laptop or mobile.",
    "followup_question": "This is where the AI followup question would appear. Users would answer this question to continue the conversation and further refine their essay.",
  }
  return data;
}

