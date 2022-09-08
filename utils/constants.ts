const twitter = {
  name: "twitter",
  logo: "icon-park:twitter",
  apiKey: import.meta.env.TWITTER_TOKEN,
  apiUrl: "https://api.twitter.com/2",
  get resolveUser() {
    return async (userName: string) => {
      return fetch(
        `${this.apiUrl}/users/by/username/${userName}?user.fields=description,profile_image_url`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      ).then((response) => response.json());
    };
  },
};

export const supportedNetworks = [twitter];
