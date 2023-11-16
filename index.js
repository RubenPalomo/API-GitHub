import axios from "axios";

const username = "username";
const repo = "reponame";
const filePath = "players.json";
const apiUrl = `https://api.github.com/repos/${username}/${repo}/contents/${filePath}`;
const accessToken = "YOUR-TOKEN";

// Function to get the JSON file
async function getFile() {
    let content = null;
    let sha = null;

    const headers = {
        Authorization: `token ${accessToken}`,
    };

    await axios
        .get(apiUrl, {
            headers: headers,
        })
        .then((response) => {
            const data = response.data;

            content = Buffer.from(data.content, "base64").toString("utf-8");
            sha = data.sha;
        })
        .catch((error) => {
            console.error("Error getting data:", error);
        });

    return { content, sha: sha };
}

// Function to update the JSON file in GitHub
async function updateGitHubFile(newContent, sha) {
    const apiUrlWithParams = `${apiUrl}?access_token=${accessToken}`;

    const headers = {
        Authorization: `token ${accessToken}`,
        "Content-Type": "application/json",
    };

    const body = {
        message: "File file.json updated",
        content: newContent,
        sha: sha,
        branch: "main",
    };

    await axios
        .put(apiUrlWithParams, body, { headers })
        .then(() => console.log("All was good"))
        .catch((error) => console.log("There was an oh-oh:", error));
}

// Function to update the JSON file
async function updateFile(newPlayer) {
    try {
        const { content, sha } = await getFile();
        const file = JSON.parse(content);

        file.players.push(newPlayer);

        const newContent = Buffer.from(
            JSON.stringify(file, null, 2)
        ).toString("base64");

        await updateGitHubFile(newContent, sha);
    } catch (error) {
        console.error("There was an OMG:", error);
    }
}

const ejemplo = {
    token: "0000",
    name: "Dark King",
    record: 666,
};

// Function call to update the file
await updateFile(ejemplo);
