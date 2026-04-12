# Search Skill Documentation

## What It Does and Why It Exists
The Search skill allows users to perform web searches via the Perplexity Sonar API, providing grounded answers with citations. It exists to facilitate easy access to current information on the web, enabling users to find answers quickly without needing to navigate multiple sources.

## How to Use It
To use this skill, simply enter the command:  
`/search <query>`  
For example, `/search latest AI frameworks` will return the most current information related to AI frameworks.

## Model Used
This skill uses the **Perplexity Sonar** model for conducting searches. The API key for this model is stored in the **openclaw.json** configuration file, typically located in the `.openclaw` directory.

## Web Research Script
The `web_research.py` script is located in the `~/clawd/tools/` directory. It is responsible for executing the search queries and returning the results to the user. This script interacts directly with the Perplexity Sonar API to retrieve relevant data.

## Example Queries and Expected Outputs
1. **Query:** `/search current Bitcoin price`  
   **Expected Output:** Returns the latest price of Bitcoin with at least one citation URL.
2. **Query:** `/search latest AI frameworks`  
   **Expected Output:** Lists current AI frameworks, including relevant dates and citations.
3. **Query:** `/search`  
   **Expected Output:** Returns an error message "no query provided" if no query is entered.
    
## Changing the Model
To change the model from Sonar to Sonar-Pro, you need to modify the search command settings in the script or configuration file to specify the desired model. Ensure the respective API key for the new model is also stored in the **openclaw.json**.

## Cost Per Search
Each search query is approximately **$0.005**. Keep this in mind for budgeting API usage.

## Failure Modes and Fixes
- **Empty Query:** If no query is provided, it returns an error "no query provided". Ensure a valid query is entered.
- **API Unavailable:** If the Perplexity API is down, the skill will return an error stating that the search is unavailable. Check API status and ensure the key is valid.
- **web_research.py Not Found:** Verify that the `web_research.py` script exists in the `~/clawd/tools/` directory.

## Dependencies
- **web_research.py**  
- **Perplexity API Key** located in the **openclaw.json** configuration file. 

This documentation is designed to provide comprehensive insights into the Search skill, ensuring that users can effectively utilize and maintain it without prior knowledge.