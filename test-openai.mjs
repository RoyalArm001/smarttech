import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: "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",
});

const response = openai.responses.create({
  model: "gpt-5.4-mini",
  input: "write a haiku about ai",
  store: true,
});

response.then((result) => {
  console.log("Success! Output text:");
  console.log(result.output_text);
}).catch((err) => {
  console.error("Error calling OpenAI responses.create:");
  console.error(err);
});
