exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);

    // FETCH DATABASE
    if (body.databaseId) {
      const response = await fetch(
        `https://api.notion.com/v1/databases/${body.databaseId}/query`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${body.token}`,
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

    // UPDATE QUEST STATUS
    if (body.action === "update") {
      const statusName = body.completed ? "[03_DECRYPTED]" : "[01_ACTIVE]";

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
                  name: statusName,
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
        error: "Invalid request",
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
