
export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const apiKey = process.env.RAWG_API_KEY;

  if (!apiKey) {
    return res.status(500).json({
      error: "The game database API key is not configured."
    });
  }

  try {
    // Retrieve detailed information for one game when requested.
    if (req.query.id) {
      const gameId = String(req.query.id);

      if (!/^\d+$/.test(gameId)) {
        return res.status(400).json({
          error: "Invalid game ID."
        });
      }

      const detailResponse = await fetch(
        `https://api.rawg.io/api/games/${gameId}?key=${encodeURIComponent(apiKey)}`
      );

      if (!detailResponse.ok) {
        console.error(
          "RAWG game details request failed:",
          detailResponse.status
        );

        return res.status(502).json({
          error: "Unable to retrieve this game's details."
        });
      }

      const detail = await detailResponse.json();

      return res.status(200).json({
        game: {
          id: detail.id,
          title: detail.name,
          description:
            detail.description_raw ||
            "No description is available for this game yet.",
          genres: (detail.genres || []).map(
            (genre) => genre.name
          ),
          platforms: (detail.platforms || []).map(
            (item) => item.platform.name
          ),
          image: detail.background_image,
          rating: detail.rating,
          released: detail.released
        }
      });
    }

    // Otherwise, return the normal game list.
    const searchParams = new URLSearchParams({
      key: apiKey,
      page_size: "20",
      ordering: "-rating"
    });

    if (req.query.search) {
      searchParams.set("search", req.query.search);
    }

    if (req.query.page) {
      const page = Number(req.query.page);

      if (!Number.isInteger(page) || page < 1 || page > 100) {
        return res.status(400).json({
          error: "Page must be a number between 1 and 100."
        });
      }

      searchParams.set("page", String(page));
    }

    const response = await fetch(
      `https://api.rawg.io/api/games?${searchParams.toString()}`
    );

    if (!response.ok) {
      console.error("RAWG request failed:", response.status);

      return res.status(502).json({
        error: "Unable to retrieve games right now."
      });
    }

    const data = await response.json();

    const games = (data.results || []).map((game) => ({
      id: game.id,
      title: game.name,
      image: game.background_image,
      rating: game.rating,
      released: game.released,
      platforms: (game.platforms || []).map(
        (item) => item.platform.name
      ),
      genres: (game.genres || []).map(
        (genre) => genre.name
      ),
      description: ""
    }));

    return res.status(200).json({
      count: data.count,
      nextPage: data.next
        ? Number(req.query.page || 1) + 1
        : null,
      games
    });
  } catch (error) {
    console.error(
      "Game database request failed:",
      error.message
    );

    return res.status(500).json({
      error: "Something went wrong while retrieving games."
    });
  }
}

