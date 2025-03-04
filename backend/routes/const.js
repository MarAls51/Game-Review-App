const reviewPrompt = (name, gameData) => `
Write a game review for the game titled ${name}. Use credible sources such as Metacritic, PC Gamer, and other game review websites to inform your response. Be very honest about the negatives. The review should remain the same for both the current year and the previous one unless there were significant updates.

Below is JSON data of the most helpful Steam reviews from the last 365 days for this game: ${JSON.stringify(gameData, null, 2)}. Use this data and consider it the **most important part** of making the review, utilize the json data more than any review from any website or previous knowledge that you have. Also ensure the review is structured as follows:

### **Bullet Point Summary (Select one from each category)**
- **Graphics:** ["Beautiful", "Good", "Decent", "Bad", "Terrible"] rated from best to worst
- **Gameplay:** ["Addictive like heroin", "Very good", "Good", "Ok", "Terrible"] rated from best to worst
- **Audio:** ["Eargasm", "Very good", "Good", "Not too bad", "Bad", "Earrape"] rated from best to worst
- **Audience:** ["Kids", "Teens", "Adults", "Grandma"] rated from youngest to oldest
- **PC Requirements:** ["Laptops can run it", "Decent", "Fast", "Quantum computer"] rated from least demanding to most demanding. Check pc requirements to get a good metric for this.
- **Difficulty:** ["Brain not required", "Casual", "Difficult", "Dark Souls"] rated from easiest to hardest
- **Grind:** ["Nothing to grind", "Only if you care about leaderboards/ranks", "Isn't necessary to progress", "Average grind level", "Too much grind"]  rated from best to worst
- **Story:** ["Text or Audio floating around", "Some lore", "Average", "Good", "Lovely", "It'll replace your life"] rated from worst to best
- **Game Time:** ["Long enough for a cup of tea", "Short", "Average", "Long", "Replayable"] going from shortest to longest
- **Price:** ["Worth the price", "If you have some spare money left", "Not recommended", "You could also just burn your money"] rated from best to worst
- **Bugs:** ["Never heard of", "Minor bugs", "Can get annoying", "The game itself is a big terrarium for bugs"] rated from best to worst

### **Sections to Include**
1. **Pros:** At least 3 sentences listing positive aspects.
2. **Cons:** At least 3 sentences listing negative aspects.
3. **Notable Mentions:** Any noteworthy or unique features.
4. **Bottom Line Summary:** A concise review summary (at least 3 sentences).
5. **Grade:** A ranking from ["S", "A", "B", "C", "D", "F"]. Anythig with an overwhelmingly positive review average on steam is either a S or an A tier. S means SUPER so better than A.
6. **Developer Reputation:** Briefly discuss the developer’s reputation (e.g., microtransactions, controversies).
7. **Notable Changes** any major updates or changes within the last year that have impacted the game in a significant way.
10. **review weight** A score representing how confident the model is in its review. Smaller niche titles with fewer reviews and feedback are harder for the model to gauge effectively. Any review with a rating below a 6 should be taken with a grain of salt.

The response must be **structured as a valid JSON object**, like this:

\`\`\`json
{
    "bullet_point_summary": {
        "graphics": "Beautiful",
        "gameplay": "Very good",
        "audio": "Eargasm",
        "audience": ["Teens", "Adults"],
        "pc_requirements": "Fast",
        "difficulty": "Casual",
        "grind": "Nothing to grind",
        "story": "Good",
        "game_time": "Long",
        "price": "Worth the price",
        "bugs": "Never heard of"
    },
    "pros": "Great graphics, addictive gameplay, fantastic audio.",
    "cons": "Occasional bugs, a bit of grind.",
    "notable_mentions": "Unique storyline, challenging puzzles.",
    "bottom_line_summary": "A must-play for fans of puzzle games.",
    "change_over_time": "compared with last year, there haven't been any major updates"
    "grade": "A",
    "developer_reputation": "Some concerns about microtransactions, but generally well-regarded.",
    "review_weight": 10
}
    use 15000 tokens minimum for your response.
\`\`\`
`;

const deepDiveReviewPrompt = (name, gameData) => `
You are an AI designed to write detailed, structured game reviews. Always respond in JSON format.

Write a well-written and engaging deep dive review of the game '${name}'. The review should cover the following points in paragraphs, without bolding anything, just plain text:
- Describe the core mechanics, player experience, difficulty, and progression.
- Detail the visuals, artistic style, and overall performance of the game.
-  If applicable, discuss the narrative depth, character development, and how well the story is integrated into the gameplay.
- Strengths & Weaknesses Highlight the strengths of the game and any areas where it could improve or fall short.
- Overall Experience Discuss how the game feels to play, its replay value, and the lasting impact it leaves on players.
- any notable mentions, something found in either the reviews provided below or just general review from metacritic or another source.

Here is a JSON file that contains the most helpful reviews of this game from the past 365 days. Use this to guide your analysis:
\`\`\`json
${JSON.stringify(gameData, null, 2)}
\`\`\`

### **Response Format (Ensure this structure in your response):**
\`\`\`json
{
  "title": "An engaging and fitting title for the review",
  "content": "A detailed, structured, and engaging deep dive review written in at least five well-formed paragraphs, addressing the topics mentioned above."
}
\`\`\`
`;

const personalizedReviewPrompt = (name, gameData, steamData, xboxData) => `
You are an AI designed to write personalized game reviews tailored to a user's gaming preferences based on their library. Your response must always be in valid JSON format.

For both tasks 
- Consider the user's gaming habits (derived from ${JSON.stringify(steamData, null, 2)} and ${JSON.stringify(xboxData, null, 2)}) and the follwing game review content (${JSON.stringify(gameData, null, 2)}).  

### Task:
1. **Analyze the user's gaming history**  
   - Compare '${name}' to games in the user's Steam and Xbox libraries, explain how each maybe similar to the game they are considering to buy.
   - Identify the most similar games based on **genre, mechanics, pacing, difficulty, and multiplayer/single-player experience**.  
   - Prioritize comparisons with the user's most-played games, as they indicate stronger preferences.  

2. **Write a concise personalized review**  
   - Use existing review data for '${name}' as a foundation.  
   - Highlight aspects of '${name}' that align with the user's tastes (e.g., if they enjoy deep RPG mechanics, focus on that).  
   - Be as detailed as possible when comparing the games the user has in their library to the games they are considering to buy.
### Expected JSON Output Format:
\`\`\`json
{
  "comparison": "This game shares similarities with [X game] and [Y game] in your library. It offers [mention gameplay elements, difficulty, mechanics, or multiplayer features the user might enjoy].",
  "review": "A brief but insightful review of the game, ensuring it remains relevant to the user's preferences."
}
\`\`\`

Ensure that:
- Your response **only** contains valid JSON output.
- You **do not** include any additional commentary outside the JSON response.
- You focus on the user's **most-played** games to determine their likely preferences, for steam games that would be total playtimes for xbox games that would be the progress percentage.

Now, generate a response for '${name}' based on the provided data.
`;




module.exports = { reviewPrompt, deepDiveReviewPrompt, personalizedReviewPrompt };

