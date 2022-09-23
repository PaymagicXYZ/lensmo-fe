import { ethers } from "ethers";

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

export const ens = {
  name: "ens",
  logo: "ens",
  apiKey: import.meta.env.ALCHEMY_ID,
  url: "https://app.ens.domains/name/",
  get resolveUser() {
    return async (userName: string) => {
      userName = new RegExp(".eth$").test(userName)
        ? userName
        : userName + ".eth";
      const provider = new ethers.providers.AlchemyProvider(
        "homestead",
        this.apiKey
      );
      return {
        name: userName,
        description: await provider.resolveName(userName),
        image:
          (await provider.getAvatar(userName)) ||
          "https://cdn-images-1.medium.com/max/1200/1*phqy7EzRlH6J2iU9_8vL0g.png",
      };
    };
  },
};

export const lens = {
  name: "lens",
  logo: "lens",
  apiKey: import.meta.env.LENS_TOKEN,
  apiUrl: "https://api.lens.dev",
  url: "https://www.lensfrens.xyz/",
  get resolveUser() {
    return async (userName: string) => {
      userName = new RegExp(".lens$").test(userName)
        ? userName
        : userName + ".lens";
      const query = `query Profiles($user:Handle!) {
  profiles(request: { handles: [$user], limit: 1 }) {
    items {
      id
      name
      ownedBy
      picture {
        ... on NftImage {
          contractAddress
          tokenId
          uri
          verified
        }
        ... on MediaSet {
          original {
            url
            mimeType
          }
        }
        __typename
      }
    }
  }
}`;
      const response = (
        await fetch(this.apiUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            query: query,
            variables: {
              user: userName,
            },
          }),
        }).then((res) => res.json())
      ).data.profiles.items;
      if (response.length > 0) {
        return {
          name: userName,
          description: response[0].ownedBy,
          image: response[0].picture
            ? response[0].picture.original?.url || response[0].picture.uri
            : "/lens.png",
        };
      } else {
        return null;
      }
    };
  },
};

export const supportedNetworks = [twitter, github, discord, ens, lens];
export const availableProviders = supportedNetworks.map((network) => {
  network.name;
});
