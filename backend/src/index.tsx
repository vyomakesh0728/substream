
// backend/src/index.ts
import express from 'express';
import { Chroma } from '@langchain/community/vectorstores/chroma';
import { OpenAIEmbeddings, ChatOpenAI } from '@langchain/openai';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { nanoid } from 'nanoid';

const app = express();
app.use(express.json());

const embeddings = new OpenAIEmbeddings({ openAIApiKey: process.env.OPENAI_API_KEY });
const llm = new ChatOpenAI({ model: 'gpt-4', openAIApiKey: process.env.OPENAI_API_KEY });
const vectorStore = new Chroma(embeddings, { collectionName: 'SolanaProto', url: 'http://localhost:8000' });

// Store Substreams data
app.post('/store', async (req, res) => {
  const protoData = req.body;
  await vectorStore.addDocuments([
    {
      pageContent: JSON.stringify(protoData),
      metadata: { timestamp: new Date().toISOString(), source: 'solana-common' },
    },
  ]);
  res.status(200).send('Stored');
});

// RAG query
app.post('/query', async (req, res) => {
  const { query } = req.body;
  const docs = await vectorStore.similaritySearch(query, 5);
  const prompt = ChatPromptTemplate.fromMessages([
    ['system', 'You are an expert in Solana blockchain and Substreams. Analyze transactions, blocks, and program data from Solana Common Substreams (v0.3.3). Context: {context}'],
    ['human', '{query}'],
  ]);
  const chain = prompt.pipe(llm);
  const response = await chain.invoke({
    query,
    context: docs.map((doc) => doc.pageContent).join('\n'),
  });
  res.json({ response: response.content });
});

app.listen(3000, () => console.log('Backend on port 3000'));