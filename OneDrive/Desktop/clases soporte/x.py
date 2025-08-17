from requests_oauthlib import OAuth1Session

# Your consumer key and secret
CONSUMER_KEY = "your_consumer_key"
CONSUMER_SECRET = "your_consumer_secret"

# OAuth 1.0 Session
oauth = OAuth1Session(CONSUMER_KEY, client_secret=CONSUMER_SECRET)

# Example: Obtaining a request token (if needed for 3-legged flow)
# fetch_response = oauth.fetch_request_token("https://api.example.com/oauth/request_token")
# resource_owner_key = fetch_response.get('oauth_token')
# resource_owner_secret = fetch_response.get('oauth_token_secret')

# Example: Making an authenticated API call
url = "https://api.example.com/data"
response = oauth.get(url)

print(response.status_code)
print(response.json())