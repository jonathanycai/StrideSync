require('dotenv').config();
const axios = require('axios');

const openaiApiKey = process.env.OPENAI_API_KEY;

class OpenAiController {
    constructor(workoutLength, genre, bpm) {
        this.workoutLength = workoutLength;
        this.genre = genre;
        this.bpm = bpm;
    }

    async getPlaylist() {
        let prompt = `Give me a list of songs in the ${this.genre} genre that has ${this.bpm} bpm that is ${this.workoutLength}
        minutes long. Only return the list of songs in json.`;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: "gpt-3.5-turbo",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 150
            }, {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            const playlist = JSON.parse(response.data.choices[0].message.content);
            console.log('Generated Playlist:', playlist.songs);
            return playlist.songs;

        } catch (error) {
            console.error('Error fetching playlist from OpenAI API:', error.response ? error.response.data : error.message);
        }
    }

}

module.exports = OpenAiController;