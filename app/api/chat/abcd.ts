import { ReplicateStream, StreamingTextResponse } from 'ai';
import Replicate from 'replicate';
import { experimental_buildLlama2Prompt } from 'ai/prompts';
 
// Create a Replicate API client (that's edge friendly!)
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_KEY || '',
});
 
// IMPORTANT! Set the runtime to edge
//export const runtime = 'edge';
 
export async function POST(req: Request) {
    console.log(req)
  const { messages } = await req.json();
 
  const response = await replicate.predictions.create({
    stream: true,

    model: "meta/llama-2-13b-chat",

    //version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',

    input: {
      prompt: experimental_buildLlama2Prompt(messages),
    },
  });
 
  const stream = await ReplicateStream(response);
  // Respond with the stream
  return new StreamingTextResponse(stream);
}