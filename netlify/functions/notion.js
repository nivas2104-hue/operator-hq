exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // =========================
    // UPDATE QUEST
    // =========================

    if (body.action === "update") {
      const response = await fetch(
        `https://api.notion.com/v1/pages/${body.pageId}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${body.token}`,
            "Notion-Version": "2022-06-28",
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            properties: {
              Status: {
                select: {
                  name: "[03_DECRYPTED]",
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

    // =========================
    // FETCH QUESTS
    // =========================

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
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};
