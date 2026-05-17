exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // ───────────────── QUERY DATABASE ─────────────────
    if (!body.action) {
      const { token, databaseId } = body;

      const response = await fetch(
        `https://api.notion.com/v1/databases/${databaseId}/query`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
        },
      );

      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    }

    // ───────────────── UPDATE PAGE STATUS ─────────────────
    if (body.action === "update") {
      const { token, pageId, completed } = body;

      const response = await fetch(
        `https://api.notion.com/v1/pages/${pageId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            properties: {
              Status: {
                select: {
                  name: completed ? "[03_DECRYPTED]" : "[02_IN_FLIGHT]",
                },
              },
            },
          }),
        },
      );

      const data = await response.json();

      return {
        statusCode: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify(data),
      };
    }

    return {
      statusCode: 400,
      body: JSON.stringify({
        error: "Invalid action",
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
