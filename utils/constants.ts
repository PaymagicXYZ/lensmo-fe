const twitter = {
  name: "twitter",
  logo: "icon-park:twitter",
  apiKey: import.meta.env.TWITTER_TOKEN,
  apiUrl: "https://api.twitter.com/2",
  url: "https://twitter.com/",
  get resolveUser() {
    return async (userName: string) => {
      return fetch(
        `${this.apiUrl}/users/by/username/${userName}?user.fields=description,profile_image_url`,
        {
          method: "GET",
          headers: { Authorization: `Bearer ${this.apiKey}` },
        }
      )
        .then((response) => response.json())
        .then((data) => {
          return {
            name: data.data.name,
            description: data.data.description,
            image: data.data.profile_image_url,
          };
        });
    };
  },
};

const github = {
  name: "github",
  logo: "icon-park:github",
  apiKey: import.meta.env.GITHUB_TOKEN,
  apiUrl: "https://api.github.com",
  url: "https://github.com/",
  get resolveUser() {
    return async (userName: string) => {
      return fetch(`${this.apiUrl}/users/${userName}`, {
        method: "GET",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${this.apiKey}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          return {
            name: data.name,
            description: data.bio,
            image: data.avatar_url,
          };
        });
    };
  },
};
export const supportedNetworks = [twitter, github];
