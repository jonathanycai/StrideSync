const OpenAIController = require('./controllers/OpenAIController');

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    var playList = new OpenAIController(50, "rap", 120).getPlaylist();
    for (let i = 0; i < playList.length; i++) {
        console.log(playList[i]);
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});