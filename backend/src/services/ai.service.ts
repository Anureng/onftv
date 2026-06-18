import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || 'dummy_key',
});

export const generateEventContent = async (eventName: string, speakerName: string, speakerDesignation: string) => {
  try {
    const prompt = `
      You are an expert event manager and copywriter.
      Generate content for the following event:
      Event Name: ${eventName}
      Speaker Name: ${speakerName}
      Speaker Designation: ${speakerDesignation}

      Please provide the output in JSON format with two keys:
      1. "description": A compelling 2-3 paragraph description of what the event will be about, assuming it is a professional event related to the speaker's designation.
      2. "speakerIntro": A professional introduction (~100 words) for the speaker.

      Return ONLY valid JSON.
    `;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.1-8b-instant',
      temperature: 0.7,
      max_tokens: 1024,
      response_format: { type: 'json_object' },
    });

    const responseText = chatCompletion.choices[0]?.message?.content || '{}';
    const parsed = JSON.parse(responseText);

    const description = Array.isArray(parsed.description) ? parsed.description.join('\n\n') : (parsed.description || '');
    const speakerIntro = Array.isArray(parsed.speakerIntro) ? parsed.speakerIntro.join('\n\n') : (parsed.speakerIntro || '');

    return {
      description,
      speakerIntro,
    };
  } catch (error) {
    console.error('Groq Generation Error:', error);
    throw new Error('Failed to generate AI content');
  }
};
