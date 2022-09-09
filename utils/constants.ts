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
          if (data.data) {
            return {
              name: data.data.name,
              description: data.data.description,
              image: data.data.profile_image_url,
            };
          } else {
            return null;
          }
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
          if (data.name) {
            return {
              name: data.name,
              description: data.bio,
              image: data.avatar_url,
            };
          } else {
            return null;
          }
        });
    };
  },
};

const discord = {
  name: "discord",
  logo: "logos:discord-icon",
  apiKey: import.meta.env.DISCORD_TOKEN,
  apiUrl: "https://discord.com/api/v10",
  url: "https://discord.com/",
  get resolveUser() {
    return async (userName: string) => {
      return fetch(`${this.apiUrl}/users/${userName}`, {
        method: "GET",
        headers: {
          Authorization: `Bot ${this.apiKey}`,
          "Content-Type": "application/json; charset=UTF-8",
          "User-Agent":
            "DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.username) {
            return {
              name: data.username + "#" + data.discriminator,
              description: data.banner,
              image: data.avatar
                ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png?size=1024`
                : `https://cdn.discordapp.com/embed/avatars/${
                    data.discriminator[3] % 5
                  }.png`,
            };
          } else {
            return null;
          }
        });
    };
  },
};

export const supportedNetworks = [twitter, github, discord];
