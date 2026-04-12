import requests
import json
import os

def get_api_key():
    with open(os.path.expanduser('~/.openclaw/openclaw.json')) as f:
        config = json.load(f)
    return config['models']['providers']['perplexity']['apiKey']


def query_perplexity(query):
    api_key = get_api_key()
    url = "https://api.perplexity.ai/search"
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json"
    }
    data = {
        "query": query,
        "max_results": 5,
        "max_tokens_per_page": 1024
    }
    
    response = requests.post(url, json=data, headers=headers)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error: {response.status_code} - {response.text}")
        return None


def main():
    query = 'latest developments in multi-agent AI systems April 2026'
    results = query_perplexity(query)
    print(json.dumps(results, indent=2))

if __name__ == '__main__':
    main()