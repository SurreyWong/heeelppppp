import OpenAI from "openai";

const apiKey= process.env.NEXT_PUBLIC_GROQ_API_KEY;
if (!apiKey) {
  console.error(" Groq API key is missing");
}

const openai = new OpenAI({
  apiKey,
  baseURL: "https://api.groq.com/openai/v1",
  dangerouslyAllowBrowser: true,
});

const getFinancialAdvice = async (totalBudget, totalIncome, totalSpend) => {
  try {
    const userPrompt = `
      Based on the following financial data:
      - Total Budget: RM${totalBudget}
      - Expenses: RM${totalSpend}
      - Income: RM${totalIncome}
      Provide 2 sentences of personalized financial advice to help the user manage money better.
    `;

    const chatCompletion = await openai.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: userPrompt }],
    });

    const advice = chatCompletion.choices[0].message.content;
    console.log(" Groq response:", advice);
    return advice;
  } catch (error) {
    console.error(" Error from Groq:", error);
    return "Sorry, I couldn't fetch the financial advice at this moment. Please try again later.";
  }
};

export default getFinancialAdvice;
