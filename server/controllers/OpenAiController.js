require('dotenv').config();
const axios = require('axios');

class OpenAiController {
    constructor(workoutLength, genre, bpm) {
        this.workoutLength = workoutLength;
        this.genre = genre;
        this.bpm = bpm;
    }

    async getPlaylist() {
        let prompt = `Provide a valid JSON array containing a list of songs in the following format: 
        [
            {"title": "Song Title", "artist": "Artist Name"}
        ].
        The songs should be in the ${this.genre} genre with a tempo of ${this.bpm} BPM, and the total playtime of all the songs added together should be approximately ${this.workoutLength} minutes.
        Only return the JSON object with no additional text or formatting. Please complete each object before returning`;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-4o",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 500
            }, {
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            });

            let content = response.data.choices[0].message.content;
            console.log('Raw OpenAI Response:', content);

            // Remove unwanted characters such as backticks (```json ... ```) before parsing
            content = content.replace(/```json|```/g, '').trim();

            // Parse the sanitized content as JSON
            const playlist = JSON.parse(content);
            console.log('Generated Playlist:', playlist);

            return playlist;
        } catch (error) {
            console.error('Error generating or parsing playlist from OpenAI:', error);
            return null;
        }
    }
}

module.exports = OpenAiController;