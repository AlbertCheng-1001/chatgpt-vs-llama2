import { Configuration, OpenAIApi } from "openai-edge";
import { OpenAIStream, StreamingTextResponse, ReplicateStream } from "ai";
import Replicate from 'replicate';
import { experimental_buildLlama2Prompt } from 'ai/prompts';


export const runtime = 'edge';

const config = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
})


const replicate = new Replicate({
    auth: process.env.REPLICATE_API_KEY || '',
  });



const openai = new OpenAIApi(config);

export async function POST(req: Request) {
    //console.log(config);

    const { messages } = await req.json();

    console.log(typeof(messages))


    console.log(messages)

    const response = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        stream: true,
        messages: [{
            role: "system", content: "you are a helpful assistant. You explain software concempts simply to intermediate programmers."
        },
        ...messages
        ]

    })

    const chatgptstream = await OpenAIStream(response);

    const chatgpt = new StreamingTextResponse(chatgptstream);




    const response2 = await replicate.predictions.create({
        stream: true,
    
        model: "meta/llama-2-13b-chat",
    
        //version: '2c1608e18606fad2812020dc541930f2d0495ce32eee50074220b87300bc16e1',
    
        input: {
          prompt: experimental_buildLlama2Prompt(messages),
        },
      });
     
      const stream = await ReplicateStream(response2);
      // Respond with the stream


      const replicate123 = new StreamingTextResponse(stream);
}
